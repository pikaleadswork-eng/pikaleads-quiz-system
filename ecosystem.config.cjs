module.exports = {
  apps: [
    {
      name: "pikaleads-server",
      script: "tsx",
      args: "server/_core/index.ts",
      cwd: "/home/ubuntu/pikaleads_quiz_system",
      instances: 1,
      exec_mode: "fork",
      
      // Auto-restart configuration
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      
      // Restart on crash
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 4000,
      
      // Environment variables
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      
      // Logging
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      
      // Advanced features
      listen_timeout: 10000,
      kill_timeout: 5000,
      
      // Cron restart (daily at 3 AM)
      cron_restart: "0 3 * * *",
      
      // Health check
      health_check: {
        enabled: true,
        interval: 30000, // 30 seconds
        max_restarts: 5,
        min_uptime: 60000, // 1 minute
      },
    },
  ],
};
