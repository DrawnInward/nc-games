const { selectReviews, changeVotes } = require("../models/reviews.models");

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
