import type { CreateUser, User } from "#shared/types.js";
import pool from "../db/db.js";
import { generateToken } from "#utils/auth.js";
import bcrypt from "bcrypt";

export async function login(email: string, password: string) {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  const user: User = result.rows[0];

  if (!user) {
    return false;
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    return false;
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      profile_picture_url: user.profile_picture_url,
      profile_description: user.profile_description,
    },
  };
}

export async function register(newUserData: CreateUser) {
  const password_hash = await bcrypt.hash(newUserData.password, 10);
  const result = await pool.query(
    `INSERT INTO users 
        (email, password_hash, username)
        VALUES
        ($1, $2, $3)`,
    [newUserData.email, password_hash, newUserData.username],
  );
}
