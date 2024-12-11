# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install Yarn using the Alpine package manager
RUN apk add --no-cache yarn

# Copy package.json and yarn.lock
COPY package.json yarn.lock* ./

# Install all dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose port
EXPOSE 3000

# Set environment to development
ENV NODE_ENV=development

# Command to run the development server
CMD ["yarn", "start"]