# STAGE 1
# Get the base node images
# This version needs to be change as we upgrade the node version
# In first step we are pulling the base node image which has shell to build the RoketoBiz application
FROM node:16.13.2-alpine3.15 AS base
# Set working directory
WORKDIR /base
# Copy root level package files and install any root dependency
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn --pure-lockfile
# Copy required packages
COPY . .

# STAGE 2
# Build the RoketoBiz app
FROM base AS build
ARG BUILD_ARG_VITE_NEAR_NETWORK_ID
WORKDIR /build
COPY --from=base /base ./
RUN yarn build --mode $BUILD_ARG_VITE_NEAR_NETWORK_ID

# STAGE 3 — Final image
# RoketoBiz build will create generated JS and CSS in 'dist' directory. We will need this for our application to run
# Copy build output
FROM nginx:1.22.0-alpine

USER node

COPY --from=build --chown=node:node /build/dist ./

CMD ["nginx", "-g", "daemon off;"]
