const {
  selectVotes,
  createVote,
  updateVotes,
} = require("../models/votes.models");

exports.getVotes = (req, res, next) => {
  const { username } = req.params;
  selectVotes(username)
    .then((user) => {
      res.status(200).send({ votes: user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postVote = (req, res, next) => {
  const newVote = req.body;
  createVote(newVote)
    .then((response) => {
      res.status(201).send({ newVote: response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVote = (req, res, next) => {
  const vote = req.body;
  updateVotes(vote)
    .then((result) => {
      res.status(200).send({ updatedVote: result });
    })
    .catch((err) => {
      next(err);
    });
};
