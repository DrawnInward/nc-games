const db = require("../db/connection");
const { checkFieldExists } = require("../db/seeds/utils");

exports.selectReview = (id) => {
  const reviewQuery = `
  SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, review_body, COUNT(comments.comment_id) comment_count
  FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, review_body;`;

  return checkFieldExists("reviews", "review_id", id).then(() => {
    return db.query(reviewQuery, [id]).then((result) => {
      return result.rows[0];
    });
  });
};
