const express = require("express");
const { getUsers, getUser } = require("../controllers/users.controllers");
const userRouter = express.Router();

userRouter.route("").get(getUsers);
userRouter.route("/:username").get(getUser);

module.exports = userRouter;
