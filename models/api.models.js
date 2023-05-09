const fs = require("fs/promises");

exports.selectEndpoint = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf8")
    .then((file) => {
      const endpoints = JSON.parse(file);
      return endpoints;
    })
    .catch((err) => {
      return Promise.reject({
        status: 500,
        msg: "failed to select catergories",
      });
    });
};
