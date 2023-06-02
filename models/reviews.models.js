const db = require("../db/connection");
const { checkFieldExists } = require("../app/utils");

exports.selectReviews = (category, sort_by = "created_at", order = "desc") => {
  const greenList = [
    "title",
    "designer",
    "owner",
    "category",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (!greenList.includes(sort_by))
    return Promise.reject({
      status: 400,
      msg: "invalid column",
    });

  const queryValues = [];

  let query = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.comment_id) comment_count
  FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
  `;

  if (category) {
    queryValues.push(category);
    query += ` WHERE category = $1`;
  }

  query += ` GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer
  `;

  query += ` ORDER BY ${sort_by}`;

  if (order === "desc") {
    query += ` DESC`;
  } else if (order === "asc") {
    query += ` ASC`;
  } else {
    return Promise.reject({
      status: 400,
      msg: "invalid order",
    });
  }

  query += ";";

  return checkFieldExists("categories", "slug", category).then(() => {
    return db.query(query, queryValues).then((result) => {
      return result.rows;
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

  return checkFieldExists("reviews", "review_id", review_id).then(() => {
    return db
      .query(newCommentQuery, [body, username, review_id])
      .then((response) => {
        return response.rows[0];
      });
  });
};

exports.selectComments = (id) => {
  const reviewQuery = `
    SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at DESC`;

  return checkFieldExists("reviews", "review_id", id).then(() => {
    return db.query(reviewQuery, [id]).then((result) => {
      return result.rows;
    });
  });
};

exports.changeVotes = (votes, id) => {
  const { inc_votes } = votes;
  const changeVotesQuery = `
  UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  returning*
  `;

  if (Object.keys(votes).length !== 1 || typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "bad request!" });
  }

  return checkFieldExists("reviews", "review_id", id).then(() => {
    return db.query(changeVotesQuery, [inc_votes, id]).then((result) => {
      return result.rows[0];
    });
  });
};

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
