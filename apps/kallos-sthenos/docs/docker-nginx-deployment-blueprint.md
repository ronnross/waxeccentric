# Docker + Nginx Deployment Blueprint (Ubuntu Home Server)

## Goal
Deploy this app on a home server using Docker for the app container and Nginx as the reverse proxy.

This runbook covers:

1. Build and run the app with Docker
2. Persist SQLite data safely
3. Configure Nginx reverse proxy
4. Add HTTPS with Let's Encrypt
5. Add backups and update workflow

## Target OS

This guide is written for Ubuntu Server (22.04 or 24.04).

## App Facts (This Repository)

1. App container listens on port 3000
2. SQLite database files are written under /app/data inside the container
3. Existing compose setup already maps ./data to /app/data
4. Migrations run automatically on startup

## Prerequisites

1. Linux home server with Docker and Nginx installed
2. Domain name with DNS control
3. Ports 80 and 443 forwarded to your server
4. SSH access to host

## Ubuntu One-Time Host Setup

Run these on a fresh Ubuntu host.

Update base packages:

```bash
sudo apt-get update && sudo apt-get upgrade -y
```

Install Docker Engine + Compose plugin:

```bash
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Install Nginx and Certbot:

```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

Allow your user to run Docker:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

Enable services at boot:

```bash
sudo systemctl enable docker
sudo systemctl enable nginx
```

## Recommended Directory Layout on Host

Use a stable app directory on the host, for example:

1. /opt/kallos-sthenos/app
2. /opt/kallos-sthenos/data
3. /opt/kallos-sthenos/backups

## Step 1: DNS

Create an A record:

1. app.yourdomain.com -> your server public IP

## Step 2: Clone and Prepare

```bash
sudo mkdir -p /opt/kallos-sthenos
sudo chown -R "$USER":"$USER" /opt/kallos-sthenos
cd /opt/kallos-sthenos
git clone <your-repo-url> app
cd app
mkdir -p ../data ../backups
```

## Step 3: Configure Compose for Host-Persistent Data

Update compose volume mapping so DB is outside the repo path and survives repo cleanup.

Example compose service:

```yaml
services:
  app:
    build: .
    container_name: kallos-app
    restart: unless-stopped
    ports:
      - "127.0.0.1:3000:3000"
    volumes:
      - /opt/kallos-sthenos/data:/app/data
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOSTNAME=0.0.0.0
```

Why bind to 127.0.0.1: only Nginx should access app port directly.

## Step 4: Build and Run App

```bash
cd /opt/kallos-sthenos/app
docker compose up -d --build
docker compose ps
```

Verify app responds locally:

```bash
curl -I http://127.0.0.1:3000
```

## Step 5: Nginx Reverse Proxy

Create Nginx site file:

```bash
sudo nano /etc/nginx/sites-available/kallos
```

Put this config in it:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name app.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

Enable site and test:

```bash
sudo ln -s /etc/nginx/sites-available/kallos /etc/nginx/sites-enabled/kallos
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: HTTPS with Let's Encrypt

Issue certificate:

```bash
sudo certbot --nginx -d app.yourdomain.com
```

Verify renewal timer:

```bash
systemctl list-timers | grep certbot
```

## Step 7: Firewall

Example with UFW:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

## Step 8: Backup SQLite (Nightly)

Back up these files if present:

1. kallos.db
2. kallos.db-wal
3. kallos.db-shm

Create backup script:

```bash
mkdir -p /opt/kallos-sthenos/scripts
nano /opt/kallos-sthenos/scripts/backup-kallos.sh
```

Script content:

```bash
#!/usr/bin/env bash
set -euo pipefail

SRC_DIR="/opt/kallos-sthenos/data"
DST_DIR="/opt/kallos-sthenos/backups"
STAMP="$(date +%F-%H%M%S)"
TMP_DIR="${DST_DIR}/kallos-${STAMP}"

mkdir -p "$TMP_DIR"

for f in kallos.db kallos.db-wal kallos.db-shm; do
  if [[ -f "${SRC_DIR}/${f}" ]]; then
    cp "${SRC_DIR}/${f}" "$TMP_DIR/"
  fi
done

tar -czf "${DST_DIR}/kallos-${STAMP}.tar.gz" -C "$TMP_DIR" .
rm -rf "$TMP_DIR"

# keep last 30 backups
ls -1t "${DST_DIR}"/kallos-*.tar.gz | tail -n +31 | xargs -r rm -f
```

Make executable and test:

```bash
chmod +x /opt/kallos-sthenos/scripts/backup-kallos.sh
/opt/kallos-sthenos/scripts/backup-kallos.sh
```

Add nightly cron (2:30 AM):

```bash
crontab -e
```

```cron
30 2 * * * /opt/kallos-sthenos/scripts/backup-kallos.sh
```

## Step 9: Update Workflow

Deploy new code:

```bash
cd /opt/kallos-sthenos/app
git pull
docker compose up -d --build
```

Roll back quickly (if needed):

1. Checkout previous commit or tag
2. Rebuild and restart container

```bash
git checkout <known-good-commit-or-tag>
docker compose up -d --build
```

## Step 10: Validation Checklist

1. https://app.yourdomain.com loads
2. Schedule page works
3. Database writes persist after container restart
4. Backup archive is created nightly
5. Nginx and Docker restart cleanly after host reboot

## Troubleshooting

### App not reachable through domain

1. Check DNS resolves to your public IP
2. Check router port forwarding for 80 and 443
3. Check Nginx site enabled and syntax valid
4. Check firewall allows Nginx Full profile

### App reachable but no data persistence

1. Verify compose volume maps host path to /app/data
2. Verify files exist under /opt/kallos-sthenos/data
3. Verify container user can write to that directory

### SSL certificate issue

1. Ensure port 80 is reachable from internet
2. Re-run certbot command
3. Check nginx logs and certbot logs

## Optional Improvements

1. Add fail2ban
2. Add monitoring (Uptime Kuma, healthchecks)
3. Mirror backups to NAS or cloud bucket
4. Pin image versions and deploy from tags
