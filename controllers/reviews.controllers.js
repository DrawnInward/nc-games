const {
  selectReviews,
  createComments,
  selectComments,
  changeVotes,
} = require("../models/reviews.models");

exports.getReviews = (req, res) => {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews: reviews });
  });
};

exports.incrementVotes = (req, res, next) => {
  const votes = req.body;
  const { review_id } = req.params;
  changeVotes(votes, review_id)
    .then((result) => {
      res.status(200).send({ review: result });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComments = (req, res, next) => {
  const newComment = req.body;
  const { review_id } = req.params;
  createComments(newComment, review_id)
    .then((response) => {
      res.status(201).send({ comment: response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  const { review_id } = req.params;
  selectComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
};
