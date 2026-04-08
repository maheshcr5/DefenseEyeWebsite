#!/usr/bin/env bash
# =============================================================================
# deploy-now.sh — One-command deploy for DefenseEye.ai
#
# Run from the project root on your Windows machine (Git Bash / WSL2):
#   bash deploy-now.sh
#   bash deploy-now.sh "optional commit message"
#
# What it does:
#   1. Builds the app locally to catch errors before pushing
#   2. Commits any staged/unstaged changes (prompts for message if not passed)
#   3. Pushes to GitHub (maheshcr5/DefenseEyeWebsite)
#   4. SSHs into the Hostinger VPS and runs the zero-downtime update script
# =============================================================================

set -euo pipefail

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log()  { echo -e "${GREEN}[deploy]${NC} $*"; }
warn() { echo -e "${YELLOW}[warn]${NC} $*"; }
err()  { echo -e "${RED}[error]${NC} $*"; exit 1; }

VPS_HOST="hostinger-cmmc"      # matches ~/.ssh/config alias
APP_DIR="/var/www/defenseeye"

# ─── 1. Local build check ─────────────────────────────────────────────────────
log "Building locally to verify no errors..."
NODE_OPTIONS="--max-old-space-size=4096" pnpm run build || err "Local build failed — fix errors before deploying"
log "Build passed ✓"

# ─── 2. Commit changes ────────────────────────────────────────────────────────
COMMIT_MSG="${1:-}"

# Stage all tracked modifications (not untracked files like .env)
CHANGED=$(git diff --name-only HEAD | grep -v "^\.claude/" || true)
if [[ -n "$CHANGED" ]]; then
  log "Staging changes..."
  git add $CHANGED
fi

# Only commit if there's something to commit
if git diff --cached --quiet; then
  warn "Nothing new to commit — pushing existing HEAD"
else
  if [[ -z "$COMMIT_MSG" ]]; then
    read -rp "Commit message: " COMMIT_MSG
    [[ -z "$COMMIT_MSG" ]] && COMMIT_MSG="feat: update defenseeye.ai"
  fi
  git commit -m "$COMMIT_MSG

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
  log "Committed: $COMMIT_MSG"
fi

# ─── 3. Push to GitHub ────────────────────────────────────────────────────────
log "Pushing to GitHub..."
git push origin main
log "Pushed ✓"

# ─── 4. Deploy on VPS ─────────────────────────────────────────────────────────
log "Connecting to VPS ($VPS_HOST) and running update..."
ssh "$VPS_HOST" "cd $APP_DIR && bash deploy/update.sh"

# ─── 5. Smoke test ────────────────────────────────────────────────────────────
log "Smoke testing live site..."
STATUS=$(ssh "$VPS_HOST" "curl -s -o /dev/null -w '%{http_code}' https://defenseeye.ai")
if [[ "$STATUS" == "200" ]]; then
  echo ""
  echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}  Deployed successfully! https://defenseeye.ai ${NC}"
  echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
else
  err "Site returned HTTP $STATUS — check 'pm2 logs defenseeye' on VPS"
fi
