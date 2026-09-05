# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Production Express runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Install backend dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --omit=dev

# Copy backend code
COPY server/ ./

# Copy compiled frontend from Stage 1
COPY --from=frontend-builder /app/client/dist /app/client/dist

ENV PORT=5000
EXPOSE 5000

CMD ["npm", "start"]