docker run -d --rm -it \
  --name coffee-dev \
  -p 3000:3000 \
  -v "$(pwd)":/app \
  -w /app \
  node:24-alpine;