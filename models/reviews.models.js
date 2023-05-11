const db = require("../db/connection");
const { checkReviewIdExists } = require("../db/seeds/utils");

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

exports.createComments = (newComment, review_id) => {
  const { username, body } = newComment;

  const newCommentQuery = `
INSERT INTO comments
(body, author, review_id)
VALUES
($1, $2, $3)
returning*;
`;

  if (
    Object.keys(newComment).length !== 2 ||
    typeof username !== "string" ||
    typeof body !== "string"
  ) {
    return Promise.reject({ status: 400, msg: "bad request!" });
  }

  return checkReviewIdExists(review_id).then(() => {
    return db
      .query(newCommentQuery, [body, username, review_id])
      .then((response) => {
        return response.rows[0];
      });
  });
};
