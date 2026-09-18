import { type Request, type Response, Router } from "express";
import exerciseRouter from "./exercises.routes.ts";
import pool from "../db/db.js";
import type { CreateUser } from "#shared/types.js";

const userRouter: Router = Router();

exerciseRouter.patch("/:id", async (req: Request, res: Response) => {});

exerciseRouter.delete("/:id", async (req: Request, res: Response) => {});

export default userRouter;
