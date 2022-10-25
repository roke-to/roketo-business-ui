#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const {generateApi} = require("swagger-typescript-api");

const scriptFilename = process.argv[1];
// Because this script is linked to node_modules/.bin, it needed to resolve symlink
// to findout real path to the script and then resolve relative path to the templates
const packageDir = path.dirname(fs.realpathSync(scriptFilename));

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
  templates: path.resolve(packageDir, 'templates'),
  // path.resolve works from cwd by default
  output: path.resolve(generatedPath),
  generateResponses: true,
  unwrapResponseData: true,
  patch: true,
  silent: process.env.NODE_ENV !== 'production',
}).catch((err) => {
  console.error(err);

  process.exit(1);
});
