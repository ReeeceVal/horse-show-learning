import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import api from './routes/index.js';
import { notFound, errorHandler } from './middleware/errors.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', api);
// server.js (before notFound)
app.get('/', (_req, res) => {
    res.json({ status: 'ok', message: 'Horse Show API — see /api/health' });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
});