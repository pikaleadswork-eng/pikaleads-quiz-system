# Server Monitoring System - Deployment Guide

## Overview

This guide explains how to deploy and configure the comprehensive server monitoring system for PIKALEADS Lead Engine on your VPS.

## Features Implemented

### 1. ✅ Health Check Endpoint
- **URL:** `/api/trpc/health.check`
- **Public access** (no authentication required)
- **Returns:**
  - Server status (healthy/degraded)
  - Database connection status
  - Memory usage (total, used, free, percentage)
  - CPU information (cores, model, load average)
  - Uptime (seconds and formatted)
  - Response time
  - Node.js version and platform

### 2. ✅ Error Logging System
- **Database table:** `error_logs`
- **File logging:** `/logs/errors-YYYY-MM-DD.log`
- **Stored information:**
  - Error type
  - Error message
  - Stack trace
  - Endpoint where error occurred
  - User ID (if applicable)
  - Metadata (JSON)
  - Timestamp

### 3. ✅ Auto-Restart Mechanism (PM2)
- **Configuration file:** `ecosystem.config.cjs`
- **Features:**
  - Automatic restart on crash
  - Memory limit: 500MB (restart if exceeded)
  - Max 10 restarts within 10 seconds
  - 4-second delay between restarts
  - Daily cron restart at 3 AM
  - Health check every 30 seconds

### 4. ✅ Telegram Alerts
- **Critical error alerts** - sent immediately when critical errors occur
- **Server restart notifications** - sent when server restarts
- **Health degradation alerts** - sent when memory/DB issues detected
- **Daily health reports** - automated summary at end of day

### 5. ✅ Frontend Connection Retry
- **Automatic retry** - up to 5 attempts with exponential backoff
- **Health monitoring** - checks server every 30 seconds
- **Visual notifications** - shows connection status to users
- **Smart retry** - doesn't retry on auth/validation errors

---

## Installation on VPS

### Step 1: Install PM2 Globally

```bash
npm install -g pm2
```

### Step 2: Create Logs Directory

```bash
cd /home/ubuntu/pikaleads_quiz_system
mkdir -p logs
chmod 755 logs
```

### Step 3: Configure Environment Variables

Add to your `.env` file (or set as system environment variables):

```bash
# Required for Telegram alerts
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Database connection (already configured)
DATABASE_URL=your_database_url
```

### Step 4: Build the Application

```bash
cd /home/ubuntu/pikaleads_quiz_system
pnpm install
pnpm build
```

### Step 5: Start with PM2

```bash
pm2 start ecosystem.config.cjs
```

### Step 6: Save PM2 Configuration

```bash
pm2 save
pm2 startup
```

Follow the instructions provided by `pm2 startup` to enable auto-start on system reboot.

---

## PM2 Commands

### View Status
```bash
pm2 status
```

### View Logs
```bash
pm2 logs pikaleads-server
```

### Restart Server
```bash
pm2 restart pikaleads-server
```

### Stop Server
```bash
pm2 stop pikaleads-server
```

### Monitor Resources
```bash
pm2 monit
```

### View Detailed Info
```bash
pm2 info pikaleads-server
```

---

## Health Check Endpoints

### Check Server Health (Browser)
```
https://your-domain.com/api/trpc/health.check
```

### Example Response
```json
{
  "result": {
    "data": {
      "status": "healthy",
      "timestamp": "2025-12-16T17:00:00.000Z",
      "uptime": {
        "seconds": 3600,
        "formatted": "1h 0m"
      },
      "database": {
        "status": "healthy",
        "responseTime": "15ms"
      },
      "memory": {
        "total": "2048MB",
        "used": "512MB",
        "free": "1536MB",
        "usagePercent": "25%"
      },
      "cpu": {
        "cores": 2,
        "model": "Intel(R) Xeon(R) CPU",
        "loadAverage": ["0.50", "0.45", "0.40"]
      },
      "responseTime": "5ms",
      "nodeVersion": "v22.13.0",
      "platform": "linux"
    }
  }
}
```

---

## Telegram Alert Configuration

### 1. Create Telegram Bot
1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow instructions to create bot
4. Copy the **Bot Token**

### 2. Get Chat ID
1. Start a conversation with your bot
2. Send any message to the bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find `"chat":{"id":123456789}` in the response
5. Copy the **Chat ID**

### 3. Set Environment Variables
```bash
export TELEGRAM_BOT_TOKEN="your_bot_token_here"
export TELEGRAM_CHAT_ID="your_chat_id_here"
```

Or add to `.env` file:
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

### 4. Test Telegram Alerts

Manually trigger a test alert by running:
```bash
node -e "
const { sendCriticalErrorAlert } = require('./server/utils/alertSystem');
sendCriticalErrorAlert({
  type: 'TEST',
  message: 'Test alert from PIKALEADS',
  timestamp: new Date().toISOString()
});
"
```

---

## Monitoring Dashboard

### View Error Logs (Last 24 Hours)
```
https://your-domain.com/api/trpc/health.getErrorLogs
```

### Integration with Existing Admin Panel

The health check endpoint is already integrated into your admin panel. You can add a monitoring page:

**Create:** `/client/src/pages/ServerMonitoring.tsx`

```tsx
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";

export function ServerMonitoring() {
  const { data: health } = trpc.health.check.useQuery(undefined, {
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Server Monitoring</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold">Status</h3>
          <p className={health?.status === 'healthy' ? 'text-green-500' : 'text-red-500'}>
            {health?.status?.toUpperCase()}
          </p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold">Uptime</h3>
          <p>{health?.uptime.formatted}</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold">Memory Usage</h3>
          <p>{health?.memory.usagePercent}</p>
        </Card>
      </div>
    </div>
  );
}
```

---

## Troubleshooting

### Server Won't Start
1. Check logs: `pm2 logs pikaleads-server --lines 100`
2. Verify database connection: `mysql -h $DATABASE_HOST -u $DATABASE_USER -p`
3. Check port availability: `netstat -tulpn | grep 3000`

### Telegram Alerts Not Working
1. Verify bot token: `echo $TELEGRAM_BOT_TOKEN`
2. Test bot manually: `curl https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe`
3. Check chat ID: `echo $TELEGRAM_CHAT_ID`

### High Memory Usage
1. Check PM2 status: `pm2 monit`
2. Restart server: `pm2 restart pikaleads-server`
3. Adjust memory limit in `ecosystem.config.cjs` if needed

### Database Connection Errors
1. Check database status: `systemctl status mysql`
2. Verify credentials in `.env`
3. Test connection: `mysql -h $DATABASE_HOST -u $DATABASE_USER -p`

---

## Maintenance

### Daily Tasks
- ✅ **Automated** - PM2 handles restarts and monitoring
- ✅ **Automated** - Telegram sends daily health reports

### Weekly Tasks
- Review error logs: `pm2 logs pikaleads-server --lines 1000 | grep ERROR`
- Check disk space: `df -h`
- Review Telegram alerts for patterns

### Monthly Tasks
- Update dependencies: `pnpm update`
- Review and archive old logs: `cd logs && tar -czf archive-$(date +%Y-%m).tar.gz *.log`
- Test backup and restore procedures

---

## Performance Optimization

### Increase PM2 Instances (Cluster Mode)

For high-traffic scenarios, enable cluster mode:

```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [{
    name: "pikaleads-server",
    script: "tsx",
    args: "server/_core/index.ts",
    instances: 2, // Change from 1 to 2 or "max"
    exec_mode: "cluster", // Change from "fork" to "cluster"
    // ... rest of config
  }]
};
```

Then restart:
```bash
pm2 reload ecosystem.config.cjs
```

---

## Security Recommendations

1. **Firewall:** Only expose ports 80, 443, and SSH
2. **SSL/TLS:** Use Let's Encrypt for HTTPS
3. **Database:** Use strong passwords and restrict access by IP
4. **Environment Variables:** Never commit `.env` to Git
5. **Telegram Bot:** Keep bot token secret

---

## Support

If you encounter issues:
1. Check logs: `pm2 logs pikaleads-server`
2. Check health endpoint: `curl https://your-domain.com/api/trpc/health.check`
3. Review error_logs table in database
4. Check Telegram for automated alerts

---

## Summary

You now have a **production-ready monitoring system** with:
- ✅ Real-time health checks
- ✅ Automatic error logging
- ✅ Auto-restart on crashes
- ✅ Telegram alerts for critical issues
- ✅ Frontend connection retry logic

The system will automatically:
- Monitor server health every 30 seconds
- Restart on crashes (up to 10 times)
- Send Telegram alerts for critical errors
- Log all errors to database and files
- Show connection status to users
- Retry failed requests automatically

**Your server is now fully monitored and protected!** 🚀
