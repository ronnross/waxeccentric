#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/apps/waxeccentric}"
DEPLOY_DIR="${DEPLOY_DIR:-/var/www/www.waxeccentric.com/html}"
WWW_BUILD_DIR="apps/www/out"
VERSE_BUILD_DIR="apps/verse/out"

cd "$APP_DIR"
git pull
npm install
npm run build
rsync -av --delete --exclude "/verse/" "$WWW_BUILD_DIR/" "$DEPLOY_DIR/"
rsync -av --delete "$VERSE_BUILD_DIR/" "$DEPLOY_DIR/verse/"
