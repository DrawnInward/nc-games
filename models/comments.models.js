const db = require("../db/connection");
const { checkFieldExists } = require("../db/seeds/utils");

exports.removeComment = (id) => {
  const deleteCommentQuery = `
DELETE FROM comments
WHERE comment_id = $1;
`;

  return checkFieldExists("comments", "comment_id", id).then(() => {
    return db.query(deleteCommentQuery, [id]);
  });
};
