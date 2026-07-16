#!/usr/bin/env bash
# =============================================================================
# deploy-hostinger.sh — Hostinger VPS Production Deploy
#
# Usage (from local terminal / WSL / Git Bash):
#   bash deploy-hostinger.sh [SSH_USER]
#
# Default SSH_USER is 'root'. E.g.:
#   bash deploy-hostinger.sh root
# =============================================================================

set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; NC='\033[0m'
log()  { echo -e "${GREEN}[deploy]${NC} $*"; }
warn() { echo -e "${YELLOW}[warn]${NC} $*"; }
info() { echo -e "${BLUE}[info]${NC} $*"; }
err()  { echo -e "${RED}[error]${NC} $*"; exit 1; }

VPS_HOST="${1:-hostinger-cmmc}"
TARGET_PORT="3000"
APP_DIR="/var/www/defenseeye"

log "Target Hostinger VPS Host: ${VPS_HOST} (Port ${TARGET_PORT})"

# ── 1. Push latest code to GitHub main ─────────────────────────────────────────
info "Step 1/5: Verifying local git branch and pushing main..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  warn "Current local branch is '$CURRENT_BRANCH', switching/verifying main..."
fi

git push origin main || err "Failed to push to GitHub main branch."
log "Pushed latest code to main ✓"

# ── 2. Remote VPS Execution ───────────────────────────────────────────────────
info "Step 2/5: Executing deployment commands on Hostinger VPS..."

ssh "$VPS_HOST" bash -s <<REMOTE_SCRIPT
set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log() { echo -e "\${GREEN}[vps-deploy]\${NC} \$*"; }

APP_DIR="${APP_DIR}"
TARGET_PORT="${TARGET_PORT}"

# Ensure directory exists
if [ ! -d "\$APP_DIR" ]; then
  log "Creating application directory at \$APP_DIR..."
  mkdir -p "\$APP_DIR"
  git clone https://github.com/maheshcr5/DefenseEyeWebsite.git "\$APP_DIR"
fi

cd "\$APP_DIR"

log "Pulling latest code from main branch..."
git fetch origin main
git reset --hard origin/main

log "Installing dependencies with pnpm..."
pnpm install

log "Executing production build (pnpm run build)..."
pnpm run build

log "Configuring PM2 process bound to port \${TARGET_PORT}..."
export PORT="\${TARGET_PORT}"
export NODE_ENV="production"

if pm2 list | grep -q "defenseeye"; then
  log "Reloading existing PM2 application with PORT=\${TARGET_PORT}..."
  PORT=\${TARGET_PORT} NODE_ENV=production pm2 reload defenseeye --update-env
else
  log "Starting new PM2 application instance..."
  PORT=\${TARGET_PORT} NODE_ENV=production pm2 start ecosystem.config.cjs --env production
fi

pm2 save

log "Checking UFW firewall & open sockets for port \${TARGET_PORT}..."
if command -v ufw &>/dev/null; then
  if ufw status | grep -q "Status: active"; then
    log "Enabling UFW rule for port \${TARGET_PORT}..."
    ufw allow \${TARGET_PORT}/tcp || true
  fi
fi

log "Verifying process listening status on port \${TARGET_PORT}..."
sleep 2
if command -v ss &>/dev/null; then
  ss -tulnp | grep "\${TARGET_PORT}" || echo "Warning: Port \${TARGET_PORT} not detected in ss output yet."
elif command -v netstat &>/dev/null; then
  netstat -tulnp | grep "\${TARGET_PORT}" || echo "Warning: Port \${TARGET_PORT} not detected in netstat output yet."
fi

log "VPS Deployment script executed successfully ✓"
REMOTE_SCRIPT

log "Deployment completed successfully on ${VPS_HOST} app port ${TARGET_PORT}!"
