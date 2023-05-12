const { getCategories } = require("../controllers/categories.controllers");
const { getEndpoints } = require("../controllers/api.controllers");
const { getReviews } = require("../controllers/reviews.controllers");
const { deleteComment } = require("../controllers/comments.controllers");
const express = require("express");
const reviews = require("../routers/reviews.route");
const {
  invalidSqlInputError,
  handleCustomError,
  catchAllError,
} = require("../errorHandling");
const app = express();
app.use(express.json());

app.use("/api/reviews", reviews);

const userRouter = require("../routers/users.routes");

app.use("/api/users", userRouter);

app.get("/api/categories", getCategories);

app.get("/api", getEndpoints);
app.get("/api/categories", getCategories);
app.delete("/api/comments/:comment_id", deleteComment);

app.use(invalidSqlInputError);

app.use(handleCustomError);

app.use(catchAllError);

module.exports = app;
