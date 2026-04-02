#!/usr/bin/env bash
# =============================================================================
# update.sh — Zero-downtime update for DefenseEye.ai
# Run from the VPS as root or the defenseeye user whenever you push new code.
#
# Usage:
#   sudo ./deploy/update.sh
# =============================================================================

set -euo pipefail

APP_DIR="/var/www/defenseeye"
APP_USER="root"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${GREEN}[update]${NC} $*"; }
warn() { echo -e "${YELLOW}[warn]${NC} $*"; }

cd "$APP_DIR"

log "Pulling latest code..."
sudo -u $APP_USER git pull origin main

log "Installing dependencies..."
sudo -u $APP_USER pnpm install --frozen-lockfile

log "Building..."
sudo -u $APP_USER pnpm run build

log "Reloading PM2 (zero-downtime)..."
sudo -u $APP_USER pm2 reload defenseeye --update-env

log "Verifying process is up..."
sleep 2
sudo -u $APP_USER pm2 show defenseeye | grep -E "status|restarts|uptime"

log "Reloading Nginx..."
nginx -t && systemctl reload nginx

echo ""
echo -e "${GREEN}Update complete!${NC}  https://defenseeye.ai"
echo "Run 'pm2 logs defenseeye' to watch live logs."
