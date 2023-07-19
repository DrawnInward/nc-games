const {
  selectUsers,
  selectUser,
  createUser,
  updateUser,
  removeUser,
  authenticateUser,
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

exports.deleteUser = (req, res, next) => {
  const { username } = req.params;
  removeUser(username)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.validateUser = async (req, res, next) => {
  const { body } = req;
  try {
    const user = await authenticateUser(body);
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};