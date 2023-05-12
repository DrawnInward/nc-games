const db = require("../db/connection");

exports.selectUsers = () => {
  const userQuery = "SELECT * FROM users;";
  return db
    .query(userQuery)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      return Promise.reject({
        status: 500,
        msg: "failed to select users",
      });
    });
};
