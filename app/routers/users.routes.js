const express = require("express");
const {
  getUsers,
  getUser,
  postUser,
  patchUser,
  deleteUser,
} = require("../../controllers/users.controllers");
const usersRouter = express.Router();

usersRouter.route("").get(getUsers).post(postUser);

usersRouter
  .route("/:username")
  .get(getUser)
  .patch(patchUser)
  .delete(deleteUser);

module.exports = usersRouter;
