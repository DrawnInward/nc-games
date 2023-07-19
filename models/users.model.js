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

exports.updateUser = (fields, username) => {
  const greenList = ["username", "password", "name", "avatar_url"];

  const invalidFields = Object.keys(fields).filter(
    (field) => !greenList.includes(field) || typeof fields[field] !== "string"
  );

  if (invalidFields.length > 0) {
    return Promise.reject({ status: 400, msg: "Bad request! Invalid fields." });
  }

  const setClause = Object.keys(fields)
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");

  const values = Object.values(fields);

  const updateUserQuery = `
    UPDATE users
    SET ${setClause}
    WHERE username = $${values.length + 1}
    RETURNING *
  `;

  return db.query(updateUserQuery, [...values, username]).then((result) => {
    return result.rows[0];
  });
};

exports.removeUser = (username) => {
  const deleteUserQuery = `
DELETE FROM users
WHERE username = $1;
`;
  return checkFieldExists("users", "username", username).then(() => {
    return db.query(deleteUserQuery, [username]);
  });
};
