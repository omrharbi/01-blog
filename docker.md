Or remove all containers at once:
docker rm $(docker ps -a -q)
# Start Docker daemon
~/bin/dockerd-rootless.sh --experimental &
#----
Create PostgreSQL container and database:
    # Create and run PostgreSQL container
docker run --name postgres \
  -e POSTGRES_PASSWORD=sa \
  -e POSTGRES_DB=blog_db \
  -p 5431:5432 \
  -d postgres
# Remove the corrupted container
docker rm postgres
# Verify it's running
docker ps
# Connect to the database
docker exec -it postgres psql -U postgres -d blog_db
#db 
-- List all tables
\dt

-- List all relations (tables, views, sequences)
\d

-- Describe specific table structure
\d table_name
\d users

-- Show table with column details
\d+ users



# Stop all containers
docker-compose down

# Remove all stopped containers
docker container prune -f

# Remove all unused images
docker image prune -a -f

# Remove all unused volumes
docker volume prune -f

# Remove all unused networks
docker network prune -f