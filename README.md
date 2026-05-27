# Stable Audio 3 Local UI for macOS 
---
## RU
Минимальный локальный интерфейс для Stable Audio 3 на Apple Silicon. Он запускается в браузере и использует официальный MLX runtime от Stability AI.

Требования

* macOS на Apple Silicon
* Node.js 20 или новее
* Git

Запуск

Откройте start.command.

При первом запуске он:

* клонирует официальный runtime Stable Audio 3 в эту папку
* создаст Python-окружение MLX
* будет хранить загрузки Hugging Face в .hf-cache внутри этой папки
* запустит веб-интерфейс

Затем откройте:

http://127.0.0.1:3847

Модели

Интерфейс показывает статус моделей и кнопки загрузки.

* Medium: лучшее локальное качество
* Small Music: быстрые музыкальные черновики
* Small SFX: звуковые эффекты и текстуры

Если Hugging Face не авторизован, загрузка моделей может быть медленнее или ограничена. Используйте:

hf auth login

Рекомендуемые настройки

* Model: Medium
* Seconds: 30
* Steps: 8
* CFG: 1
* DType: fp16

Используйте фиксированный seed, когда нужно воспроизвести результат.

Файлы

Сгенерированные файлы сохраняются в:

stability-audio-3-src/optimized/mlx/output/ui

Используйте плеер в интерфейсе, чтобы прослушать результат, Download WAV, чтобы сохранить аудио, или Export MP4, чтобы создать AAC MP4-файл.

Runtime-файлы, веса моделей и сгенерированное аудио остаются внутри папки проекта при запуске через start.command. Они игнорируются Git.


---
## EN

Minimal local interface for Stable Audio 3 on Apple Silicon. It runs in your browser and uses the official Stability AI MLX runtime.

### Requirements

- macOS on Apple Silicon
- Node.js 20 or newer
- Git

### Start

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

### Models

The interface shows model status and download buttons.

- Medium: best local quality
- Small Music: fast music drafts
- Small SFX: sound effects and textures

If Hugging Face is not authorized, model downloads may be slower or limited. Use:

```bash
hf auth login
```

### Recommended Settings

- Model: Medium
- Seconds: 30
- Steps: 8
- CFG: 1
- DType: fp16

Use a fixed seed when you want to reproduce a result.

### Files

Generated files are saved in:

```text
stability-audio-3-src/optimized/mlx/output/ui
```

Use the player in the interface to listen, `Download WAV` to save audio, or `Export MP4` to create an AAC MP4 file.

Runtime files, model weights, and generated audio stay inside this project folder when launched with `start.command`. They are ignored by Git.
