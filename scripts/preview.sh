#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
PREVIEW_DIR="${PREVIEW_DIR:-.local-preview}"

if [[ ! -f "$PREVIEW_DIR/index.html" || ! -f "$PREVIEW_DIR/verse/index.html" ]]; then
  ./scripts/preview-build.sh
fi

cd "$PREVIEW_DIR"
python3 -m http.server "$PORT"