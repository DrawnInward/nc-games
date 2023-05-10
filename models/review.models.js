const db = require("../db/connection");

exports.selectReview = (id) => {
  const reviewQuery = `
    SELECT * FROM reviews
    WHERE review_id = $1`;

  return db.query(reviewQuery, [id]).then((result) => {
    if (result.rows.length === 0) {
      console.log(result.rows.length);
      return Promise.reject({ status: 404, msg: "review not found" });
    }
    return result.rows[0];
  });
};
