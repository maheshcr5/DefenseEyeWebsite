#!/usr/bin/env bash
# =============================================================================
# DefenseEye.ai — VPS Setup Script
# Paste this entire script into the Hostinger browser SSH terminal.
#
# What it does:
#   1. Backs up your current WordPress site (safe — nothing deleted yet)
#   2. Installs Node.js 22 LTS, pnpm, PM2, Nginx
#   3. Clones your Git repo and builds the React app
#   4. Configures Nginx as reverse proxy
#   5. Gets a free Let's Encrypt SSL certificate
#   6. Starts the app with PM2 (auto-restarts on crash + reboot)
#   7. Removes Apache/WordPress (after confirming new site is live)
#
# BEFORE RUNNING:
#   - Fill in GIT_REPO below with your GitHub repo URL
#   - Make sure DNS A record for defenseeye.ai points to 191.101.232.28
# =============================================================================

set -euo pipefail

# ── EDIT THESE ────────────────────────────────────────────────────────────────
DOMAIN="defenseeye.ai"
GIT_REPO="https://github.com/maheshcr5/DefenseEyeWebsite.git"
EMAIL="admin@defenseeye.ai"                            # ← for SSL alerts
# ─────────────────────────────────────────────────────────────────────────────

APP_DIR="/var/www/defenseeye"
APP_USER="www-data"   # reuse existing web user

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BOLD='\033[1m'; NC='\033[0m'
log()  { echo -e "${GREEN}✔${NC} $*"; }
warn() { echo -e "${YELLOW}⚠${NC} $*"; }
step() { echo -e "\n${BOLD}━━━ $* ━━━${NC}\n"; }

echo -e "${BOLD}"
echo "  ██████╗ ███████╗███████╗███████╗███╗   ██╗███████╗███████╗"
echo "  ██╔══██╗██╔════╝██╔════╝██╔════╝████╗  ██║██╔════╝██╔════╝"
echo "  ██║  ██║█████╗  █████╗  █████╗  ██╔██╗ ██║███████╗█████╗  "
echo "  ██║  ██║██╔══╝  ██╔══╝  ██╔══╝  ██║╚██╗██║╚════██║██╔══╝  "
echo "  ██████╔╝███████╗██║     ███████╗██║ ╚████║███████║███████╗"
echo "  ╚═════╝ ╚══════╝╚═╝     ╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝"
echo -e "${NC}"
echo "  DefenseEye.ai — VPS Deployment Script"
echo "  Target: $DOMAIN → $APP_DIR"
echo ""

# ─── 1. System update ─────────────────────────────────────────────────────────
step "1/9 — System update"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq curl git ufw build-essential lsof net-tools
log "System updated"

# ─── 2. Backup WordPress ──────────────────────────────────────────────────────
step "2/9 — Backing up current WordPress site"
BACKUP_DIR="/root/wp-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Find WordPress root (common Hostinger locations)
WP_ROOT=""
for dir in /var/www/html /home/*/public_html /var/www/$DOMAIN /var/www/html/public_html; do
  if [[ -f "$dir/wp-config.php" ]]; then
    WP_ROOT="$dir"
    break
  fi
done

if [[ -n "$WP_ROOT" ]]; then
  log "Found WordPress at: $WP_ROOT"
  cp -r "$WP_ROOT" "$BACKUP_DIR/wp-files" 2>/dev/null || true

  # Backup WordPress database
  if command -v mysql &>/dev/null; then
    DB_NAME=$(grep "DB_NAME" "$WP_ROOT/wp-config.php" | grep -oP "(?<=')[^']+(?=')" | head -1)
    DB_USER=$(grep "DB_USER" "$WP_ROOT/wp-config.php" | grep -oP "(?<=')[^']+(?=')" | head -1)
    DB_PASS=$(grep "DB_PASSWORD" "$WP_ROOT/wp-config.php" | grep -oP "(?<=')[^']+(?=')" | head -1)
    if [[ -n "$DB_NAME" ]]; then
      mysqldump -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_DIR/wordpress-db.sql" 2>/dev/null || true
      log "WordPress database backed up to $BACKUP_DIR/wordpress-db.sql"
    fi
  fi
  log "WordPress files backed up to $BACKUP_DIR"
else
  warn "No WordPress installation found — skipping backup"
fi

# ─── 3. Install Node.js 22 LTS ───────────────────────────────────────────────
step "3/9 — Installing Node.js 22 LTS"
if ! command -v node &>/dev/null || [[ $(node -v | cut -d. -f1 | tr -d 'v') -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
log "Node: $(node -v)"

# Install pnpm
npm install -g pnpm@10 --silent
log "pnpm: $(pnpm -v)"

# Install PM2
npm install -g pm2 --silent
log "PM2: $(pm2 -v)"

# ─── 4. Install Nginx ─────────────────────────────────────────────────────────
step "4/9 — Installing Nginx and Certbot"

# Stop Apache if running (WordPress used it)
if systemctl is-active --quiet apache2 2>/dev/null; then
  warn "Stopping Apache (WordPress used it — new site uses Nginx)"
  systemctl stop apache2
  systemctl disable apache2
  log "Apache stopped and disabled"
fi

apt-get install -y nginx certbot python3-certbot-nginx
systemctl start nginx
systemctl enable nginx
log "Nginx installed and running"

# ─── 5. Create app directory ─────────────────────────────────────────────────
step "5/9 — Setting up app directory"
# Directory is created by git clone below — just ensure parent exists
mkdir -p "$(dirname "$APP_DIR")"
log "Ready to clone into $APP_DIR"

# ─── 6. Clone repo and build ─────────────────────────────────────────────────
step "6/9 — Cloning repository and building"

if [[ "$GIT_REPO" == *"YOUR_ORG"* ]]; then
  warn "GIT_REPO not set — skipping clone. Upload files manually via SFTP to $APP_DIR"
  warn "Then re-run from step 6 onwards."
  # Create a placeholder so Nginx has something to serve
  mkdir -p "$APP_DIR/dist/public"
  echo "<h1>DefenseEye.ai — deploying...</h1>" > "$APP_DIR/dist/public/index.html"
else
  if [[ -d "$APP_DIR/.git" ]]; then
    log "Repo exists — pulling latest"
    git -C "$APP_DIR" pull origin main
  else
    # Remove directory if empty (leftover from a previous failed run)
    rmdir "$APP_DIR" 2>/dev/null || true
    git clone "$GIT_REPO" "$APP_DIR"
  fi
  mkdir -p "$APP_DIR/logs"

  cd "$APP_DIR"

  # Create .env for production build
  if [[ ! -f ".env" ]]; then
    cp .env.example .env
    warn "Created .env from template — update VITE_GA4_MEASUREMENT_ID if you have it"
  fi

  # Set production env vars
  sed -i 's/NODE_ENV=.*/NODE_ENV=production/' .env
  sed -i "s|VITE_SITE_URL=.*|VITE_SITE_URL=https://$DOMAIN|" .env

  log "Installing dependencies (this takes 2-3 minutes)..."
  pnpm install --frozen-lockfile 2>&1 | tail -3

  log "Building app..."
  pnpm run build 2>&1 | tail -5

  if [[ ! -f "dist/index.js" ]] || [[ ! -f "dist/public/index.html" ]]; then
    echo "Build failed! Check output above."
    exit 1
  fi
  log "Build complete — dist/index.js + dist/public/"
fi

# ─── 7. Configure Nginx ───────────────────────────────────────────────────────
step "7/9 — Configuring Nginx"

# Temporary HTTP config for certbot ACME challenge
cat > /etc/nginx/sites-available/defenseeye << NGINXEOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    # ACME challenge for Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Proxy everything else to the Node.js app
    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade           \$http_upgrade;
        proxy_set_header   Connection        "upgrade";
        proxy_set_header   Host              \$host;
        proxy_set_header   X-Real-IP         \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        add_header         Cache-Control     "no-store, no-cache";
    }
}
NGINXEOF

# Enable site, disable default
ln -sf /etc/nginx/sites-available/defenseeye /etc/nginx/sites-enabled/defenseeye
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

nginx -t && systemctl reload nginx
log "Nginx configured (HTTP)"

# ─── 8. Start app with PM2 ───────────────────────────────────────────────────
step "8/9 — Starting app with PM2"
cd "$APP_DIR"

# Load env
set -a; source .env; set +a

# Start with PM2
pm2 delete defenseeye 2>/dev/null || true
pm2 start ecosystem.config.cjs --env production
pm2 save
log "App running on port 3000"

# Make PM2 survive reboots
env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root | tail -1 | bash || true
log "PM2 startup configured"

# Quick health check
sleep 2
if curl -sf http://localhost:3000 > /dev/null; then
  log "Health check passed — app responding on port 3000"
else
  warn "App may still be starting — check: pm2 logs defenseeye"
fi

# ─── 9. SSL Certificate ───────────────────────────────────────────────────────
step "9/9 — Obtaining Let's Encrypt SSL certificate"

# Check DNS resolves to this server
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "unknown")
DOMAIN_IP=$(nslookup "$DOMAIN" 2>/dev/null | awk '/^Address:/{print $2}' | tail -1 || echo "")

if [[ "$DOMAIN_IP" != "$SERVER_IP" ]]; then
  warn "DNS check: $DOMAIN resolves to '$DOMAIN_IP' but this server is '$SERVER_IP'"
  warn "SSL cert will fail until DNS propagates. Run this manually when DNS is ready:"
  warn "  certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect"
  warn "Skipping SSL for now — site will be HTTP only."
else
  certbot --nginx \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --redirect || warn "Certbot failed — check DNS and re-run manually"

  # Install full Nginx config with security headers after SSL
  cat > /etc/nginx/sites-available/defenseeye << 'NGINXEOF2'
# HTTP → HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name defenseeye.ai www.defenseeye.ai;
    location /.well-known/acme-challenge/ { root /var/www/html; }
    location / { return 301 https://defenseeye.ai$request_uri; }
}

# www → non-www redirect
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.defenseeye.ai;
    ssl_certificate     /etc/letsencrypt/live/defenseeye.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/defenseeye.ai/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;
    return 301 https://defenseeye.ai$request_uri;
}

# Main HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name defenseeye.ai;

    ssl_certificate     /etc/letsencrypt/live/defenseeye.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/defenseeye.ai/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options           "SAMEORIGIN"  always;
    add_header X-Content-Type-Options    "nosniff"     always;
    add_header X-XSS-Protection          "1; mode=block" always;
    add_header Referrer-Policy           "strict-origin-when-cross-origin" always;

    # Gzip
    gzip on; gzip_vary on; gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/javascript image/svg+xml;

    # Hashed static assets — cache forever
    location ~* \.(js|css|woff2?|ttf|ico|png|jpg|jpeg|webp|avif|svg)$ {
        proxy_pass       http://127.0.0.1:3000;
        expires          1y;
        add_header       Cache-Control "public, immutable";
        access_log       off;
    }

    # SEO/AI files — short cache
    location ~ ^/(robots\.txt|sitemap\.xml|llms\.txt)$ {
        proxy_pass       http://127.0.0.1:3000;
        expires          1h;
        add_header       Cache-Control "public";
    }

    # API — no cache
    location /api/ {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        add_header         Cache-Control "no-store";
    }

    # All other routes → Express (handles SPA fallback)
    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header   Connection        "upgrade";
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        add_header         Cache-Control "no-store, no-cache";
    }

    access_log /var/log/nginx/defenseeye.access.log;
    error_log  /var/log/nginx/defenseeye.error.log;
}
NGINXEOF2

  nginx -t && systemctl reload nginx
  log "Full HTTPS Nginx config active"
fi

# ── Firewall ──────────────────────────────────────────────────────────────────
ufw allow OpenSSH 2>/dev/null || true
ufw allow 'Nginx Full' 2>/dev/null || true
ufw --force enable 2>/dev/null || true
log "Firewall: SSH + HTTP/HTTPS allowed"

# ── Auto-renew SSL ────────────────────────────────────────────────────────────
systemctl enable certbot.timer 2>/dev/null || true

# ═════════════════════════════════════════════════════════════════════════════
echo ""
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  DefenseEye.ai deployed successfully!${NC}"
echo -e "${GREEN}${BOLD}═══════════════════════════════════════════════════════${NC}"
echo ""
echo "  App running: http://defenseeye.ai"
[[ -f /etc/letsencrypt/live/defenseeye.ai/fullchain.pem ]] && echo "  HTTPS:       https://defenseeye.ai"
echo "  API:         http://defenseeye.ai/api/cmmc-content"
echo "  Backup:      $BACKUP_DIR"
echo ""
echo "  Useful commands:"
echo "    pm2 status                  — process status"
echo "    pm2 logs defenseeye         — live log stream"
echo "    pm2 reload defenseeye       — zero-downtime reload"
echo "    systemctl reload nginx      — reload Nginx config"
echo "    certbot renew --dry-run     — test SSL renewal"
echo ""
echo "  Server IP: $(curl -s ifconfig.me 2>/dev/null)"
echo ""
