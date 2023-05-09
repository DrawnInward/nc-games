const express = require("express");
const { getCategories } = require("../controllers/categories.controllers");

const app = express();

app.get("/api/categories", getCategories);

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ msg: err.msg } || { msg: "server error!" });
});

module.exports = app;
