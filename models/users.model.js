const db = require("../db/connection");
const { checkFieldExists } = require("../app/utils");

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

exports.createUser = (newUser) => {
  const { username, password, name, avatar_url } = newUser;
  const newUserQuery = `
INSERT INTO users
(username, password, name, avatar_url)
VALUES
($1, $2, $3, $4)
returning*;
`;

  if (
    Object.keys(newUser).length !== 4 ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string" ||
    typeof avatar_url !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "bad request!" });
  }

  return db
    .query(newUserQuery, [username, password, name, avatar_url])
    .then((response) => {
      return response.rows[0];
    });
};
