const db = require("../db/connection");
const bcrypt = require("bcrypt");

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

exports.hashPasswords = (arr) => {
  const saltRounds = 10;

  const hashedArr = arr.map((user) => {
    const hashedPassword = bcrypt.hashSync(user.password, saltRounds);
    return { ...user, password: hashedPassword };
  });
  return hashedArr;
};

exports.hashPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

exports.addPasswordToUsers = (arr) => {
  const updatedUsers = arr.map((user) => {
    user.password = "Password";
    return user;
  });
  return updatedUsers;
};
