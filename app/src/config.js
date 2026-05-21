import { resolve, join } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sa3Dir = resolve(process.env.SA3_MLX_DIR || join(root, "../stability-audio-3-src/optimized/mlx"));

export const config = {
  root,
  host: process.env.HOST || "127.0.0.1",
  port: Number(process.env.PORT || 3847),
  publicDir: join(root, "public"),
  sa3Dir,
  outputDir: join(sa3Dir, "output", "ui"),
  sa3Bin: join(sa3Dir, "sa3"),
};
