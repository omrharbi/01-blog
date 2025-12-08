docker run -d --name blog_db \
  -e POSTGRES_DB=blog_db \
  -e POSTGRES_USER=omrharbi \
  -e POSTGRES_PASSWORD=omrharbi \
  -p 5432:5432 \
  postgres:15