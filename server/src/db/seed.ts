import bcrypt from "bcrypt";
import fs from "node:fs/promises";
import pool from "./db.js";

async function seed() {
  console.log(process.env.DATABASE_URL);
  try {
    const passwordHash = await bcrypt.hash("password123", 10);

    await pool.query(
      `
      INSERT INTO users (
        email,
        password_hash,
        username,
        profile_picture_url,
        profile_description
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO NOTHING
      `,
      ["user@test.com", passwordHash, "user", null, "Test user"],
    );

    const sql = await fs.readFile(
      new URL("./seed.sql", import.meta.url),
      "utf-8",
    );

    await pool.query(sql);

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Failed to seed database:", error);
  } finally {
    await pool.end();
  }
}

seed();
