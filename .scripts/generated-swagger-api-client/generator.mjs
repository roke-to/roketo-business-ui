import fs from 'fs';
import path from 'path';
import swaggerTypescriptApi from 'swagger-typescript-api';
import {argv} from 'zx';
import 'zx/globals';

const {generateApi} = swaggerTypescriptApi;

const appDirectory = fs.realpathSync(process.cwd());

async function main() {
  const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

  const {
    'api-path': apiPathRaw,
    'output-dir': outputDirRaw,
    'output-file': outputFileRaw = 'index.ts',
  } = argv;

  generateApi({
    name: outputFileRaw,
    url: apiPathRaw,
    generateClient: true,
    output: resolveApp(outputDirRaw),
    generateResponses: true,
    cleanOutput: true,
    httpClientType: 'axios',
  });
}

main();
