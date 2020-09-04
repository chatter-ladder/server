import pool from "../../db/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const loginUser = (request, response) => {
  const { email, password } = request.body;

  // Authenticate User:
  pool.query(
    "SELECT * FROM users WHERE email = $1;",
    [email],
    async (error, results) => {
      if (error) {
        throw error;
      }

      if (results.rows.length === 0) {
        return response.status(400).send({ error: "Cannot find user" });
      }
      try {
        if (
          await bcrypt.compare(request.body.password, results.rows[0].password)
        ) {
          const username = results.rows[0].username;
          const user = results.rows[0];

          const accessToken = jwt.sign(
            { id: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "3600s" }
          );
          const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET
          );

          pool.query(
            `INSERT INTO refresh_tokens (refresh_token)
                    VALUES ($1)`,
            [refreshToken],
            (error, results) => {
              if (error) {
                throw error;
              }
              // console.log('refresh token saved to db')
            }
          );
          // console.log("logging user in...");
          response.status(200).send({
            userId: user.id,
            accessToken: accessToken,
            expiresIn: "3600",
            refreshToken: refreshToken,
          });
        } else {
          console.log("Password didn't match...");
          return response.status(404).send({ error: "Passwords don't match" });
        }
      } catch {
        console.log("Something went wrong..");
        return response.status(500).send({ error: "It just didn't work" });
      }
    }
  );
};
