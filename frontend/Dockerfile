# Use Node.js 20 Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies with optimizations
RUN npm ci --only=production=false --no-audit --no-fund

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start the development server with optimizations
CMD ["npm", "run", "dev", "--", "--turbo"]
