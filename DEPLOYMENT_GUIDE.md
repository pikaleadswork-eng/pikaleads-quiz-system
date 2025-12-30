# 📦 Інструкція по Deployment PIKALEADS на ukraine.com.ua

## 🖥️ Вибір VPS

### Рекомендовані параметри:

**Мінімальні вимоги (для початку):**
- **CPU**: 2 vCPU
- **RAM**: 4 GB
- **Диск**: 40 GB SSD
- **Bandwidth**: 2 TB/місяць
- **Операційна система**: Ubuntu 22.04 LTS (64-bit)

**Оптимальні вимоги (для production з навантаженням):**
- **CPU**: 4 vCPU
- **RAM**: 8 GB
- **Диск**: 80 GB SSD
- **Bandwidth**: 4 TB/місяць
- **Операційна система**: Ubuntu 22.04 LTS (64-bit)

### Рекомендовані провайдери VPS:

1. **DigitalOcean** - $24/міс (4GB RAM, 2 vCPU) або $48/міс (8GB RAM, 4 vCPU)
2. **Hetzner** - €8.19/міс (4GB RAM, 2 vCPU) або €15.79/міс (8GB RAM, 4 vCPU) - найкраще співвідношення ціна/якість
3. **Vultr** - $24/міс (4GB RAM, 2 vCPU)
4. **Linode** - $24/міс (4GB RAM, 2 vCPU)

**Рекомендація**: Hetzner (найдешевший з хорошою якістю для Європи)

---

## 🚀 Покрокова Інструкція Deployment

### Крок 1: Підготовка VPS

```bash
# 1. Підключіться до VPS через SSH
ssh root@your-server-ip

# 2. Оновіть систему
apt update && apt upgrade -y

# 3. Встановіть необхідні пакети
apt install -y curl git build-essential nginx certbot python3-certbot-nginx

# 4. Встановіть Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# 5. Встановіть pnpm
npm install -g pnpm

# 6. Встановіть PM2 (для управління процесами)
npm install -g pm2
```

### Крок 2: Налаштування MySQL/MariaDB

```bash
# 1. Встановіть MariaDB
apt install -y mariadb-server mariadb-client

# 2. Запустіть безпечну конфігурацію
mysql_secure_installation
# Відповідайте:
# - Set root password: YES (створіть надійний пароль)
# - Remove anonymous users: YES
# - Disallow root login remotely: YES
# - Remove test database: YES
# - Reload privilege tables: YES

# 3. Створіть базу даних та користувача
mysql -u root -p
```

```sql
CREATE DATABASE pikaleads CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pikaleads_user'@'localhost' IDENTIFIED BY 'your_strong_password_here';
GRANT ALL PRIVILEGES ON pikaleads.* TO 'pikaleads_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Крок 3: Клонування та Налаштування Проекту

```bash
# 1. Створіть директорію для проекту
mkdir -p /var/www
cd /var/www

# 2. Клонуйте проект з Manus (або завантажте через git)
# Якщо у вас є git репозиторій:
git clone https://github.com/your-username/pikaleads_quiz_system.git
cd pikaleads_quiz_system

# Якщо немає git - завантажте файли через FTP/SFTP в /var/www/pikaleads_quiz_system

# 3. Встановіть залежності
pnpm install

# 4. Створіть .env файл
nano .env
```

### Крок 4: Налаштування Environment Variables (.env)

```env
# Database
DATABASE_URL=mysql://pikaleads_user:your_strong_password_here@localhost:3306/pikaleads

# JWT Secret (згенеруйте випадковий ключ)
JWT_SECRET=your_random_jwt_secret_key_here_min_32_chars

# Manus OAuth (якщо використовуєте Manus Auth)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=your_manus_app_id

# Owner Info
OWNER_OPEN_ID=your_owner_open_id
OWNER_NAME=Your Name

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

# Instagram Direct (опціонально)
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
INSTAGRAM_ACCOUNT_ID=your_instagram_account_id

# WhatsApp Business API (опціонально)
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_whatsapp_verify_token

# SendGrid Email
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@ukraine.com.ua

# Facebook Retargeting (опціонально)
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token
FACEBOOK_AD_ACCOUNT_ID=your_facebook_ad_account_id

# App URL
VITE_APP_URL=https://ukraine.com.ua
NODE_ENV=production
PORT=3000
```

**Як згенерувати JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Крок 5: Ініціалізація Бази Даних

```bash
# 1. Запустіть міграції
pnpm db:push

# 2. Запустіть seed скрипт для створення дефолтних статусів
node server/seed-db.mjs
```

### Крок 6: Збірка Production Build

```bash
# 1. Зберіть frontend
pnpm build

# 2. Перевірте що build успішний
ls -la client/dist
```

### Крок 7: Налаштування PM2

```bash
# 1. Створіть PM2 ecosystem файл
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'pikaleads',
    script: 'server/_core/index.ts',
    interpreter: 'node',
    interpreter_args: '--loader tsx',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
```

```bash
# 2. Створіть директорію для логів
mkdir -p logs

# 3. Запустіть додаток через PM2
pm2 start ecosystem.config.js

# 4. Налаштуйте автозапуск при перезавантаженні сервера
pm2 startup
pm2 save

# 5. Перевірте статус
pm2 status
pm2 logs pikaleads
```

### Крок 8: Налаштування Nginx

```bash
# 1. Створіть конфігурацію Nginx
nano /etc/nginx/sites-available/ukraine.com.ua
```

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name ukraine.com.ua www.ukraine.com.ua;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ukraine.com.ua www.ukraine.com.ua;
    
    # SSL certificates (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/ukraine.com.ua/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ukraine.com.ua/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Logs
    access_log /var/log/nginx/ukraine.com.ua.access.log;
    error_log /var/log/nginx/ukraine.com.ua.error.log;
    
    # Client body size (for file uploads)
    client_max_body_size 50M;
    
    # Proxy to Node.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# 2. Активуйте конфігурацію
ln -s /etc/nginx/sites-available/ukraine.com.ua /etc/nginx/sites-enabled/

# 3. Перевірте конфігурацію Nginx
nginx -t

# 4. Перезапустіть Nginx
systemctl restart nginx
```

### Крок 9: Налаштування SSL (Let's Encrypt)

```bash
# 1. Отримайте SSL сертифікат
certbot --nginx -d ukraine.com.ua -d www.ukraine.com.ua

# Відповідайте на питання:
# - Email: your@email.com
# - Terms of Service: Yes
# - Redirect HTTP to HTTPS: Yes

# 2. Перевірте автоматичне оновлення сертифіката
certbot renew --dry-run

# 3. Налаштуйте cron для автоматичного оновлення
crontab -e
# Додайте рядок:
0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

### Крок 10: Налаштування Firewall

```bash
# 1. Встановіть UFW
apt install -y ufw

# 2. Налаштуйте правила
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'

# 3. Активуйте firewall
ufw enable

# 4. Перевірте статус
ufw status
```

### Крок 11: Налаштування Webhook URLs

Після успішного deployment, налаштуйте webhook URLs:

**Telegram Bot:**
```bash
curl "https://api.telegram.org/bot{YOUR_BOT_TOKEN}/setWebhook?url=https://ukraine.com.ua/api/webhooks/telegram"
```

**Instagram Webhooks:**
- Перейдіть в Facebook App Dashboard → Webhooks
- Callback URL: `https://ukraine.com.ua/api/webhooks/instagram`
- Verify Token: (ваш токен з .env)

**WhatsApp Webhooks:**
- Перейдіть в WhatsApp Business API Dashboard → Webhooks
- Callback URL: `https://ukraine.com.ua/api/webhooks/whatsapp`
- Verify Token: (ваш токен з .env)

---

## 🔧 Управління Додатком

### Корисні команди PM2:

```bash
# Перегляд статусу
pm2 status

# Перегляд логів
pm2 logs pikaleads

# Перезапуск додатку
pm2 restart pikaleads

# Зупинка додатку
pm2 stop pikaleads

# Моніторинг ресурсів
pm2 monit

# Очистка логів
pm2 flush
```

### Оновлення додатку:

```bash
cd /var/www/pikaleads_quiz_system

# 1. Завантажте нові файли (git pull або FTP)
git pull origin main

# 2. Встановіть нові залежності
pnpm install

# 3. Запустіть міграції (якщо є зміни в схемі)
pnpm db:push

# 4. Зберіть новий build
pnpm build

# 5. Перезапустіть додаток
pm2 restart pikaleads
```

### Backup бази даних:

```bash
# Створення backup
mysqldump -u pikaleads_user -p pikaleads > /root/backups/pikaleads_$(date +%Y%m%d).sql

# Відновлення з backup
mysql -u pikaleads_user -p pikaleads < /root/backups/pikaleads_20241207.sql

# Налаштуйте автоматичний backup (cron)
crontab -e
# Додайте:
0 2 * * * mysqldump -u pikaleads_user -p'your_password' pikaleads > /root/backups/pikaleads_$(date +\%Y\%m\%d).sql
```

---

## 🔐 Безпека

### Додаткові рекомендації:

1. **Змініть SSH порт:**
```bash
nano /etc/ssh/sshd_config
# Змініть Port 22 на інший (наприклад 2222)
systemctl restart sshd
ufw allow 2222/tcp
ufw delete allow ssh
```

2. **Вимкніть root login через SSH:**
```bash
nano /etc/ssh/sshd_config
# Встановіть: PermitRootLogin no
systemctl restart sshd
```

3. **Встановіть Fail2Ban:**
```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

4. **Регулярно оновлюйте систему:**
```bash
apt update && apt upgrade -y
```

---

## 📊 Моніторинг

### Встановіть Netdata (опціонально):

```bash
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
# Доступ: http://your-server-ip:19999
```

---

## ❓ Troubleshooting

### Додаток не запускається:

```bash
# Перевірте логи
pm2 logs pikaleads --lines 100

# Перевірте порт
netstat -tulpn | grep 3000

# Перевірте .env файл
cat .env | grep DATABASE_URL
```

### База даних не підключається:

```bash
# Перевірте статус MySQL
systemctl status mariadb

# Перевірте підключення
mysql -u pikaleads_user -p pikaleads
```

### Nginx помилки:

```bash
# Перевірте логи
tail -f /var/log/nginx/ukraine.com.ua.error.log

# Перевірте конфігурацію
nginx -t
```

---

## 📞 Підтримка

Якщо виникли проблеми з deployment, зверніться до документації або створіть issue в репозиторії проекту.

**Корисні ресурси:**
- [Node.js Documentation](https://nodejs.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
