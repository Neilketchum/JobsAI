# Use the official Node.js image as the base image
FROM node:20

# Install Google Chrome Stable for headless PDF generation
RUN apt-get update && apt-get install -y wget gnupg \
  && wget -qO - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" \
    > /etc/apt/sources.list.d/google-chrome.list \
  && apt-get update && apt-get install -y google-chrome-stable \
  && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy .env file
COPY .env ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the backend server
CMD ["node", "index.js"]
