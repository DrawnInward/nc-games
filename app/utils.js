const db = require("../db/connection");

exports.checkFieldExists = (table, column, id) => {
  return db
    .query(
      `SELECT * from ${table}
        WHERE ${column} = $1;`,
      [id]
    )
    .then((result) => {
      if (result.rows.length === 0 && id) {
        return Promise.reject({ status: 404, msg: "invalid field entered" });
      }
    });
};
