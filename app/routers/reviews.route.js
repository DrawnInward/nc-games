const reviewsRouter = require("express").Router();
const {
  getReviews,
  postComments,
  getComments,
  incrementVotes,
  getReview,
} = require("../../controllers/reviews.controllers");

reviewsRouter.route("/:review_id").get(getReview).patch(incrementVotes);

reviewsRouter.route("/:review_id/comments").post(postComments).get(getComments);

reviewsRouter.route("").get(getReviews);

module.exports = reviewsRouter;
