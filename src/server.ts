import express from "express";
import mysql2 from "mysql2/promise";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5000;

let connection: mysql2.Connection;

const connectToDatabase = async () => {
  try {
    connection = await mysql2.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: "To-Do",
    });
    console.log("Connected to Database");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
};

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

export const closeDatabaseConnection = async () => {
  try {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  } catch (err) {
    console.error("Error closing the database connection:", err);
  }
};

app.on("close", () => {
  console.log("Server Shutdown");
  closeDatabaseConnection();
});

const init = async () => {
  await connectToDatabase();
  startServer();
  return app;
};

const getConnection = async () => {
  if (connection) return connection;
  await connectToDatabase();
  return connection;
};
export { init, getConnection };
