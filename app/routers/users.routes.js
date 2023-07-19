const express = require("express");
const {
  getUsers,
  getUser,
  postUser,
} = require("../../controllers/users.controllers");
const usersRouter = express.Router();

usersRouter.route("").get(getUsers).post(postUser);

usersRouter.route("/:username").get(getUser);

module.exports = usersRouter;
