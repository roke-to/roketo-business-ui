# STAGE 1
# Get the base node images
# This version needs to be change as we upgrade the node version
# In first step we are pulling the base node image which has shell to build the RoketoBiz application
FROM node:16.13.2-alpine3.15 AS base
# Set working directory
WORKDIR /base
RUN mkdir -p "packages/near-dapp"
# Copy root level package files and install any root dependency
COPY ["package.json", "yarn.lock", "./"]
COPY ./packages/near-dapp/package.json ./packages/near-dapp/package.json
RUN yarn --pure-lockfile
# Copy required packages
COPY . .

# STAGE 2
# Generate third-party api
FROM base AS generate
ARG BUILD_ARG_VITE_NEAR_NETWORK_ID
WORKDIR /generate
COPY --from=base /base ./
WORKDIR /base/packages/near-dapp
RUN NODE_ENV=$BUILD_ARG_VITE_NEAR_NETWORK_ID yarn generate:api

# STAGE 3
# Build the RoketoBiz app
FROM generate AS build
ARG BUILD_ARG_VITE_NEAR_NETWORK_ID
WORKDIR /build
COPY --from=generate /generate ./
WORKDIR /build/packages/near-dapp
RUN yarn build --mode $BUILD_ARG_VITE_NEAR_NETWORK_ID

# STAGE 4 — Final image
# RoketoBiz build will create generated JS and CSS in 'dist' directory. We will need this for our application to run
# Copy build output
FROM node:16.13.2-alpine3.15
WORKDIR /build

COPY --from=build /build/node_modules node_modules
COPY --from=build /build/packages/near-dapp/static-server.js .
COPY --from=build /build/packages/near-dapp/dist ./dist/

CMD ["node", "static-server.js"]
