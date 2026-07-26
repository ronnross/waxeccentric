#!/usr/bin/env bash
set -euo pipefail

PREVIEW_DIR="${PREVIEW_DIR:-.local-preview}"
WWW_BUILD_DIR="apps/www/out"
VERSE_BUILD_DIR="apps/verse/out"

pnpm run build
rm -rf "$PREVIEW_DIR"
mkdir -p "$PREVIEW_DIR/verse"
cp -R "$WWW_BUILD_DIR/." "$PREVIEW_DIR/"
cp -R "$VERSE_BUILD_DIR/." "$PREVIEW_DIR/verse/"

echo "Preview assembled in $PREVIEW_DIR"