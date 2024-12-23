import cors from 'cors';
import { config } from 'dotenv';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import jwt from 'jsonwebtoken';

config();

import './workers/logicWorker';
import './workers/emailWorker';
import './jobs';

import { getPriority } from './utils/getPriority';
import { logicQueue } from './utils/queue';

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

app.post('/email', authenticateToken, (req: Request, res: Response) => {
  try {
    const { type, id, userId, otherInfo } = req.body;
    const priority = getPriority(type);

    res.status(202).json({ message: 'Email processing initiated' });

    logicQueue
      .add(
        'processLogic',
        {
          type,
          id,
          userId,
          otherInfo,
        },
        { priority },
      )
      .catch((error) => {
        console.error('Failed to add job to logic queue:', {
          error,
          type,
          id,
          userId,
        });
      });
  } catch (error) {
    console.error('Error processing email request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
