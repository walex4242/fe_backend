# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile TypeScript
RUN npx tsc

# Expose the desired port
EXPOSE 8080

# Command to run the application
CMD ["node", "dist/index.js"]  # Adjust the path if needed
