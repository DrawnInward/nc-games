const { checkFieldExists } = require("../app/utils");
const db = require("../db/connection");

exports.selectVotes = (user) => {
  const voteQuery = `SELECT * FROM votes 
  WHERE username = $1;`;

  return checkFieldExists("votes", "username", user).then(() => {
    return db.query(voteQuery, [user]).then((response) => {
      return response.rows;
    });
  });
};

exports.createVote = (newVote) => {
  const { username, vote_direction } = newVote;

  const columnName = newVote.comment_id ? "comment_id" : "review_id";
  const newVoteQuery = `
    INSERT INTO votes
    (username, vote_direction, ${columnName})
    VALUES
    ($1, $2, $3)
    RETURNING *;
  `;

  if (
    Object.keys(newVote).length !== 3 ||
    typeof username !== "string" ||
    typeof vote_direction !== "number" ||
    typeof newVote[columnName] !== "number"
  ) {
    return Promise.reject({ status: 400, msg: "Bad request!" });
  }

  return db
    .query(newVoteQuery, [username, vote_direction, newVote[columnName]])
    .then((response) => {
      return response.rows[0];
    });
};

exports.updateVotes = (vote) => {
  const columnName = vote.comment_id ? "comment_id" : "review_id";
  const { username, vote_direction } = vote;

  const changeVotesQuery = `
    UPDATE votes
    SET vote_direction = vote_direction + $1
    WHERE ${columnName} = $2 AND username = $3
    returning*
    `;

  if (Object.keys(vote).length !== 3 || typeof vote[columnName] !== "number") {
    return Promise.reject({ status: 400, msg: "bad request!" });
  }

  return checkFieldExists("votes", columnName, vote[columnName]).then(() => {
    return db
      .query(changeVotesQuery, [vote_direction, vote[columnName], username])
      .then((result) => {
        return result.rows[0];
      });
  });
};
