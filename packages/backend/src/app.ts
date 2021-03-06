import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { logger } from 'jege/server';

import * as db from './dynamodb';

const log = logger('[backend]');

const port = process.env.BACKEND_PORT as string;

function trafficLog(req, _, next) {
  log('trafficLog(): url: %s, body: %j', req.url, req.body);
  next();
}

function withApi(app: express.Express) {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(cors());
  app.use(trafficLog);

  app.post('/crawled', async (req, res) => {
    const result = await db.getCrawled(req.body);
    res.send({
      payload: result,
    });
  });
}

async function main() {
  log('main(): port: %s', port);

  const app = express();
  withApi(app);

  const server = http.createServer(app);
  server.listen(port, () => {
    log('main(): server is listening on port: %s', port);
  })
}

export default main;
