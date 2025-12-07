// import pkg from "pg";
// import dotenv from "dotenv";

// // dotenv.config();

// const { Pool } = pkg;

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "TRAX",
//   password: "new_password",
//   port: 5432,
// });

//export default pool;

// import pkg from "pg";
// import dotenv from "dotenv";

// dotenv.config();
// const { Pool } = pkg;
// // console.log(process.env);
// const pool = process.env.DATABASE_URL
//   ? new Pool({
//       connectionString: process.env.DATABASE_URL,
//       ssl: { rejectUnauthorized: true },
//     })
//   : new Pool({
//       user: process.env.DB_USER,
//       host: process.env.DB_HOST,
//       database: process.env.DB_NAME,
//       password: process.env.DB_PASSWORD,
//       port: process.env.DB_PORT,
//     });

// export default pool;
//------------------------------------------

import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { require: true },
    })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

export default pool;
