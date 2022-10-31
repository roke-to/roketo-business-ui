'use strict';

const handler = require('serve-handler');
const http = require('http');
const logger = require('pino-http')();

const serveOptions = {
  public: './dist',
  renderSingle: true,
  directoryListing: false,
  rewrites: [{source: '*', destination: '/index.html'}],
};

const server = http.createServer((req, res) => {
  logger(req, res);

  if (req.method === 'GET' && req.url === '/ping') {
    return res.end();
  }
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  return handler(req, res, serveOptions);
});

const port = process.env.PORT ? Number(process.env.PORT) : 80;

process.exit(1);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
