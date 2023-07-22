const db = require("../db/connection");
const { checkFieldExists, hashPassword } = require("../app/utils");
const bcrypt = require("bcrypt");

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

  return checkFieldExists("users", "username", user)
    .then(() => {
      return db.query(userQuery, [user]).then((response) => {
        return response.rows[0];
      });
    })
    .catch((err) => {
      return Promise.reject({
        status: 500,
        msg: "Failed to select user",
        error: err,
      });
    });
};

exports.createUser = (newUser) => {
  let { username, password, name, avatar_url } = newUser;
  const newUserQuery = `
    INSERT INTO users
    (username, password, name, avatar_url)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *;
  `;

  if (
    Object.keys(newUser).length !== 4 ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string" ||
    typeof avatar_url !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }

  password = hashPassword(password);

  return db
    .query(newUserQuery, [username, password, name, avatar_url])
    .then((response) => {
      return response.rows[0];
    })
    .catch((err) => {
      return Promise.reject({
        status: 500,
        msg: "Failed to create user",
        error: err,
      });
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

  return db
    .query(updateUserQuery, [...values, username])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      return Promise.reject({
        status: 500,
        msg: "Failed to update user",
        error: err,
      });
    });
};

exports.removeUser = (username) => {
  const deleteUserQuery = `
    DELETE FROM users
    WHERE username = $1;
  `;

  return checkFieldExists("users", "username", username)
    .then(() => {
      return db.query(deleteUserQuery, [username]);
    })
    .catch((err) => {
      return Promise.reject({
        status: 500,
        msg: "Failed to delete user",
        error: err,
      });
    });
};

exports.authenticateUser = async (body) => {
  const { username, password } = body;

  const userQuery = `SELECT * FROM users 
  WHERE username = $1;`;

  try {
    await checkFieldExists("users", "username", username);

    const response = await db.query(userQuery, [username]);
    const passwordMatch = await bcrypt.compare(
      password,
      response.rows[0].password
    );

    if (!passwordMatch) {
      return Promise.reject({ status: 400, msg: "Password incorrect" });
    }

    return response.rows[0];
  } catch (err) {
    return Promise.reject({
      status: 500,
      msg: "Failed to authenticate user",
      error: err,
    });
  }
};
