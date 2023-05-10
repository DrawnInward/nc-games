const db = require("../db/connection");

exports.selectCategories = () => {
  const query = `SELECT * FROM categories;`;
  return db
    .query(query)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      return Promise.reject({
        status: 500,
        msg: "failed to select catergories",
      });
    });
};
