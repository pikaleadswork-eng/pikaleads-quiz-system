#!/bin/bash

# PIKALEADS Quiz System - Update Script
# Use this script to update an existing installation

set -e

echo "🔄 PIKALEADS Update Script"
echo "=========================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
PROJECT_DIR="/var/www/pikaleads"
BACKUP_DIR="/var/backups/pikaleads"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Check if running in project directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the project directory"
    print_info "cd /var/www/pikaleads && ./update.sh"
    exit 1
fi

# Confirm update
echo ""
print_warning "This will update your PIKALEADS installation."
print_warning "A backup will be created automatically."
read -p "Do you want to continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Update cancelled"
    exit 0
fi

# Step 1: Create backup
print_info "Creating backup..."
mkdir -p "$BACKUP_DIR"
tar -czf "$BACKUP_DIR/pikaleads_backup_$TIMESTAMP.tar.gz" -C "$PROJECT_DIR" . 2>/dev/null || true
print_info "✅ Backup created: $BACKUP_DIR/pikaleads_backup_$TIMESTAMP.tar.gz"

# Step 2: Save .env file
print_info "Saving environment configuration..."
cp .env /tmp/pikaleads_env_backup_$TIMESTAMP

# Step 3: Stop services
print_info "Stopping services..."
docker compose down

# Step 4: Pull latest changes (if using git)
if [ -d ".git" ]; then
    print_info "Pulling latest changes from git..."
    git pull
fi

# Step 5: Install dependencies
print_info "Installing dependencies..."
pnpm install --frozen-lockfile

# Step 6: Build client
print_info "Building client application..."
cd client
pnpm install
pnpm run build
cd ..

# Step 7: Run database migrations
print_info "Running database migrations..."
pnpm db:push

# Step 8: Restore .env if needed
if [ ! -f ".env" ]; then
    print_warning ".env file not found, restoring from backup..."
    cp /tmp/pikaleads_env_backup_$TIMESTAMP .env
fi

# Step 9: Rebuild and restart services
print_info "Restarting services..."
docker compose up -d --build

# Step 10: Wait for services to start
print_info "Waiting for services to start..."
sleep 10

# Step 11: Check health
print_info "Checking application health..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    print_info "✅ Application is healthy!"
else
    print_warning "⚠️  Health check failed. Check logs with: docker compose logs -f"
fi

# Step 12: Show status
print_info "Service status:"
docker compose ps

# Cleanup
rm -f /tmp/pikaleads_env_backup_$TIMESTAMP

echo ""
echo "================================================"
print_info "🎉 Update completed successfully!"
echo "================================================"
echo ""
print_info "Next steps:"
echo "  1. Check application logs: docker compose logs -f app"
echo "  2. Test your application: http://your-server-ip:3000"
echo "  3. If something is wrong, rollback with:"
echo "     cd $PROJECT_DIR"
echo "     docker compose down"
echo "     tar -xzf $BACKUP_DIR/pikaleads_backup_$TIMESTAMP.tar.gz -C $PROJECT_DIR"
echo "     docker compose up -d"
echo ""
print_info "Backup location: $BACKUP_DIR/pikaleads_backup_$TIMESTAMP.tar.gz"
