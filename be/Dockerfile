FROM node:latest

# Tạo thư mục làm việc
WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt tất cả dependencies (bao gồm devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start application in development mode
CMD ["npm", "run", "dev"]
