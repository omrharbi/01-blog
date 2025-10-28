docker run -d --name blog-postgres \
  -e POSTGRES_DB=db_blog \
  -e POSTGRES_USER=omrharbi \
  -e POSTGRES_PASSWORD=omrharbi \
  -p 5432:5432 \
  postgres:15