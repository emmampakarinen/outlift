import express, { type Express, type Request, type Response } from 'express';
import locationRouter from './routes/locations.routes.js';

const app: Express = express();
const port = 3000;
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok'});
});

app.use("/locations", locationRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;