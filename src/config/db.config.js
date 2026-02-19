import mysql from "mysql2/promise";

const connectDb = () => {
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    ssl: {
      rejectUnauthorized: false,
    },
    timezone: "asia/jakarta",
    connectionLimit: true,
    queueLimit: 10,
  });

  return db;
};

export default connectDb;
