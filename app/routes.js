const express = require("express");
const router = express.Router();
const { getCategories } = require("../controllers/categories.controllers");
const { getEndpoints } = require("../controllers/api.controllers");
const { getReview } = require("../controllers/review.controllers");
const {
  getReviews,
  postComments,
  getComments,
  incrementVotes,
} = require("../controllers/reviews.controllers");
const { deleteComment } = require("../controllers/comments.controllers");
const { getUsers } = require("../controllers/users.controllers");
