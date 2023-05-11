const express = require("express");
const { getCategories } = require("../controllers/categories.controllers");
const { getEndpoints } = require("../controllers/api.controllers");
const { getReview } = require("../controllers/review.controllers");
const {
  getReviews,
  incrementVotes,
} = require("../controllers/reviews.controllers");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api", getEndpoints);
app.get("/api/reviews/:review_id", getReview);
app.get("/api/reviews", getReviews);
app.patch("/api/reviews/:review_id", incrementVotes);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request!" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "server error!" });
});

module.exports = app;
