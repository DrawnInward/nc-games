const { selectReview } = require("../models/review.models");

exports.getReview = (req, res, next) => {
  const { review_id } = req.params;
  selectReview(review_id)
    .then((review) => {
      res.status(200).send({ review: review });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
