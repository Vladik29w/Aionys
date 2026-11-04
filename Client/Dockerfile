# Build Angular app
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Serve Angular app with Nginx
FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Angular build output from build stage
COPY --from=build /app/dist/Client/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
