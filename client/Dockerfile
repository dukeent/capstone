# Use the official Node.js image as the base image
FROM node:18-alpine as build-stage

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the application
RUN npm run build

FROM node:18-alpine as prod-stage
# Copy node modules and build directory
COPY --from=build-stage ./node_modules ./node_modules
COPY --from=build-stage /build /build
RUN ls

FROM nginx 
EXPOSE 80 
COPY --from=build-stage /build /usr/share/nginx/html