const {
  selectUsers,
  selectUser,
  createUser,
  updateUser,
} = require("../models/users.model");

exports.getUsers = (req, res) => {
  selectUsers().then((users) => {
    res.status(200).send({ users: users });
  });
};

exports.getUser = (req, res, next) => {
  const { username } = req.params;
  selectUser(username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postUser = (req, res, next) => {
  const newUser = req.body;
  createUser(newUser)
    .then((response) => {
      res.status(201).send({ newUser: response });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchUser = (req, res, next) => {
  const fields = req.body;
  const { username } = req.params;
  updateUser(fields, username)
    .then((result) => {
      res.status(200).send({ updatedUser: result });
    })
    .catch((err) => {
      next(err);
    });
};
