# Use Node.js Alpine image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy backend source code
COPY src ./src

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5761

# Run application as non-root user
USER node

# Expose backend port
EXPOSE 5761

# Start backend application
CMD ["node", "src/app.js"]
