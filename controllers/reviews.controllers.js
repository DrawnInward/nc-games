const {
  selectReviews,
  createComments,
  selectComments,
  changeVotes,
  selectReview,
} = require("../models/reviews.models");

exports.getReviews = (req, res, next) => {
  const { category, sort_by, order } = req.query;
  selectReviews(category, sort_by, order)
    .then((reviews) => {
      res.status(200).send({ reviews: reviews });
    })
    .catch((err) => {
      next(err);
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

exports.getReview = (req, res, next) => {
  const { review_id } = req.params;
  selectReview(review_id)
    .then((review) => {
      res.status(200).send({ review: review });
    })
    .catch((err) => {
      next(err);
    });
};
