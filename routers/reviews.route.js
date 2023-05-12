const express = require("express");
const {
  getReviews,
  postComments,
  getComments,
  incrementVotes,
  getReview,
} = require("../controllers/reviews.controllers");
const router = express.Router();

router.route("/:review_id").get(getReview).patch(incrementVotes);

router.route("/:review_id/comments").post(postComments).get(getComments);

router.route("").get(getReviews);

module.exports = router;
