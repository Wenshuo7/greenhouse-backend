import { Knex, knex } from "knex";

const config: Knex.Config = {
  client: "mysql",
  connection: {
    host: "localhost" /*change host if you need to*/,
    port: 3306 /*change port if you need to*/,
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "greenhouse",
  },
};

export const knexInstance = knex(config);
