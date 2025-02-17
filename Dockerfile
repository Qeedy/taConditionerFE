# Tahap 1: Build React App
FROM node:18-alpine AS builder  # Gunakan versi Alpine yang lebih kecil
WORKDIR /app

# Salin hanya package.json dan package-lock.json lebih dahulu (agar cache digunakan)
COPY package*.json ./

# Install dependencies (tanpa cache)
RUN npm install --legacy-peer-deps --no-cache

# Salin seluruh kode proyek
COPY . .

# Build aplikasi React
RUN npm run build

# Tahap 2: Gunakan Nginx untuk serving React App
FROM nginx:alpine

# Salin file hasil build dari tahap sebelumnya ke folder Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Ubah konfigurasi Nginx agar mendengarkan di port 8080 (untuk Cloud Run)
RUN sed -i 's/listen 80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Expose port yang sesuai dengan Cloud Run
EXPOSE 8080

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
