const { selectReviews, createComments } = require("../models/reviews.models");

exports.getReviews = (req, res) => {
  selectReviews().then((reviews) => {
    res.status(200).send({ reviews: reviews });
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
