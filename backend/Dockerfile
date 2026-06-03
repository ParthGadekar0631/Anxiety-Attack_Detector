FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY backend ./backend
EXPOSE 5000
CMD ["node", "backend/src/server.js"]
