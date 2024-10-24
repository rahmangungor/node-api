import sql, { ConnectionPool } from "mssql";

const config = {
  user: process.env.DB_USER || "",
  password: process.env.DB_PASS || "",
  server: process.env.DB_SERVER || "",
  database: process.env.DB_NAME || "",
  options: {
    encrypt: true, // For Azure SQL
    trustServerCertificate: true, // For local dev
  },
};

let poolPromise: Promise<ConnectionPool> | null = null;

export const getDbConnection = async (): Promise<ConnectionPool> => {
  if (!poolPromise) {
    if (
      !config.user ||
      !config.password ||
      !config.server ||
      !config.database
    ) {
      throw new Error("Database configuration is incomplete.");
    }

    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        console.log("Connected to MSSQL");
        return pool;
      })
      .catch((err) => {
        console.error("Database Connection Failed:", err);
        throw new Error("Database Connection Failed");
      });
  }
  return poolPromise;
};
