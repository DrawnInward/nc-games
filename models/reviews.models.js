const db = require("../db/connection");

exports.selectReviews = () => {
  const query = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.comment_id) comment_count
  FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer
  ORDER BY created_at DESC;`;
  return db
    .query(query)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      return Promise.reject({
        status: 500,
        msg: "failed to select reviews",
      });
    });
};

exports.selectComments = (id) => {
  const reviewQuery = `
    SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC`;

  return db.query(reviewQuery, [id]).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "review not found" });
    }
    return result.rows;
  });
};
