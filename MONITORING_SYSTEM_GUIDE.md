# PIKALEADS Monitoring System - Complete Guide

## Overview

PIKALEADS Lead Engine includes a comprehensive monitoring system with **email alerts**, **performance tracking**, **historical trends**, and **Grafana/Prometheus integration** for production VPS deployment.

---

## Features

### 1. Email Alert System ✉️

Automatically sends email notifications for critical server events:

- **High Memory Usage** (>85%) - Critical alert with recommended actions
- **High CPU Load** (>2.0) - Warning alert with troubleshooting steps
- **Database Connection Failure** - Critical alert requiring immediate action
- **High Error Rate** - Warning alert for elevated application errors

**Alert Cooldown:** 5 minutes between duplicate alerts to prevent spam

**Email Template:** Professional HTML emails with:
- Severity badges (🚨 Critical, ⚠️ Warning, ℹ️ Info)
- Color-coded alert boxes
- Timestamp in Europe/Kiev timezone
- Direct link to Server Monitoring Dashboard
- Recommended troubleshooting actions

**Configuration:**
1. Go to Admin Dashboard → Settings → Integration Settings
2. Configure SMTP settings (provider: "email")
3. Set `adminEmail` in credentials for alert recipient
4. Alerts will be sent automatically when thresholds are exceeded

---

### 2. Performance Dashboard 📊

**Location:** `/admin/performance`

**Features:**
- **API Response Time Graph** - Bar chart showing average response time for each endpoint
  - Green: <100ms (Excellent)
  - Yellow: 100-500ms (Good)
  - Orange: 500-1000ms (Slow)
  - Red: >1000ms (Critical)
- **Bottleneck Detection** - Endpoints with >1000ms average response time
- **Slowest Endpoints** - Top 10 slowest API endpoints
- **High Error Rates** - Endpoints with errors >0%
- **Real-time Stats** - Auto-refresh every 10 seconds

**Use Cases:**
- Identify slow API endpoints that need optimization
- Detect performance regressions after deployments
- Monitor API health in production
- Find bottlenecks affecting user experience

---

### 3. Historical Trends 📈

**Location:** `/admin/monitoring` (bottom section)

**7-Day Trends:**
- **Memory Usage** - Daily average memory consumption
- **CPU Load** - Daily average CPU load

**30-Day Trends:**
- **Error Count** - Daily error count with total sum
- **Lead Generation** - Daily lead count with average per day

**Features:**
- Interactive line charts with Chart.js
- Trend indicators (🔼 Trending Up, 🔽 Trending Down)
- Tabbed interface for easy navigation
- Color-coded graphs for quick insights

**Note:** Currently showing mock data for demonstration. To enable real tracking:
1. Create database table for daily metrics snapshots
2. Implement cron job to save metrics every day at midnight
3. Update backend procedures to fetch real historical data

---

### 4. Server Monitoring Dashboard 🖥️

**Location:** `/admin/monitoring`

**Real-time Metrics:**
- **Server Status** - Overall health (HEALTHY/DEGRADED)
- **Memory Usage** - Current usage with percentage
- **Database Status** - Connection health and response time
- **Uptime** - Server uptime in hours and minutes
- **CPU Load** - Current load average
- **Error Rate** - Errors per minute

**Live Graphs (Last 100 seconds):**
- Memory usage trend
- CPU load trend
- Error rate trend

**System Information:**
- CPU model and core count
- Node.js version
- Platform (Linux/Windows/macOS)
- API response time

**Auto-refresh:** Every 5 seconds

---

### 5. Dashboard Widget 📌

**Location:** Admin Dashboard homepage (top section)

**Quick Metrics:**
- Memory usage with color-coded status
- CPU load with threshold warnings
- Database connection status
- Server uptime

**Status Colors:**
- 🟢 Green: Normal operation
- 🟡 Yellow: Warning threshold
- 🔴 Red: Critical threshold

**Alerts:**
- ⚠️ High memory usage (>85%)
- ⚠️ High CPU load (>2.0)

**Quick Actions:**
- "View Details" button → Full monitoring dashboard

---

### 6. Grafana + Prometheus Integration 🎯

**For Production VPS Deployment**

See `GRAFANA_PROMETHEUS_SETUP.md` for complete installation guide.

**What You Get:**
- **Prometheus** (port 9090) - Metrics collection and storage
- **Grafana** (port 3001) - Beautiful dashboards and visualizations
- **Node Exporter** (port 9100) - System metrics (CPU, memory, disk, network)
- **Alertmanager** (port 9093) - Telegram alerts for critical events

**Key Features:**
- Historical data retention (15 days default, configurable)
- Pre-built dashboard with 20+ panels
- Telegram notifications for alerts
- HTTPS with Let's Encrypt SSL
- Nginx reverse proxy for security
- Docker Compose for easy deployment

**Metrics Tracked:**
- System: CPU, memory, disk I/O, network traffic
- Application: API response times, error rates, request counts
- Database: Connection pool, query performance
- Business: Lead generation, quiz completions, conversion rates

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PIKALEADS Monitoring                     │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ┌───────▼────────┐          ┌──────▼──────┐
        │  Application   │          │  Grafana +  │
        │   Monitoring   │          │ Prometheus  │
        └───────┬────────┘          └──────┬──────┘
                │                           │
    ┌───────────┼───────────┐              │
    │           │           │              │
┌───▼───┐  ┌───▼───┐  ┌───▼────┐    ┌────▼─────┐
│ Email │  │ Perf  │  │ Trends │    │ Telegram │
│Alerts │  │ Dash  │  │ Graphs │    │  Alerts  │
└───────┘  └───────┘  └────────┘    └──────────┘
```

---

## Alert Thresholds

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| Memory Usage | 75% | 85% | Email + Telegram |
| CPU Load | 1.5 | 2.0 | Email + Telegram |
| Database Response | 100ms | 500ms | Email |
| Error Rate | 5/min | 10/min | Email |
| API Response Time | 500ms | 1000ms | Dashboard only |

---

## Files Reference

### Backend
- `server/utils/emailAlerts.ts` - Email alert system
- `server/routers/health.ts` - Health check endpoint with alerts
- `server/routers/performance.ts` - Performance metrics router
- `server/routers/prometheus.ts` - Prometheus metrics endpoint
- `server/utils/performanceMetrics.ts` - Performance tracking middleware

### Frontend
- `client/src/pages/ServerMonitoring.tsx` - Main monitoring dashboard
- `client/src/pages/PerformanceMonitoring.tsx` - Performance dashboard
- `client/src/components/HistoricalTrends.tsx` - Historical trends component
- `client/src/components/ServerStatusWidget.tsx` - Dashboard widget

### Configuration
- `prometheus.yml` - Prometheus scrape configuration
- `alerts.yml` - Prometheus alert rules
- `grafana-dashboard.json` - Pre-built Grafana dashboard
- `ecosystem.config.cjs` - PM2 auto-restart configuration

### Documentation
- `SERVER_MONITORING_GUIDE.md` - Server monitoring basics
- `GRAFANA_PROMETHEUS_SETUP.md` - Production VPS setup guide
- `MONITORING_SYSTEM_GUIDE.md` - This file

---

## Quick Start

### 1. Configure Email Alerts

```bash
# In Admin Dashboard → Settings → Integration Settings
Provider: email
Credentials:
{
  "fromEmail": "noreply@yourdomain.com",
  "adminEmail": "admin@yourdomain.com",
  "smtpHost": "smtp.gmail.com",
  "smtpPort": 587,
  "smtpUser": "your-email@gmail.com",
  "smtpPassword": "your-app-password"
}
```

### 2. Access Monitoring Dashboards

- **Main Dashboard:** `https://yourdomain.com/admin/monitoring`
- **Performance:** `https://yourdomain.com/admin/performance`
- **Health Check API:** `https://yourdomain.com/api/trpc/health.check`
- **Prometheus Metrics:** `https://yourdomain.com/api/trpc/prometheus.metrics`

### 3. Install Grafana (Production)

```bash
# Follow GRAFANA_PROMETHEUS_SETUP.md
cd /opt/monitoring
docker-compose up -d
```

### 4. Test Email Alerts

```bash
# Trigger high memory alert (for testing)
# In browser console on /admin/monitoring:
fetch('/api/trpc/health.check').then(r => r.json())
```

---

## Troubleshooting

### Email Alerts Not Sending

1. Check SMTP configuration in Integration Settings
2. Verify `adminEmail` is set in credentials
3. Check server logs: `tail -f /home/ubuntu/pikaleads_quiz_system/logs/app.log`
4. Test SMTP connection manually

### Performance Dashboard Empty

1. Ensure performance metrics middleware is active
2. Make some API requests to generate data
3. Check database table: `SELECT * FROM performance_metrics LIMIT 10;`

### Historical Trends Showing Mock Data

1. This is expected - real historical tracking requires:
   - Database table for daily snapshots
   - Cron job to save metrics daily
   - Backend procedures to fetch historical data
2. See "Implementing Real Historical Tracking" section below

### Grafana Not Accessible

1. Check Docker containers: `docker ps`
2. Check Nginx configuration: `sudo nginx -t`
3. Check SSL certificates: `sudo certbot certificates`
4. Check firewall: `sudo ufw status`

---

## Implementing Real Historical Tracking

### Step 1: Create Database Table

```sql
CREATE TABLE daily_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  avg_memory_percent DECIMAL(5,2),
  avg_cpu_load DECIMAL(5,2),
  total_errors INT DEFAULT 0,
  total_leads INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 2: Create Cron Job

```typescript
// server/jobs/saveDailyMetrics.ts
import { getDb } from "../db";
import os from "os";

export async function saveDailyMetrics() {
  const db = await getDb();
  if (!db) return;

  const memoryPercent = ((os.totalmem() - os.freemem()) / os.totalmem()) * 100;
  const cpuLoad = os.loadavg()[0];

  // Get error count from error_logs table
  const errors = await db.execute(
    "SELECT COUNT(*) as count FROM error_logs WHERE DATE(createdAt) = CURDATE()"
  );

  // Get lead count from leads table
  const leads = await db.execute(
    "SELECT COUNT(*) as count FROM leads WHERE DATE(createdAt) = CURDATE()"
  );

  await db.execute(
    `INSERT INTO daily_metrics (date, avg_memory_percent, avg_cpu_load, total_errors, total_leads)
     VALUES (CURDATE(), ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       avg_memory_percent = ?,
       avg_cpu_load = ?,
       total_errors = ?,
       total_leads = ?`,
    [
      memoryPercent, cpuLoad, errors[0].count, leads[0].count,
      memoryPercent, cpuLoad, errors[0].count, leads[0].count
    ]
  );
}
```

### Step 3: Schedule with PM2

```javascript
// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "pikaleads-metrics",
      script: "node",
      args: "-e \"require('./server/jobs/saveDailyMetrics').saveDailyMetrics()\"",
      cron_restart: "0 0 * * *", // Every day at midnight
      autorestart: false
    }
  ]
};
```

### Step 4: Update Backend Procedures

```typescript
// server/routers/monitoring.ts
export const monitoringRouter = router({
  getHistoricalMetrics: publicProcedure
    .input(z.object({ days: z.number().min(1).max(90) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const result = await db.execute(
        `SELECT * FROM daily_metrics 
         WHERE date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
         ORDER BY date ASC`,
        [input.days]
      );

      return result;
    }),
});
```

### Step 5: Update Frontend

```typescript
// client/src/components/HistoricalTrends.tsx
const { data: metrics7d } = trpc.monitoring.getHistoricalMetrics.useQuery({ days: 7 });
const { data: metrics30d } = trpc.monitoring.getHistoricalMetrics.useQuery({ days: 30 });

// Use real data instead of mockMemoryTrend
const memoryTrend = {
  labels: metrics7d?.map(m => m.date) || [],
  data: metrics7d?.map(m => m.avg_memory_percent) || [],
};
```

---

## Best Practices

1. **Monitor Regularly** - Check dashboards daily for anomalies
2. **Set Up Alerts** - Configure email and Telegram alerts for critical events
3. **Review Trends** - Analyze weekly/monthly trends to predict capacity needs
4. **Optimize Bottlenecks** - Use Performance Dashboard to find and fix slow endpoints
5. **Keep Historical Data** - Retain at least 30 days of metrics for analysis
6. **Test Alerts** - Periodically test alert system to ensure it's working
7. **Document Changes** - Log any configuration changes or threshold adjustments
8. **Backup Metrics** - Regularly backup Prometheus data and database metrics

---

## Support

For issues or questions:
- Check logs: `/home/ubuntu/pikaleads_quiz_system/logs/`
- Review documentation: `SERVER_MONITORING_GUIDE.md`, `GRAFANA_PROMETHEUS_SETUP.md`
- Contact: admin@pikaleads.com

---

**Last Updated:** December 17, 2025
**Version:** 1.0.0
