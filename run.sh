# Stop and remove all containers
docker-compose down

# Remove all containers (including running ones)
docker rm -f $(docker ps -aq)

# Remove all volumes
docker volume prune -f

# Remove all networks
docker network prune -f

# Now try again
docker-compose up -d --build