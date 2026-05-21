import { existsSync } from "node:fs";
import { join } from "node:path";
import { config } from "./config.js";

export const models = {
  medium: {
    id: "medium",
    label: "Stable Audio 3 Medium",
    decoder: "same-l",
    maxSeconds: 380,
    bundle: "medium",
    use: "highest local quality",
    files: ["dit_medium_f16.npz", "same_l_decoder_f32.npz", "same_l_encoder_f32.npz", "t5gemma_f16.npz"],
  },
  "sm-music": {
    id: "sm-music",
    label: "Stable Audio 3 Small Music",
    decoder: "same-s",
    maxSeconds: 120,
    bundle: "sm-music",
    use: "fast music sketches",
    files: ["dit_sm-music_f16.npz", "same_s_decoder_f32.npz", "same_s_encoder_f32.npz", "t5gemma_f16.npz"],
  },
  "sm-sfx": {
    id: "sm-sfx",
    label: "Stable Audio 3 Small SFX",
    decoder: "same-s",
    maxSeconds: 120,
    bundle: "sm-sfx",
    use: "effects and textures",
    files: ["dit_sm-sfx_f16.npz", "same_s_decoder_f32.npz", "same_s_encoder_f32.npz", "t5gemma_f16.npz"],
  },
};

export function getModel(id) {
  return models[id] || models.medium;
}

export function modelStatus(model) {
  const present = model.files.filter((file) => existsSync(join(config.sa3Dir, "models", "mlx", file)));
  return {
    ...model,
    installed: present.length === model.files.length,
    present: present.length,
    total: model.files.length,
  };
}

export function listModels() {
  return Object.values(models).map(modelStatus);
}
