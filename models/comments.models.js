const db = require("../db/connection");
const { checkIdExists } = require("../db/seeds/utils");

exports.removeComment = (id) => {
  const deleteCommentQuery = `
DELETE FROM comments
WHERE comment_id = $1;
`;

  return checkIdExists("comments", "comment_id", id).then(() => {
    return db.query(deleteCommentQuery, [id]);
  });
};
