# 1. Use a slim version of Node.js for a smaller, faster image
FROM node:20-slim

# 2. Create an app directory inside the container
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json first
# This allows Docker to cache your dependencies if they haven't changed
COPY package*.json ./

# 4. Install dependencies (frozen-lockfile ensures it matches your local dev)
RUN npm install --omit=dev

# 5. Copy the rest of your application code
COPY . .

# 6. Your app runs on port 3000 (standard for Fastify/Express)
EXPOSE 3000

# 7. Use 'node' instead of 'npm' to start the app (better for signal handling)
CMD [ "node", "index.js" ]