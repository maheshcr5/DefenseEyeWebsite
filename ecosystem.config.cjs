/**
 * PM2 Ecosystem Config — DefenseEye.ai
 *
 * Usage:
 *   pm2 start ecosystem.config.cjs          # start in production
 *   pm2 restart defenseeye                  # restart
 *   pm2 stop defenseeye                     # stop
 *   pm2 logs defenseeye                     # tail logs
 *   pm2 monit                               # live dashboard
 *   pm2 save && pm2 startup                 # survive reboots
 */

module.exports = {
  apps: [
    {
      name: "defenseeye",
      script: "./dist/index.js",
      node_args: "--env-file=.env",

      // ── Environment ────────────────────────────────────────────────────────
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // ── Process settings ──────────────────────────────────────────────────
      instances: 1,           // increase to "max" if you upgrade to multi-core VPS
      exec_mode: "fork",      // use "cluster" if instances > 1
      autorestart: true,
      watch: false,           // never watch in production
      max_memory_restart: "512M",

      // ── Logs ──────────────────────────────────────────────────────────────
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      merge_logs: true,

      // ── Restart policy ────────────────────────────────────────────────────
      min_uptime: "10s",       // must stay alive at least 10s to count as started
      max_restarts: 10,        // stop retrying after 10 crashes
      restart_delay: 4000,    // wait 4s between restart attempts
    },
  ],
};
