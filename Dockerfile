# STAGE 1
# Get the base node images
# This version needs to be change as we upgrade the node version
# In first step we are pulling the base node image which has shell to build the RoketoBiz application
FROM node:16.13.2-alpine3.15 AS base

ARG BUILD_ARG_DAPP

# Set working directory
WORKDIR /app
RUN mkdir -p "packages/$BUILD_ARG_DAPP"
RUN mkdir -p "packages/core"
# Copy root level package files and install any root dependency
COPY ["package.json", "yarn.lock", ""]
# Copy required packages
# If <src> is a directory, the entire contents of the directory are copied,
# including filesystem metadata.
COPY packages/core packages/core
COPY packages/get-dotenv packages/get-dotenv
COPY packages/rb-api packages/rb-api
COPY packages/astro-api packages/astro-api
# env needs to be copied before yarn install, because after api will be generated
COPY packages/$BUILD_ARG_DAPP/package.json packages/$BUILD_ARG_DAPP/.env packages/$BUILD_ARG_DAPP/.env.testnet packages/$BUILD_ARG_DAPP/.env.mainnet packages/$BUILD_ARG_DAPP
RUN yarn --pure-lockfile
COPY . .

# STAGE 2
# Build the RoketoBiz app
FROM base AS build

ARG BUILD_ARG_DAPP
ARG BUILD_ARG_NETWORK_ID

WORKDIR /app
COPY --from=base /app .
WORKDIR /app/packages/$BUILD_ARG_DAPP
RUN yarn build --mode $BUILD_ARG_NETWORK_ID

# STAGE 3 — Final image
# RoketoBiz build will create generated JS and CSS in 'dist' directory. We will need this for our application to run
# Copy build output
FROM node:16.13.2-alpine3.15

ARG BUILD_ARG_DAPP

WORKDIR /app
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/packages/$BUILD_ARG_DAPP/dist dist
COPY --from=build /app/packages/$BUILD_ARG_DAPP/static-server.js .

CMD ["node", "static-server.js"]
