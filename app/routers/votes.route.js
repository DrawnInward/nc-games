const express = require("express");
const {
  getVotes,
  postVote,
  patchVote,
} = require("../../controllers/votes.controllers");
const votesRouter = express.Router();

votesRouter.route("").post(postVote).patch(patchVote);
votesRouter.route("/:username").get(getVotes);

module.exports = votesRouter;
