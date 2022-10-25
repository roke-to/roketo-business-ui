#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const {generateApi} = require("swagger-typescript-api");

const scriptFilename = process.argv[1];

const args = process.argv.splice(2);

// Path to the output directory
const generatedPath = args[0];
// Endpoint that serves openapi.json
const apiEndpoint = args[1];

if (!generatedPath || !apiEndpoint) {
  console.log(`Usage: ${path.basename(scriptFilename)} <path/to/generated> <api-endpoint>`);
  process.exit(1);
}

console.log(`Generating API types from ${apiEndpoint} in ${path.resolve(generatedPath)}`);

fs.mkdirSync(generatedPath, {recursive: true});

generateApi({
  url: apiEndpoint,
  name: "index.ts",
  // path.resolve works from cwd by default
  output: path.resolve(generatedPath),
  generateResponses: true,
  unwrapResponseData: true,
  patch: true,
  silent: process.env.NODE_ENV !== 'production',
  apiClassName: 'AstroApi',
}).catch((err) => {
  console.error(err);

  process.exit(1);
});
