const express = require("express");
const {
  invalidSqlInputError,
  handleCustomError,
  catchAllError,
} = require("./errorHandling");
const apiRouter = require("./routers/api.route");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.use(invalidSqlInputError);
app.use(handleCustomError);
app.use(catchAllError);

module.exports = app;
