#!/bin/bash

# PIKALEADS Quiz System - VPS Deployment Script
# This script automates the deployment process on your VPS

set -e  # Exit on any error

echo "🚀 Starting PIKALEADS deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/pikaleads"
BACKUP_DIR="/var/backups/pikaleads"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root or with sudo"
    exit 1
fi

# Step 1: Create backup of current installation
print_info "Creating backup of current installation..."
if [ -d "$PROJECT_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    tar -czf "$BACKUP_DIR/pikaleads_backup_$TIMESTAMP.tar.gz" -C "$PROJECT_DIR" .
    print_info "Backup created: $BACKUP_DIR/pikaleads_backup_$TIMESTAMP.tar.gz"
else
    print_warning "No existing installation found, skipping backup"
fi

# Step 2: Stop existing services
print_info "Stopping existing services..."
if [ -f "$PROJECT_DIR/docker-compose.yml" ]; then
    cd "$PROJECT_DIR"
    docker-compose down || print_warning "Failed to stop services (they might not be running)"
fi

# Step 3: Create project directory
print_info "Preparing project directory..."
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Step 4: Extract new files
print_info "Extracting new files..."
if [ -f "/tmp/pikaleads_quiz_system.tar.gz" ]; then
    tar -xzf /tmp/pikaleads_quiz_system.tar.gz -C "$PROJECT_DIR"
    print_info "Files extracted successfully"
else
    print_error "Archive not found at /tmp/pikaleads_quiz_system.tar.gz"
    print_info "Please upload the archive to /tmp/ first"
    exit 1
fi

# Step 5: Check for .env file
print_info "Checking environment configuration..."
if [ ! -f "$PROJECT_DIR/.env" ]; then
    print_warning ".env file not found!"
    if [ -f "$PROJECT_DIR/.env.production.example" ]; then
        cp "$PROJECT_DIR/.env.production.example" "$PROJECT_DIR/.env"
        print_info "Created .env from example. Please edit it with your configuration:"
        print_info "nano $PROJECT_DIR/.env"
        read -p "Press Enter after you've configured the .env file..."
    else
        print_error "No .env.production.example found. Cannot continue."
        exit 1
    fi
fi

# Step 6: Install dependencies
print_info "Installing dependencies..."
if ! command -v pnpm &> /dev/null; then
    print_info "Installing pnpm..."
    npm install -g pnpm
fi

pnpm install --frozen-lockfile

# Step 7: Build client
print_info "Building client application..."
cd "$PROJECT_DIR/client"
pnpm install
pnpm run build
cd "$PROJECT_DIR"

# Step 8: Run database migrations
print_info "Running database migrations..."
pnpm db:push

# Step 9: Create SSL directory (if using HTTPS)
print_info "Preparing SSL directory..."
mkdir -p "$PROJECT_DIR/ssl"
mkdir -p "$PROJECT_DIR/logs"
mkdir -p "$PROJECT_DIR/logs/nginx"

# Step 10: Update Nginx configuration
print_info "Updating Nginx configuration..."
if [ -f "$PROJECT_DIR/nginx.conf" ]; then
    read -p "Enter your domain name (e.g., pikaleads.com): " DOMAIN_NAME
    if [ ! -z "$DOMAIN_NAME" ]; then
        sed -i "s/your-domain.com/$DOMAIN_NAME/g" "$PROJECT_DIR/nginx.conf"
        print_info "Domain updated to: $DOMAIN_NAME"
    fi
fi

# Step 11: Start services with Docker Compose
print_info "Starting services..."
docker-compose up -d --build

# Step 12: Wait for services to start
print_info "Waiting for services to start..."
sleep 10

# Step 13: Check service status
print_info "Checking service status..."
docker-compose ps

# Step 14: Test application
print_info "Testing application..."
if curl -s http://localhost:3000/health > /dev/null; then
    print_info "✅ Application is running successfully!"
else
    print_warning "⚠️  Health check failed. Check logs with: docker-compose logs -f"
fi

# Step 15: Display next steps
echo ""
echo "================================================"
print_info "🎉 Deployment completed!"
echo "================================================"
echo ""
print_info "Next steps:"
echo "  1. Configure your domain DNS to point to this server"
echo "  2. Set up SSL certificate:"
echo "     - Option A: Use Let's Encrypt (recommended)"
echo "       sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo "     - Option B: Place your SSL certificates in: $PROJECT_DIR/ssl/"
echo "  3. Check application logs:"
echo "     docker-compose logs -f app"
echo "  4. Check Nginx logs:"
echo "     docker-compose logs -f nginx"
echo "  5. Access your application:"
echo "     http://your-server-ip:3000 (direct)"
echo "     http://your-server-ip (via Nginx)"
echo ""
print_info "To rollback to previous version:"
echo "  tar -xzf $BACKUP_DIR/pikaleads_backup_$TIMESTAMP.tar.gz -C $PROJECT_DIR"
echo "  cd $PROJECT_DIR && docker-compose up -d"
echo ""
print_info "Deployment script completed!"
