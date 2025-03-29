import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';

config();

import './workers/logicWorker';
import './workers/emailWorker';
import './jobs';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
