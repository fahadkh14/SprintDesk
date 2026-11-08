# Build React application
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application source code
COPY . .

# Create production build
RUN npm run build


# Serve application using Nginx
FROM nginx:1.27-alpine

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy React build files
COPY --from=build /app/dist /usr/share/nginx/html

# Expose frontend port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
