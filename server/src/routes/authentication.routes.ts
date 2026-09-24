import type { CreateUser } from "#shared/types.js";
import { type Request, type Response, Router } from "express";
import { login, register } from "../services/authentication.service.ts";

const authRouter: Router = Router();

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await login(email, password);

    if (!result) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Failed to login:", error);

    return res.status(500).json({
      error: "Failed to login",
    });
  }
});

authRouter.post("/register", async (req: Request, res: Response) => {
  const newUserData = req.body as CreateUser;

  try {
    await register(newUserData);

    return res.status(201).json({
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Failed to register user:", error);

    return res.status(500).json({
      error: "Failed to register user",
    });
  }
});

export default authRouter;
