#!/bin/zsh
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$ROOT_DIR/app"
RUNTIME_DIR="$ROOT_DIR/stability-audio-3-src"
MLX_DIR="$RUNTIME_DIR/optimized/mlx"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install it from https://nodejs.org or with Homebrew:"
  echo "brew install node"
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "Git is required. Install Xcode Command Line Tools:"
  echo "xcode-select --install"
  exit 1
fi

if [ ! -d "$MLX_DIR" ]; then
  echo "Installing Stable Audio 3 runtime into this folder..."
  git clone --depth 1 https://github.com/Stability-AI/stable-audio-3.git "$RUNTIME_DIR"
fi

if [ ! -x "$MLX_DIR/.venv/bin/python" ]; then
  echo "Preparing MLX environment..."
  (cd "$MLX_DIR" && ./install.sh -y)
fi

export SA3_MLX_DIR="$MLX_DIR"
export HF_HOME="$ROOT_DIR/.hf-cache"
export HUGGINGFACE_HUB_CACHE="$HF_HOME/hub"

cd "$APP_DIR"
echo "Starting Stable Audio 3 UI..."
echo "Open http://127.0.0.1:${PORT:-3847}"
npm start
