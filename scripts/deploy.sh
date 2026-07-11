#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/apps/waxeccentric}"
DEPLOY_DIR="${DEPLOY_DIR:-/var/www/www.waxeccentric.com/html}"
BUILD_DIR="out"

cd "$APP_DIR"
git pull
npm install
npm run build
rsync -av --delete "$BUILD_DIR/" "$DEPLOY_DIR/"
