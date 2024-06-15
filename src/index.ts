import express, { Request, Response } from 'express';
import { getPriority, logicQueue } from './utils';
import { config } from 'dotenv';
import cors from 'cors';

config();

import './workers/logicWorker';
import './workers/emailWorker';
import './jobs';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post('/email', async (req: Request, res: Response) => {
  const { type, id, userId, otherInfo } = req.body;
  const priority = getPriority(type);

  await logicQueue.add(
    'processLogic',
    {
      type,
      id,
      userId,
      otherInfo,
    },
    { priority },
  );
  res.send('Email processing initiated.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
