import { Knex, knex } from "knex";

const config: Knex.Config = {
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    port: 3306 ,
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "greenhouse",
  },
};

export const knexInstance = knex(config);
