import cors from 'cors';
import { config } from 'dotenv';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import jwt from 'jsonwebtoken';

import { getPriority, logicQueue } from './utils';

config();

import './workers/logicWorker';
import './workers/emailWorker';
import './jobs';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.AUTH_SECRET as string, (err, _user) => {
    if (err) {
      console.log('Token verification failed:', err);
      return res.sendStatus(403);
    }
    next();
  });
};

app.post('/email', authenticateToken, async (req: Request, res: Response) => {
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
