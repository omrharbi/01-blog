# Docker PostgreSQL Setup for Spring Boot

This guide provides step-by-step commands to set up PostgreSQL with Docker for Spring Boot development.

## Step 1: Clean Up Existing Containers
```bash
# Remove all existing containers (including stopped ones)
docker rm $(docker ps -a -q)
```
**What it does:** Removes all Docker containers to start with a clean slate

## Step 2: Kill Any Running Docker Processes
```bash
# Stop all Docker-related processes
pkill -f dockerd-rootless
pkill -f rootlesskit
```
**What it does:** Terminates any existing Docker daemon processes that might be running

## Step 3: Remove Docker Lock Files
```bash
# Remove Docker state directory to clear any locks
rm -rf /run/user/$(id -u)/dockerd-rootless
```
**What it does:** Clears Docker's state directory to prevent "another RootlessKit is running" errors

## Step 4: Start Docker Daemon
```bash
# Start Docker daemon in background
~/bin/dockerd-rootless.sh --experimental &
```
**What it does:** Starts the rootless Docker daemon process

## Step 5: Set Docker Environment Variable
```bash
# Set Docker socket path for current session
export DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock
```
**What it does:** Tells Docker CLI where to find the Docker daemon socket

## Step 6: Wait for Docker to Start
```bash
# Wait for Docker daemon to fully initialize
sleep 5
```
**What it does:** Gives Docker daemon time to start up completely

## Step 7: Verify Docker is Running
```bash
# Test Docker connection
docker info
```
**What it does:** Displays Docker system information to confirm it's working

## Step 8: Create PostgreSQL Container
```bash
# Create and run PostgreSQL container with blog_db database
docker run --name postgres \
  -e POSTGRES_PASSWORD=sa \
  -e POSTGRES_DB=blog_db \
  -p 5431:5432 \
  -d postgres
```
**What it does:** 
- Creates a PostgreSQL container named "postgres"
- Sets password to "sa"
- Creates "blog_db" database automatically
- Maps port 5431 (host) to 5432 (container)
- Runs in detached mode (background)

## Step 9: Verify Container is Running
```bash
# List running containers
docker ps
```
**What it does:** Shows all currently running Docker containers

## Step 10: Connect to PostgreSQL Database
```bash
# Connect to blog_db database using psql
docker exec -it postgres psql -U postgres -d blog_db
```
**What it does:** Opens PostgreSQL command line interface connected to blog_db

## Database Management Commands (Inside psql)

### View Database Structure
```sql
-- List all tables
\dt

-- List all relations (tables, views, sequences)
\d

-- Describe specific table structure (replace 'users' with your table name)
\d users

-- Show table with detailed column information
\d+ users
```

### View Data
```sql
-- Show all data in users table
SELECT * FROM users;

-- Show connection information
\conninfo

-- Exit psql
\q
```

## Spring Boot Configuration

Update your `application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5431/blog_db?sslmode=disable
    username: postgres
    password: sa
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
    properties:
      hibernate:
        format_sql: true
    database-platform: org.hibernate.dialect.PostgreSQLDialect
```

## Troubleshooting

If Docker stops working, repeat steps 2-7 to restart the Docker daemon.

If the container won't start, remove it and recreate:
```bash
docker rm postgres
# Then run step 8 again
```
