const db = require("../db/connection");
const { checkFieldExists } = require("../db/seeds/utils");

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

exports.selectUser = (user) => {
  const userQuery = `SELECT * FROM users 
  WHERE username = $1;`;

  return checkFieldExists("users", "username", user).then(() => {
    return db.query(userQuery, [user]).then((response) => {
      return response.rows[0];
    });
  });
};
