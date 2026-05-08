# Stage 1: Build the React Application
FROM node:20-alpine AS build

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code and build frontend
COPY . .
RUN npm run build

# Stage 2: Setup Express Backend & Serve Frontend
FROM node:20-alpine

WORKDIR /app

# Copy backend files
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install --production

# Copy backend source
COPY server/ ./server/

# Copy built frontend static files from stage 1
COPY --from=build /app/dist ./server/public

# Configure environment
ENV NODE_ENV=production
ENV PORT=8080

# Expose port (Google Cloud Run expects traffic on port 8080 by default)
EXPOSE 8080

# Start the Express server
CMD ["node", "server/server.js"]
