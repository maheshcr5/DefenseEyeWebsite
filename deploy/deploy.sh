#!/usr/bin/env bash
# =============================================================================
# deploy.sh — DefenseEye.ai Full VPS Initial Setup & Deploy
# Run once on a fresh Hostinger VPS (Ubuntu 22.04 LTS)
#
# Usage:
#   chmod +x deploy.sh
#   sudo ./deploy.sh
#
# What this does:
#   1. Updates system packages
#   2. Installs Node.js 20 LTS, pnpm, PM2, Nginx, Certbot
#   3. Creates deploy user + app directory
#   4. Clones your repo from Git
#   5. Copies .env and builds the app
#   6. Installs Nginx config and starts it
#   7. Obtains Let's Encrypt SSL certificate
#   8. Starts the app under PM2 with auto-restart on reboot
# =============================================================================

set -euo pipefail

# ── Config — EDIT THESE before running ────────────────────────────────────────
DOMAIN="defenseeye.ai"
GIT_REPO="https://github.com/YOUR_ORG/YOUR_REPO.git"   # ← change this
APP_DIR="/var/www/defenseeye"
APP_USER="defenseeye"
EMAIL="admin@defenseeye.ai"                             # ← for Let's Encrypt
# ──────────────────────────────────────────────────────────────────────────────

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[deploy]${NC} $*"; }
warn() { echo -e "${YELLOW}[warn]${NC} $*"; }
step() { echo -e "\n${BOLD}══ $* ══${NC}\n"; }

# Must run as root
if [[ $EUID -ne 0 ]]; then
  echo "Run this script as root: sudo ./deploy.sh"
  exit 1
fi

# ─── 1. System update ─────────────────────────────────────────────────────────
step "1/8 — Updating system packages"
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq curl git ufw build-essential

# ─── 2. Install Node.js 20 LTS ───────────────────────────────────────────────
step "2/8 — Installing Node.js 20 LTS"
if ! command -v node &>/dev/null || [[ $(node -v | cut -d. -f1 | tr -d 'v') -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
log "Node: $(node -v)  NPM: $(npm -v)"

# Install pnpm
npm install -g pnpm@latest
log "pnpm: $(pnpm -v)"

# Install PM2
npm install -g pm2
log "PM2: $(pm2 -v)"

# ─── 3. Install Nginx + Certbot ───────────────────────────────────────────────
step "3/8 — Installing Nginx and Certbot"
apt-get install -y nginx certbot python3-certbot-nginx

# ─── 4. Create app user and directory ────────────────────────────────────────
step "4/8 — Creating app user and directory"
if ! id "$APP_USER" &>/dev/null; then
  useradd -r -s /bin/bash -m -d /home/$APP_USER $APP_USER
  log "Created user: $APP_USER"
fi

mkdir -p "$APP_DIR"
mkdir -p "$APP_DIR/logs"
chown -R $APP_USER:$APP_USER "$APP_DIR"

# ─── 5. Clone / pull repo ─────────────────────────────────────────────────────
step "5/8 — Cloning repository"
if [[ -d "$APP_DIR/.git" ]]; then
  log "Repo already exists — pulling latest"
  sudo -u $APP_USER git -C "$APP_DIR" pull origin main
else
  sudo -u $APP_USER git clone "$GIT_REPO" "$APP_DIR"
fi

# ─── 6. Copy .env and build ───────────────────────────────────────────────────
step "6/8 — Building application"
if [[ ! -f "$APP_DIR/.env" ]]; then
  warn ".env not found at $APP_DIR/.env"
  warn "Copy your .env file to $APP_DIR/.env before continuing."
  warn "Template: $APP_DIR/.env.example"
  read -rp "Press ENTER after copying .env, or Ctrl+C to abort..." _
fi

cd "$APP_DIR"
sudo -u $APP_USER pnpm install --frozen-lockfile
sudo -u $APP_USER pnpm run build
log "Build complete → dist/"

# ─── 7. Configure Nginx ───────────────────────────────────────────────────────
step "7/8 — Configuring Nginx"

# Copy our Nginx config
cp "$APP_DIR/deploy/nginx/defenseeye.conf" /etc/nginx/sites-available/defenseeye

# Substitute actual domain if different from default
sed -i "s/defenseeye.ai/$DOMAIN/g" /etc/nginx/sites-available/defenseeye

# Enable site
ln -sf /etc/nginx/sites-available/defenseeye /etc/nginx/sites-enabled/defenseeye
rm -f /etc/nginx/sites-enabled/default   # remove default site

# Temporary HTTP-only config so certbot can do ACME challenge
# (certbot will upgrade the config to HTTPS automatically)
cat > /etc/nginx/sites-available/defenseeye-temp << NGINXEOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root /var/www/html;
    location /.well-known/acme-challenge/ { root /var/www/html; }
    location / { return 301 https://$DOMAIN\$request_uri; }
}
NGINXEOF
cp /etc/nginx/sites-available/defenseeye-temp /etc/nginx/sites-available/defenseeye

nginx -t && systemctl reload nginx
log "Nginx running"

# ─── 8. SSL Certificate ───────────────────────────────────────────────────────
step "8/8 — Obtaining SSL certificate"
certbot --nginx \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "$EMAIL" \
  --redirect

# Now install the full Nginx config (with SSL)
cp "$APP_DIR/deploy/nginx/defenseeye.conf" /etc/nginx/sites-available/defenseeye
sed -i "s/defenseeye.ai/$DOMAIN/g" /etc/nginx/sites-available/defenseeye
nginx -t && systemctl reload nginx
log "SSL active — https://$DOMAIN"

# Set up certbot auto-renewal
systemctl enable certbot.timer
log "Certbot auto-renewal enabled"

# ─── Firewall ─────────────────────────────────────────────────────────────────
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
log "Firewall: SSH + HTTP/HTTPS allowed"

# ─── Start app with PM2 ───────────────────────────────────────────────────────
step "Starting DefenseEye with PM2"
cd "$APP_DIR"

# Load .env into the shell before PM2 starts
set -a; source .env; set +a

sudo -u $APP_USER pm2 start ecosystem.config.cjs --env production
sudo -u $APP_USER pm2 save

# Make PM2 start on boot (as root, pointing at the app user's PM2)
env PATH=$PATH:/usr/bin pm2 startup systemd -u $APP_USER --hp /home/$APP_USER
systemctl enable pm2-$APP_USER

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  DefenseEye.ai deployed successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "  Site:  https://$DOMAIN"
echo "  API:   https://$DOMAIN/api/cmmc-content"
echo "  Logs:  pm2 logs defenseeye"
echo ""
echo "  Next steps:"
echo "  1. Verify site loads: curl -I https://$DOMAIN"
echo "  2. Check PM2 status: pm2 status"
echo "  3. Point your DNS A record to: $(curl -s ifconfig.me)"
echo ""
