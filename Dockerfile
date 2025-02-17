# Tahap 1: Build React App
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Salin semua file proyek ke dalam container
COPY . .

# Build aplikasi React untuk produksi
RUN npm run build

# Tahap 2: Gunakan Nginx untuk serving React App
FROM nginx:alpine

# Salin file hasil build dari tahap sebelumnya ke folder Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Ubah konfigurasi Nginx agar mendengarkan di port 8080 (sesuai Cloud Run)
RUN sed -i 's/listen 80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Expose port 8080 agar sesuai dengan Cloud Run
EXPOSE 8080

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
