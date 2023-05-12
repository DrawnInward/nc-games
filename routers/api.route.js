const { getEndpoints } = require("../controllers/api.controllers");
const reviewsRouter = require("./reviews.route");
const userRouter = require("./users.routes");
const commentsRouter = require("./comments.route");
const categoriesRouter = require("./categories.route");
const apiRouter = require("express").Router();

apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
