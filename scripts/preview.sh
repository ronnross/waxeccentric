#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
PREVIEW_DIR="${PREVIEW_DIR:-.local-preview}"

./scripts/preview-build.sh

cd "$PREVIEW_DIR"
python3 -m http.server "$PORT"