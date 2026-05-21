import { createReadStream, existsSync } from "node:fs";
import { mkdir, readdir, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { config } from "./config.js";

export const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".json": "application/json; charset=utf-8",
};

export async function ensureOutputDir() {
  await mkdir(config.outputDir, { recursive: true });
}

export async function listGenerations() {
  const files = await readdir(config.outputDir).catch(() => []);
  const wavs = [];
  for (const file of files) {
    if (!file.endsWith(".wav")) continue;
    const full = join(config.outputDir, file);
    const info = await stat(full).catch(() => null);
    if (info) wavs.push({ file, mtime: info.mtimeMs, size: info.size });
  }
  return wavs
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, 12)
    .map((item) => ({
      name: item.file,
      url: `/audio/${encodeURIComponent(item.file)}`,
      size: item.size,
      createdAt: new Date(item.mtime).toISOString(),
    }));
}

export function streamOutput(pathname, res, send) {
  const file = normalize(pathname.replace(/^\/(audio|media)\//, ""));
  const full = resolve(config.outputDir, file);
  if (!full.startsWith(config.outputDir) || !existsSync(full)) {
    send(res, 404, "Not found", "text/plain; charset=utf-8");
    return;
  }
  res.writeHead(200, {
    "content-type": mime[extname(full)] || "application/octet-stream",
    "content-disposition": `inline; filename="${file.replaceAll('"', "")}"`,
  });
  createReadStream(full).pipe(res);
}

export function streamStatic(pathname, res, send) {
  const requestPath = pathname === "/" ? "/index.html" : pathname;
  const full = resolve(config.publicDir, `.${requestPath}`);
  if (!full.startsWith(config.publicDir) || !existsSync(full)) {
    send(res, 404, "Not found", "text/plain; charset=utf-8");
    return;
  }
  res.writeHead(200, { "content-type": mime[extname(full)] || "application/octet-stream" });
  createReadStream(full).pipe(res);
}
