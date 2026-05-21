import { config } from "./config.js";
import { ensureOutputDir, listGenerations, streamOutput, streamStatic } from "./files.js";
import { authStatus, downloadModel, exportMp4, generate, jobStatus } from "./jobs.js";
import { listModels } from "./models.js";

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "content-type": type });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}

async function route(req, res) {
  const url = new URL(req.url, `http://${config.host}:${config.port}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === "/api/status") return send(res, 200, jobStatus());
  if (pathname === "/api/history") return send(res, 200, { history: await listGenerations() });
  if (pathname === "/api/models") return send(res, 200, { models: listModels() });
  if (pathname === "/api/auth") return send(res, 200, authStatus());
  if (pathname === "/api/generate" && req.method === "POST") {
    const result = await generate(req);
    return send(res, result.status, result.body);
  }
  if (pathname === "/api/models/download" && req.method === "POST") {
    const result = await downloadModel(req);
    return send(res, result.status, result.body);
  }
  if (pathname === "/api/export/mp4" && req.method === "POST") {
    const result = await exportMp4(req);
    return send(res, result.status, result.body);
  }
  if (pathname.startsWith("/audio/") || pathname.startsWith("/media/")) return streamOutput(pathname, res, send);
  return streamStatic(pathname, res, send);
}

export async function createApp() {
  await ensureOutputDir();
  return { handle: route, send };
}
