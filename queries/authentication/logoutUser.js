import pool from "../../db/connection.js";

export const logoutUser = (request, response) => {
  const refreshToken = request.query.token;

  pool.query(
    `DELETE FROM refresh_tokens 
        WHERE refresh_token = $1`,
    [refreshToken],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.sendStatus(204);
    }
  );
};
