const express = require("express");
const { getVotes, postVote } = require("../../controllers/votes.controllers");
const votesRouter = express.Router();

votesRouter.route("").post(postVote);
votesRouter.route("/:username").get(getVotes);

module.exports = votesRouter;
