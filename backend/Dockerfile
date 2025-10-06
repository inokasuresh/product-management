# Use official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the source
COPY . .

# Expose backend port
EXPOSE 8080

# Default command (override in docker-compose if needed)
CMD ["npm", "run", "dev"]
