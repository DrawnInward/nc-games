const { selectEndpoint } = require("../models/api.models");

exports.getEndpoints = (req, res, next) => {
  selectEndpoint()
    .then((file) => {
      res.status(200).send(file);
    })
    .catch((err) => {
      next(err);
    });
};
