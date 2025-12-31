# Grafana + Prometheus Setup Guide for VPS

Complete guide to install and configure Grafana and Prometheus on your VPS for professional monitoring of PIKALEADS Lead Engine.

---

## 📋 Prerequisites

- **VPS with Ubuntu 20.04/22.04** (minimum 2GB RAM, 2 CPU cores)
- **Root or sudo access**
- **PIKALEADS application running** on port 3000
- **Domain name** (optional, for HTTPS access)

---

## 🚀 Quick Install (Docker Compose - Recommended)

### Step 1: Install Docker and Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 2: Create Monitoring Directory

```bash
mkdir -p ~/monitoring
cd ~/monitoring
```

### Step 3: Create docker-compose.yml

Create `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - ./alerts.yml:/etc/prometheus/alerts.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
    networks:
      - monitoring

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=pikaleads2025
      - GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-simple-json-datasource
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana-dashboard.json:/etc/grafana/provisioning/dashboards/pikaleads.json
    networks:
      - monitoring
    depends_on:
      - prometheus

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    restart: unless-stopped
    ports:
      - "9100:9100"
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    networks:
      - monitoring

  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    restart: unless-stopped
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager_data:/alertmanager
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'
    networks:
      - monitoring

volumes:
  prometheus_data:
  grafana_data:
  alertmanager_data:

networks:
  monitoring:
    driver: bridge
```

### Step 4: Copy Configuration Files

Copy the following files from your PIKALEADS project to `~/monitoring/`:

```bash
# From your PIKALEADS project directory
cp prometheus.yml ~/monitoring/
cp alerts.yml ~/monitoring/
cp grafana-dashboard.json ~/monitoring/
```

### Step 5: Update prometheus.yml

Edit `~/monitoring/prometheus.yml` and update the PIKALEADS target:

```yaml
scrape_configs:
  - job_name: 'pikaleads'
    scrape_interval: 10s
    metrics_path: '/api/trpc/prometheus.metrics'
    static_configs:
      - targets: ['host.docker.internal:3000']  # For Docker on Linux, use your server IP
        labels:
          app: 'pikaleads'
          service: 'lead-engine'
```

**For Linux VPS:** Replace `host.docker.internal:3000` with your actual server IP (e.g., `192.168.1.100:3000` or use `172.17.0.1:3000` for Docker bridge network).

### Step 6: Create Alertmanager Configuration

Create `~/monitoring/alertmanager.yml`:

```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'telegram'

receivers:
  - name: 'telegram'
    telegram_configs:
      - bot_token: 'YOUR_TELEGRAM_BOT_TOKEN'
        chat_id: YOUR_TELEGRAM_CHAT_ID
        parse_mode: 'HTML'
        message: |
          🚨 <b>PIKALEADS Alert</b>
          
          <b>Alert:</b> {{ .GroupLabels.alertname }}
          <b>Severity:</b> {{ .CommonLabels.severity }}
          <b>Summary:</b> {{ .CommonAnnotations.summary }}
          <b>Description:</b> {{ .CommonAnnotations.description }}
```

Replace `YOUR_TELEGRAM_BOT_TOKEN` and `YOUR_TELEGRAM_CHAT_ID` with your actual values.

### Step 7: Start Monitoring Stack

```bash
cd ~/monitoring
docker-compose up -d
```

Check status:

```bash
docker-compose ps
```

You should see all 4 services running:
- prometheus (port 9090)
- grafana (port 3001)
- node-exporter (port 9100)
- alertmanager (port 9093)

---

## 🌐 Access Monitoring Dashboards

### Prometheus
- URL: `http://YOUR_SERVER_IP:9090`
- No authentication by default

### Grafana
- URL: `http://YOUR_SERVER_IP:3001`
- Username: `admin`
- Password: `pikaleads2025`

### Alertmanager
- URL: `http://YOUR_SERVER_IP:9093`
- No authentication by default

---

## 📊 Configure Grafana Dashboard

### Option 1: Import Pre-built Dashboard (Recommended)

1. Open Grafana: `http://YOUR_SERVER_IP:3001`
2. Login with `admin` / `pikaleads2025`
3. Go to **Dashboards** → **Import**
4. Upload `grafana-dashboard.json` from your project
5. Select **Prometheus** as data source
6. Click **Import**

### Option 2: Add Prometheus Data Source Manually

1. Go to **Configuration** → **Data Sources**
2. Click **Add data source**
3. Select **Prometheus**
4. Set URL: `http://prometheus:9090`
5. Click **Save & Test**

### Option 3: Create Custom Dashboard

1. Go to **Dashboards** → **New Dashboard**
2. Add panels with these queries:

**Memory Usage:**
```promql
pikaleads_memory_usage_percent
```

**CPU Load:**
```promql
pikaleads_cpu_load_1m
```

**Database Status:**
```promql
pikaleads_database_status
```

**Error Rate:**
```promql
rate(pikaleads_errors_24h[5m])
```

**Lead Generation Rate:**
```promql
rate(pikaleads_leads_24h[1h])
```

---

## 🔒 Secure with Nginx Reverse Proxy (Optional)

### Install Nginx

```bash
sudo apt install nginx -y
```

### Create Nginx Configuration

Create `/etc/nginx/sites-available/monitoring`:

```nginx
# Grafana
server {
    listen 80;
    server_name grafana.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Prometheus
server {
    listen 80;
    server_name prometheus.yourdomain.com;

    location / {
        proxy_pass http://localhost:9090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable configuration:

```bash
sudo ln -s /etc/nginx/sites-available/monitoring /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Install SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d grafana.yourdomain.com -d prometheus.yourdomain.com
```

---

## 🔔 Configure Telegram Alerts

### 1. Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` and follow instructions
3. Copy the **bot token**

### 2. Get Chat ID

1. Start a chat with your bot
2. Send any message
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find `"chat":{"id":XXXXXXX}` and copy the ID

### 3. Update Alertmanager Config

Edit `~/monitoring/alertmanager.yml` and replace:
- `YOUR_TELEGRAM_BOT_TOKEN` with your bot token
- `YOUR_TELEGRAM_CHAT_ID` with your chat ID

Restart Alertmanager:

```bash
cd ~/monitoring
docker-compose restart alertmanager
```

---

## 📈 Useful Prometheus Queries

### System Metrics

```promql
# Memory usage percentage
pikaleads_memory_usage_percent

# CPU load average (1 minute)
pikaleads_cpu_load_1m

# Database response time
pikaleads_database_response_ms

# Server uptime
pikaleads_uptime_seconds
```

### Application Metrics

```promql
# Total leads in last 24 hours
pikaleads_leads_24h

# Total errors in last 24 hours
pikaleads_errors_24h

# Lead generation rate (per hour)
rate(pikaleads_leads_24h[1h])

# Error rate (per minute)
rate(pikaleads_errors_24h[5m])
```

### Alerts

```promql
# High memory usage
pikaleads_memory_usage_percent > 85

# High CPU load
pikaleads_cpu_load_1m > 2

# Database down
pikaleads_database_status == 0

# Low lead generation
rate(pikaleads_leads_24h[1h]) < 1
```

---

## 🛠️ Maintenance Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f prometheus
docker-compose logs -f grafana
```

### Restart Services

```bash
# All services
docker-compose restart

# Specific service
docker-compose restart prometheus
```

### Stop/Start

```bash
# Stop all
docker-compose down

# Start all
docker-compose up -d
```

### Update Images

```bash
docker-compose pull
docker-compose up -d
```

### Backup Data

```bash
# Backup Grafana dashboards
docker exec grafana grafana-cli admin export-dashboard > grafana-backup.json

# Backup Prometheus data
docker run --rm -v monitoring_prometheus_data:/data -v $(pwd):/backup ubuntu tar czf /backup/prometheus-backup.tar.gz /data
```

---

## 🚨 Troubleshooting

### Prometheus Can't Scrape PIKALEADS

**Problem:** Prometheus shows target as "DOWN"

**Solution:**
1. Check if PIKALEADS is running: `curl http://localhost:3000/api/trpc/prometheus.metrics`
2. Update `prometheus.yml` with correct IP address
3. For Docker on Linux, use `172.17.0.1:3000` or your server's IP
4. Restart Prometheus: `docker-compose restart prometheus`

### Grafana Can't Connect to Prometheus

**Problem:** "Data source is not working"

**Solution:**
1. Use `http://prometheus:9090` as URL (not `localhost`)
2. Ensure both containers are in the same network
3. Check Prometheus is running: `docker-compose ps`

### Alerts Not Sending to Telegram

**Problem:** No Telegram notifications

**Solution:**
1. Verify bot token and chat ID in `alertmanager.yml`
2. Test bot: send a message to your bot in Telegram
3. Check Alertmanager logs: `docker-compose logs -f alertmanager`
4. Trigger a test alert: temporarily set low threshold in `alerts.yml`

### High Resource Usage

**Problem:** Monitoring stack using too much CPU/RAM

**Solution:**
1. Reduce Prometheus retention: change `--storage.tsdb.retention.time=30d` to `7d`
2. Increase scrape intervals in `prometheus.yml` (e.g., `30s` instead of `10s`)
3. Disable unnecessary exporters

---

## 📚 Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Node Exporter Metrics](https://github.com/prometheus/node_exporter)
- [Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/)

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Prometheus is scraping PIKALEADS metrics (`http://YOUR_IP:9090/targets`)
- [ ] Grafana dashboard shows real-time data
- [ ] Alerts are configured and visible in Prometheus
- [ ] Telegram notifications are working
- [ ] Node Exporter is collecting system metrics
- [ ] Data is persisting after container restart
- [ ] SSL certificates are installed (if using domain)
- [ ] Firewall rules allow access to ports 3001, 9090, 9093

---

## 🎯 Next Steps

1. **Customize Dashboards** — Add panels for business metrics (conversion rates, revenue)
2. **Set Up Backups** — Schedule automated backups of Grafana dashboards and Prometheus data
3. **Add More Exporters** — Install MySQL exporter, Redis exporter, etc.
4. **Create Custom Alerts** — Add business-specific alerts (e.g., "No leads in last hour")
5. **Integrate with PagerDuty** — For 24/7 on-call alerting

---

**Need help?** Contact PIKALEADS support at support@pikaleads.com
