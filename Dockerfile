# Stage 1: Build
FROM node:18 AS builder

# Set direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh source code ke dalam container
COPY . .

# Build aplikasi React (akan menghasilkan folder build)
RUN npm run build

# Stage 2: Serve dengan Nginx
FROM nginx:alpine

# Salin hasil build dari stage builder ke direktori yang dilayani Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Jalankan Nginx dalam mode foreground
CMD ["nginx", "-g", "daemon off;"]