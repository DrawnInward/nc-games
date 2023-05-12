const fs = require("fs/promises");

exports.selectEndpoint = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`, "utf8").then((file) => {
    const endpoints = JSON.parse(file);
    return endpoints;
  });
};
