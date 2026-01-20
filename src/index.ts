import { render } from '@react-email/render';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';

import { KalshiGrantsTemplate } from './email-templates/KalshiGrantsTemplate';
import { logError, logInfo } from './utils/logger';

config();

import './workers/logicWorker';
import './workers/emailWorker';
import './jobs';

const app = express();
const PORT = process.env.PORT || 4000;

const errorHandler = (
  err: Error,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) => {
  logError(err, {
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
  }).catch(console.error);

  res.status(500).json({ error: 'Internal Server Error' });
};

app.use(cors());
app.use(express.json());

app.get('/preview/kalshi-grants', async (_req, res) => {
  const html = await render(KalshiGrantsTemplate({ name: 'John' }));
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await logInfo('Starting email service', {
      port: PORT,
      environment: process.env.SERVER_ENV || 'development',
      nodeVersion: process.version,
    });

    app.listen(PORT, () => {
      logInfo('Email service started successfully', {
        port: PORT,
        pid: process.pid,
      }).catch(console.error);
    });
  } catch (error) {
    await logError(error as Error, {
      stage: 'server_startup',
    });
    process.exit(1);
  }
};

process.on('uncaughtException', (error) => {
  logError(error, {
    type: 'uncaught_exception',
  }).catch(console.error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logError(reason as Error, {
    type: 'unhandled_rejection',
  }).catch(console.error);
});

startServer();
