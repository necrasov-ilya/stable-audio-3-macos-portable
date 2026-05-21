import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { basename, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { config } from "./config.js";
import { getModel, listModels } from "./models.js";
import { listGenerations } from "./files.js";

let activeJob = null;

function clampNumber(value, fallback, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function sanitizePrompt(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 1200);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 20_000) req.destroy();
    });
    req.on("error", reject);
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
  });
}

export function authStatus() {
  return {
    authenticated: Boolean(
      process.env.HF_TOKEN ||
        process.env.HUGGING_FACE_HUB_TOKEN ||
        existsSync(join(process.env.HOME || "", ".cache", "huggingface", "token"))
    ),
    command: "hf auth login",
  };
}

function appendLog(job, chunk) {
  const text = chunk.toString();
  job.logs.push(text);
  const joined = job.logs.join("");
  if (joined.length > 12000) job.logs = [joined.slice(-10000)];
}

function runProcess(job, command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: config.sa3Dir, env: { ...process.env, ...options.env } });
    child.stdout.on("data", (chunk) => appendLog(job, chunk));
    child.stderr.on("data", (chunk) => appendLog(job, chunk));
    child.on("error", reject);
    child.on("close", (code) => resolve(code));
  });
}

export function jobStatus() {
  return {
    busy: Boolean(activeJob),
    job: activeJob
      ? {
          type: activeJob.type,
          startedAt: activeJob.startedAt,
          model: activeJob.model,
          prompt: activeJob.prompt,
          logs: activeJob.logs.join(""),
        }
      : null,
  };
}

export async function generate(req) {
  if (activeJob) return { status: 409, body: { error: "Another task is already running." } };

  let input;
  try {
    input = await readJson(req);
  } catch {
    return { status: 400, body: { error: "Bad JSON body." } };
  }

  const prompt = sanitizePrompt(input.prompt);
  if (!prompt) return { status: 400, body: { error: "Prompt is empty." } };

  const model = getModel(input.model);
  const seconds = clampNumber(input.seconds, 30, 1, model.maxSeconds);
  const steps = Math.round(clampNumber(input.steps, 8, 1, 24));
  const cfg = clampNumber(input.cfg, 1, -2, 12);
  const apg = clampNumber(input.apg, 1, 0, 1);
  const initNoiseLevel = clampNumber(input.initNoiseLevel, 1, 0.01, 2);
  const seedInput = Number(input.seed);
  const seed = Number.isInteger(seedInput) ? seedInput : Math.floor(Math.random() * 2 ** 31);
  const negativePrompt = sanitizePrompt(input.negativePrompt);
  const dtype = input.dtype === "fp32" ? "fp32" : "fp16";
  const keepModels = Boolean(input.keepModels);
  const outName = `${new Date().toISOString().replace(/[:.]/g, "-")}-${model.id}-${randomUUID().slice(0, 8)}.wav`;
  const outPath = join(config.outputDir, outName);

  const args = [
    "--prompt", prompt,
    "--dit", model.id,
    "--decoder", model.decoder,
    "--seconds", String(seconds),
    "--steps", String(steps),
    "--seed", String(seed),
    "--cfg", String(cfg),
    "--apg", String(apg),
    "--init-noise-level", String(initNoiseLevel),
    "--dit-dtype", dtype,
    "--out", outPath,
  ];
  if (negativePrompt) args.push("--negative-prompt", negativePrompt);
  if (keepModels) args.push("--no-free-models");

  activeJob = { type: "generate", startedAt: Date.now(), model: model.id, prompt, logs: [] };
  const code = await runProcess(activeJob, config.sa3Bin, args);
  const logs = activeJob.logs.join("");
  activeJob = null;

  if (code !== 0 || !existsSync(outPath)) {
    return { status: 500, body: { error: "Generation failed.", code, logs } };
  }
  return {
    status: 200,
    body: {
      url: `/audio/${encodeURIComponent(outName)}`,
      name: outName,
      model: model.label,
      settings: { seconds, steps, seed, cfg, apg, initNoiseLevel, dtype },
      logs,
      history: await listGenerations(),
    },
  };
}

export async function downloadModel(req) {
  if (activeJob) return { status: 409, body: { error: "Another task is already running." } };

  let input;
  try {
    input = await readJson(req);
  } catch {
    return { status: 400, body: { error: "Bad JSON body." } };
  }

  const model = getModel(input.model);
  activeJob = { type: "download", startedAt: Date.now(), model: model.id, prompt: "", logs: [] };
  const python = join(config.sa3Dir, ".venv", "bin", "python");
  const script = join(config.sa3Dir, "scripts", "install.py");
  const code = await runProcess(activeJob, python, [script, "--download", model.bundle], { env: { INSTALL_SKIP_PIP: "1" } });
  const logs = activeJob.logs.join("");
  activeJob = null;

  if (code !== 0) return { status: 500, body: { error: "Model download failed.", code, logs, models: listModels() } };
  return { status: 200, body: { models: listModels(), logs } };
}

export async function exportMp4(req) {
  let input;
  try {
    input = await readJson(req);
  } catch {
    return { status: 400, body: { error: "Bad JSON body." } };
  }

  const name = basename(String(input.name || ""));
  if (!name.endsWith(".wav")) return { status: 400, body: { error: "Select a WAV render first." } };

  const inputPath = resolve(config.outputDir, name);
  if (!inputPath.startsWith(config.outputDir) || !existsSync(inputPath)) {
    return { status: 404, body: { error: "WAV file not found." } };
  }

  const outputName = name.replace(/\.wav$/i, ".mp4");
  const outputPath = join(config.outputDir, outputName);
  const job = { type: "export", startedAt: Date.now(), model: "", prompt: "", logs: [] };
  const code = await runProcess(job, "/usr/bin/afconvert", [inputPath, outputPath, "-f", "mp4f", "-d", "aac"]);
  const logs = job.logs.join("");

  if (code !== 0 || !existsSync(outputPath)) {
    return { status: 500, body: { error: "MP4 export failed. macOS afconvert is required.", code, logs } };
  }
  return {
    status: 200,
    body: {
      name: outputName,
      url: `/media/${encodeURIComponent(outputName)}`,
      logs,
    },
  };
}
