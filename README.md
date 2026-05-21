# Stable Audio 3 Local UI for macOS

Minimal local interface for Stable Audio 3 on Apple Silicon. It runs in your browser and uses the official Stability AI MLX runtime.

## Requirements

- macOS on Apple Silicon
- Node.js 20 or newer
- Git

## Start

Open `start.command`.

On first launch it will:

- clone the official Stable Audio 3 runtime into this folder
- create the MLX Python environment
- keep Hugging Face downloads in `.hf-cache` inside this folder
- start the web interface

Then open:

```text
http://127.0.0.1:3847
```

## Models

The interface shows model status and download buttons.

- Medium: best local quality
- Small Music: fast music drafts
- Small SFX: sound effects and textures

If Hugging Face is not authorized, model downloads may be slower or limited. Use:

```bash
hf auth login
```

## Recommended Settings

- Model: Medium
- Seconds: 30
- Steps: 8
- CFG: 1
- DType: fp16

Use a fixed seed when you want to reproduce a result.

## Files

Generated files are saved in:

```text
stability-audio-3-src/optimized/mlx/output/ui
```

Use the player in the interface to listen, `Download WAV` to save audio, or `Export MP4` to create an AAC MP4 file.

Runtime files, model weights, and generated audio stay inside this project folder when launched with `start.command`. They are ignored by Git.
