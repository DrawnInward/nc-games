const {
  removeComment,
  changeCommentVotes,
} = require("../models/comments.models");

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.incrementCommentVotes = (req, res, next) => {
  const votes = req.body;
  const { comment_id } = req.params;
  changeCommentVotes(votes, comment_id)
    .then((result) => {
      res.status(200).send({ comment: result });
    })
    .catch((err) => {
      next(err);
    });
};
