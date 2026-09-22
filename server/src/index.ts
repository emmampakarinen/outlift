import express, { type Express, type Request, type Response } from "express";
import locationRouter from "./routes/locations.routes.js";
import workoutRouter from "./routes/workouts.routes.js";
import exerciseRouter from "#routes/exercises.routes.js";
import cors from "cors";
import userRouter from "#routes/users.routes.js";
import authRouter from "#routes/authentication.routes.js";
import equipmentRouter from "#routes/equipment.routes.js";

const app: Express = express();
const port = 3000;
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use("/locations", locationRouter);
app.use("/workouts", workoutRouter);
app.use("/exercises", exerciseRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/equipment", equipmentRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;
