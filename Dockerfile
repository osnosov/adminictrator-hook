FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./

# If you are building your code for production
RUN npm install --production
#RUN npm ci --no-progress

# Bundle app source
COPY . .

# Set environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Export the port
EXPOSE 3000

# Run default cmd
CMD [ "node", "index.js" ]