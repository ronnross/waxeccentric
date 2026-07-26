# Coolify Deployment Blueprint (Home Server)

## Goal
Deploy this app on a home server using Coolify, with:

1. HTTPS on a custom domain
2. Persistent SQLite data across redeploys
3. Repeatable deployment from Git
4. Basic backup and recovery process

## Architecture

1. Coolify runs on your home server
2. Coolify builds and runs this Next.js app from the repository Dockerfile
3. App is exposed on app.yourdomain.com over HTTPS
4. SQLite database files are persisted on host storage and mounted into the container at /app/data
5. Nightly backups copy the SQLite files to another location (NAS, external disk, or separate path)

## Prerequisites

1. Home server with Docker installed
2. Domain name with DNS control
3. Public inbound access on ports 80 and 443
4. SSH access to the host
5. Git repository available to Coolify

## DNS Setup

Create records:

1. coolify.yourdomain.com -> your server public IP
2. app.yourdomain.com -> your server public IP

If your ISP changes IP periodically, use dynamic DNS and keep these records updated.

## Host Hardening Baseline

1. Create non-root sudo user
2. Keep SSH key-based auth enabled
3. Open only required firewall ports:
   1. 22
   2. 80
   3. 443
4. Optional but recommended:
   1. fail2ban
   2. disable SSH password auth

## Install Coolify

1. Run Coolify install using the official installer from Coolify docs
2. Open coolify.yourdomain.com
3. Create first admin account
4. Disable public registration
5. Enable 2FA for admin account

## Important Reverse Proxy Note

Coolify expects to manage web routing for hosted apps. If your existing Nginx already owns ports 80 and 443:

1. Easiest: move Nginx off 80 and 443
2. Alternative: run Coolify on a separate VM or host
3. Advanced: keep Nginx in front and proxy to Coolify

## Add Git Source in Coolify

1. Connect Git provider (GitHub or GitLab)
2. Use least-privilege token or deploy key
3. Select repository for this project
4. Select branch to deploy (main or release)

## Create Application in Coolify

In Coolify create a new Application resource with:

1. Build method: Dockerfile
2. Dockerfile path: Dockerfile at repository root
3. Internal app port: 3000
4. Domain: app.yourdomain.com
5. Health check path: /

## Required Persistent Storage for SQLite

This app uses SQLite under data/kallos.db and creates runtime DB files in /app/data.
Mount persistent host storage:

1. Host path example: /opt/coolify/data/kallos
2. Container path: /app/data
3. Access mode: read-write

Without this volume, data can be lost during redeploys.

## Environment Variables

Set in Coolify Application settings:

1. NODE_ENV = production
2. PORT = 3000
3. HOSTNAME = 0.0.0.0

## First Deploy Checklist

1. Trigger deploy in Coolify
2. Confirm build succeeds
3. Confirm container starts and health check passes
4. Open https://app.yourdomain.com
5. Verify app loads and schedule page works
6. Verify database files appear in persistent host path

## Data Initialization

The app runs DB migrations automatically at startup.

If you need initial data:

1. Restore existing kallos.db into the persistent path before first production start, or
2. Run seed process once against production

Do not run seed repeatedly unless that is intentional.

## Backup Plan (SQLite)

Back up these files from the persistent host path:

1. kallos.db
2. kallos.db-wal
3. kallos.db-shm

Recommended retention:

1. 7 daily backups
2. 4 weekly backups
3. 3 monthly backups

Recommended schedule:

1. Nightly backup during low traffic
2. Monthly restore test to validate backup integrity

## Rollback Plan

If a deployment fails:

1. Use Coolify to redeploy last known good release
2. If data issue occurs, stop app and restore SQLite backup files
3. Start app and verify health check and key routes

## Ongoing Operations

1. Enable auto-deploy on push if desired
2. Watch Coolify logs for build and runtime issues
3. Apply OS, Docker, and Coolify updates monthly
4. Reboot during maintenance windows

## Quick Day-1 Execution List

1. Configure DNS for coolify.yourdomain.com and app.yourdomain.com
2. Install and secure Coolify
3. Connect Git repository
4. Create application using Dockerfile
5. Configure persistent volume /opt/coolify/data/kallos -> /app/data
6. Set environment variables
7. Deploy
8. Verify app and data persistence
9. Configure nightly backup of SQLite files
