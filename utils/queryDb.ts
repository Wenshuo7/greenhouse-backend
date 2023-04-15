import { connection } from "../db";

export function queryDb(query: string, options?: any[]): Promise<any[]> {
  return new Promise((resolve, reject) => {
    connection.query(query, options, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
