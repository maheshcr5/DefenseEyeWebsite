# DefenseEye.ai — Hostinger VPS Deployment Guide

Complete step-by-step instructions for deploying defenseeye.ai to a Hostinger VPS (Ubuntu 22.04 LTS) with Node.js, PM2, Nginx, and Let's Encrypt SSL.

---

## Prerequisites

| Item | Details |
|---|---|
| Hostinger VPS plan | KVM 2 or higher recommended (2 vCPU, 8 GB RAM) |
| OS | Ubuntu 22.04 LTS (select during VPS setup) |
| Domain | defenseeye.ai (already pointed to Hostinger nameservers) |
| Git repository | Your code pushed to GitHub/GitLab |
| Local machine | Windows with Git Bash, WSL2, or PuTTY |

---

## Part 1 — Hostinger VPS Setup

### 1.1 Create VPS in Hostinger Panel

1. Log in to [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Go to **VPS** → **Create new VPS**
3. Select: **KVM 2** (or higher), **Ubuntu 22.04**, your nearest datacenter
4. Set a root password or add your SSH public key (SSH key is strongly recommended)
5. Note the VPS IP address shown after creation

### 1.2 Point DNS to VPS IP

In Hostinger DNS Manager (or wherever defenseeye.ai DNS is managed):

| Type | Host | Value | TTL |
|---|---|---|---|
| A | @ | `<YOUR VPS IP>` | 3600 |
| A | www | `<YOUR VPS IP>` | 3600 |

DNS propagation takes 5–30 minutes. Verify with:
```bash
nslookup defenseeye.ai
# Should return your VPS IP
```

### 1.3 SSH into VPS

```bash
# From your Windows machine (Git Bash / WSL2 / PuTTY):
ssh root@<YOUR_VPS_IP>

# If you used an SSH key:
ssh -i ~/.ssh/your-key root@<YOUR_VPS_IP>
```

---

## Part 2 — Automated Deployment (Recommended)

### 2.1 Push code to GitHub first

On your local machine (in the project folder):

```bash
git init
git add .
git commit -m "Initial deployment"
git remote add origin https://github.com/YOUR_ORG/YOUR_REPO.git
git push -u origin main
```

### 2.2 Edit deploy.sh with your details

Open `deploy/deploy.sh` and update these three lines at the top:

```bash
DOMAIN="defenseeye.ai"
GIT_REPO="https://github.com/YOUR_ORG/YOUR_REPO.git"   # ← your repo URL
EMAIL="admin@defenseeye.ai"                             # ← for SSL cert alerts
```

### 2.3 Run the deploy script on the VPS

```bash
# On the VPS (as root):
git clone https://github.com/YOUR_ORG/YOUR_REPO.git /tmp/defenseeye-deploy
cd /tmp/defenseeye-deploy
chmod +x deploy/deploy.sh
```

**Before running, create your .env file:**

```bash
cp .env.example /var/www/defenseeye/.env
# Or create the directory first:
mkdir -p /var/www/defenseeye
cp .env.example /var/www/defenseeye/.env
nano /var/www/defenseeye/.env
```

Fill in `.env` with your real values:
```env
PORT=3000
NODE_ENV=production
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ANALYTICS_ENDPOINT=https://analytics.defenseeye.ai
VITE_ANALYTICS_WEBSITE_ID=your-umami-id
VITE_SITE_URL=https://defenseeye.ai
```

Now run the deploy script:
```bash
sudo ./deploy/deploy.sh
```

The script handles everything: Node.js, pnpm, PM2, Nginx, SSL certificate, firewall, and startup configuration.

---

## Part 3 — Manual Deployment (Step by Step)

If you prefer to run each step manually or the automated script fails:

### 3.1 Install Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node -v   # Should show v20.x.x
```

### 3.2 Install pnpm and PM2

```bash
npm install -g pnpm pm2
pnpm -v   # Verify pnpm installed
pm2 -v    # Verify PM2 installed
```

### 3.3 Install Nginx and Certbot

```bash
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx
systemctl start nginx
systemctl enable nginx
```

### 3.4 Create app directory and user

```bash
useradd -r -s /bin/bash -m -d /home/defenseeye defenseeye
mkdir -p /var/www/defenseeye/logs
chown -R defenseeye:defenseeye /var/www/defenseeye
```

### 3.5 Clone repository

```bash
sudo -u defenseeye git clone https://github.com/YOUR_ORG/YOUR_REPO.git /var/www/defenseeye
```

### 3.6 Create .env file

```bash
cp /var/www/defenseeye/.env.example /var/www/defenseeye/.env
nano /var/www/defenseeye/.env   # Fill in your values
```

### 3.7 Build the application

```bash
cd /var/www/defenseeye
sudo -u defenseeye pnpm install --frozen-lockfile
sudo -u defenseeye pnpm run build
ls dist/   # Should see: index.js  public/
ls dist/public/   # Should see: index.html  assets/  robots.txt  sitemap.xml  llms.txt
```

### 3.8 Configure Nginx

```bash
# Copy the Nginx config
cp /var/www/defenseeye/deploy/nginx/defenseeye.conf /etc/nginx/sites-available/defenseeye

# Enable it
ln -s /etc/nginx/sites-available/defenseeye /etc/nginx/sites-enabled/defenseeye
rm -f /etc/nginx/sites-enabled/default

# Test config
nginx -t   # Must show: syntax is ok / test is successful

# For now, use a temporary HTTP-only config so certbot can run ACME challenge:
# (Edit the file to comment out the SSL lines temporarily, or use certbot's built-in)
```

### 3.9 Obtain SSL certificate

```bash
# Make sure DNS is already pointing to this server
certbot --nginx -d defenseeye.ai -d www.defenseeye.ai \
  --non-interactive --agree-tos --email admin@defenseeye.ai --redirect
```

Certbot automatically modifies your Nginx config to add SSL. Then reload:
```bash
nginx -t && systemctl reload nginx
```

### 3.10 Start with PM2

```bash
cd /var/www/defenseeye

# Load env vars
set -a; source .env; set +a

# Start the app
sudo -u defenseeye pm2 start ecosystem.config.cjs --env production

# Save PM2 state (survives reboots)
sudo -u defenseeye pm2 save

# Enable PM2 startup on boot
env PATH=$PATH:/usr/bin pm2 startup systemd -u defenseeye --hp /home/defenseeye
systemctl enable pm2-defenseeye
```

### 3.11 Configure Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'   # Opens 80 and 443
ufw enable
ufw status   # Verify rules
```

---

## Part 4 — Verify Deployment

```bash
# 1. Check PM2 process is running
pm2 status
pm2 logs defenseeye --lines 20

# 2. Test the Express server directly
curl http://localhost:3000
# Should return HTML

# 3. Test through Nginx (HTTPS)
curl -I https://defenseeye.ai
# Should return: HTTP/2 200

# 4. Test the API endpoint
curl https://defenseeye.ai/api/cmmc-content | python3 -m json.tool

# 5. Test SPA routing (all paths should return index.html)
curl -I https://defenseeye.ai/knowledge-hub/what-is-cmmc
# Should return: HTTP/2 200 (not 404)

# 6. Test SSL certificate
curl -I https://defenseeye.ai | grep -i strict
# Should show: strict-transport-security header

# 7. Check sitemap is accessible
curl https://defenseeye.ai/sitemap.xml

# 8. Check llms.txt for AI crawlers
curl https://defenseeye.ai/llms.txt
```

---

## Part 5 — Deploying Updates

Every time you push new code, run this on the VPS:

```bash
# SSH into VPS
ssh root@<YOUR_VPS_IP>

# Run the update script
cd /var/www/defenseeye
sudo ./deploy/update.sh
```

The update script: pulls latest code → reinstalls deps → rebuilds → reloads PM2 (zero-downtime) → reloads Nginx.

---

## Part 6 — Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Express server port (3000, Nginx proxies to this) |
| `NODE_ENV` | Yes | Must be `production` on VPS |
| `VITE_GA4_MEASUREMENT_ID` | Optional | Google Analytics 4 ID (e.g. `G-XXXXXXXXXX`) |
| `VITE_ANALYTICS_ENDPOINT` | Optional | Umami instance URL |
| `VITE_ANALYTICS_WEBSITE_ID` | Optional | Umami website ID |
| `VITE_SITE_URL` | Optional | Canonical site URL for SEO |

**Important:** Variables prefixed `VITE_` are baked into the frontend at build time by Vite. They are NOT secret — they will be visible in the browser's page source. Never put secrets (API keys, database passwords) in `VITE_` variables.

---

## Part 7 — Common Issues & Fixes

### Site shows Nginx default page
```bash
# Ensure the default site is removed
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

### PM2 shows "errored" status
```bash
pm2 logs defenseeye --lines 50   # Check error messages
# Common cause: .env not found or PORT already in use
lsof -i :3000   # Check if something else is on port 3000
```

### SSL certificate fails
```bash
# Ensure DNS A record points to this VPS IP:
nslookup defenseeye.ai   # Must return your VPS IP, not old IP

# Re-run certbot manually:
certbot --nginx -d defenseeye.ai -d www.defenseeye.ai
```

### SPA routes return 404
```bash
# This means Nginx is not proxying to Express.
# Check Express is running:
curl http://localhost:3000/knowledge-hub/what-is-cmmc
# Should return HTML (not 404)

# Check Nginx proxy_pass is pointing to 127.0.0.1:3000
cat /etc/nginx/sites-enabled/defenseeye | grep proxy_pass
```

### Build fails with pnpm errors
```bash
# Clear cache and retry
rm -rf node_modules dist
pnpm install
pnpm run build
```

### Can't find dist/index.js after build
```bash
# The build script is:
#   vite build  →  creates dist/public/
#   esbuild     →  creates dist/index.js
# Run both:
pnpm run build
ls dist/   # Must show both index.js and public/
```

---

## Part 8 — Monitoring & Maintenance

### PM2 useful commands
```bash
pm2 status                    # Process list with uptime/CPU/memory
pm2 logs defenseeye           # Live log stream
pm2 logs defenseeye --lines 100  # Last 100 lines
pm2 monit                     # Live CPU/memory dashboard
pm2 restart defenseeye        # Hard restart
pm2 reload defenseeye         # Zero-downtime reload (preferred)
pm2 stop defenseeye           # Stop (does not remove)
pm2 delete defenseeye         # Remove from PM2 list
```

### Nginx useful commands
```bash
nginx -t                      # Test config syntax
systemctl reload nginx        # Reload config (no downtime)
systemctl restart nginx       # Full restart
tail -f /var/log/nginx/defenseeye.error.log    # Live error log
tail -f /var/log/nginx/defenseeye.access.log   # Live access log
```

### SSL renewal (auto-renews via systemd timer)
```bash
systemctl status certbot.timer    # Confirm auto-renewal is enabled
certbot renew --dry-run           # Test renewal without actually renewing
```

### Disk space
```bash
df -h                             # Check disk usage
du -sh /var/www/defenseeye        # App directory size
```

---

## File Structure After Deployment

```
/var/www/defenseeye/
├── .env                        # Your secrets (never commit)
├── .env.example                # Template
├── dist/
│   ├── index.js                # Express server (esbuild output)
│   └── public/                 # Static files (Vite output)
│       ├── index.html
│       ├── assets/             # Hashed JS/CSS bundles
│       ├── robots.txt
│       ├── sitemap.xml
│       ├── llms.txt
│       └── .well-known/
│           └── ai-plugin.json
├── ecosystem.config.cjs        # PM2 config
├── deploy/
│   ├── deploy.sh               # Initial setup script
│   ├── update.sh               # Code update script
│   └── nginx/
│       └── defenseeye.conf     # Nginx server block
└── logs/
    ├── pm2-out.log
    └── pm2-error.log
```

---

## Quick Reference Card

```bash
# SSH in
ssh root@<VPS_IP>

# Deploy (first time)
sudo /var/www/defenseeye/deploy/deploy.sh

# Update (after pushing new code)
sudo /var/www/defenseeye/deploy/update.sh

# Check status
pm2 status && pm2 logs defenseeye --lines 20

# Test site
curl -I https://defenseeye.ai
curl https://defenseeye.ai/api/cmmc-content | python3 -m json.tool

# Restart app
pm2 reload defenseeye

# Restart Nginx
nginx -t && systemctl reload nginx
```
