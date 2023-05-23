const db = require("../db/connection");
const { checkFieldExists } = require("../app/utils");

exports.removeComment = (id) => {
  const deleteCommentQuery = `
DELETE FROM comments
WHERE comment_id = $1;
`;
  return checkFieldExists("comments", "comment_id", id).then(() => {
    return db.query(deleteCommentQuery, [id]);
  });
};

exports.changeCommentVotes = (votes, id) => {
  const { inc_votes } = votes;
  const changeVotesQuery = `
  UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  returning*
  `;

  if (Object.keys(votes).length !== 1 || typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "bad request!" });
  }

  return checkFieldExists("comments", "comment_id", id).then(() => {
    return db.query(changeVotesQuery, [inc_votes, id]).then((result) => {
      return result.rows[0];
    });
  });
};
