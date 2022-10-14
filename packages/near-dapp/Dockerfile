# STAGE 1
# Get the base node images
# This version needs to be change as we upgrade the node version
# In first step we are pulling the base node image which has shell to build the RoketoBiz application
FROM node:16.13.2-alpine3.15 AS base
# Set working directory
WORKDIR /base
# Copy root level package files and install any root dependency
COPY ["./packages/near-dapp/package.json", "package.json", "yarn.lock", "./"]
RUN yarn --pure-lockfile
# Copy required packages
COPY . .

# STAGE 2
# Generate third-party api
FROM base AS generate
ARG BUILD_ARG_VITE_NEAR_NETWORK_ID
WORKDIR /generate
COPY --from=base /base ./
RUN NODE_ENV=$BUILD_ARG_VITE_NEAR_NETWORK_ID yarn workspace near-dapp generate:api

# STAGE 3
# Build the RoketoBiz app
FROM generate AS build
ARG BUILD_ARG_VITE_NEAR_NETWORK_ID
WORKDIR /build
COPY --from=generate /generate ./
RUN yarn workspace near-dapp build --mode $BUILD_ARG_VITE_NEAR_NETWORK_ID

# STAGE 4 — Final image
# RoketoBiz build will create generated JS and CSS in 'dist' directory. We will need this for our application to run
# Copy build output
FROM node:16.13.2-alpine3.15
WORKDIR /build

COPY --from=build /build/node_modules node_modules
COPY --from=build /build/static-server.js .
COPY --from=build /build/dist ./dist/

CMD ["node", "static-server.js"]
