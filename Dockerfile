ARG NODE_VERSION=16.13.2-alpine3.15

# STAGE 0
# Get the base node images
# This version needs to be change as we upgrade the node version
# In first step we are pulling the base node image which has shell to build the RoketoBiz application
FROM node:${NODE_VERSION} AS base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update

# STAGE 1-1
FROM base AS turbo_prune

ARG BUILD_ARG_DAPP

# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=$BUILD_ARG_DAPP --docker


# STAGE 1-2
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app

ARG BUILD_ARG_DAPP

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=turbo_prune /app/out/json/ .
COPY --from=turbo_prune /app/out/yarn.lock ./yarn.lock
RUN yarn install --pure-lockfile

# STAGE 2
FROM base AS builder
WORKDIR /app

ARG BUILD_ARG_DAPP
ARG BUILD_ARG_NETWORK_ID
ENV VITE_BUILD_MODE=$BUILD_ARG_NETWORK_ID

# Build the project
COPY --from=installer /app .
COPY --from=turbo_prune /app/out/full/ .
# for creating symlinks for our binaries
RUN yarn install --pure-lockfile
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=$BUILD_ARG_DAPP...

# STAGE 3 — Final image
# RoketoBiz build will create generated JS and CSS in 'dist' directory. We will need this for our application to run
# Copy build output
FROM node:${NODE_VERSION} AS runner

ARG BUILD_ARG_DAPP

WORKDIR /app
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/apps/$BUILD_ARG_DAPP/dist dist
COPY --from=builder /app/apps/$BUILD_ARG_DAPP/static-server.js .

CMD ["node", "static-server.js"]
