module.exports = {
  apps: [
    {
      name: "picremove",
      script: "pnpm",
      args: "exec next dev -p 3000",
      cwd: "/root/github/project/image-background-remover",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: "3000",
      },
      error_file: "/root/.pm2/logs/picremove-error.log",
      out_file: "/root/.pm2/logs/picremove-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,
    },
  ],
};
