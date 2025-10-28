FROM node:lts-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install -g npm@11.6.2

# Copy source code
COPY . .

# Expose Angular dev server port
EXPOSE 4200

# Start Angular development server with host 0.0.0.0
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "1000"]