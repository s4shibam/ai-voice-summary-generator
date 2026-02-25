import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { voice_router } from './router/voice.js';

dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.use('/voice', voice_router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
