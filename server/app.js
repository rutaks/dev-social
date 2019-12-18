/* istanbul ignore next */
/** Imports */
import express from "express";
import env from "custom-env";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import Response from "./util/response";
import api from "./routes/api.route";
import connect from "./config/db";
import response from "./util/response";
import logger from "morgan";

env.env();

/** Variable Definitions */
const app = express();
const port = process.env.PORT;

/** Middleware Config */
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/** Routes */
/**
 * Route serving Welcome Response
 * @name /
 * @function
 * @param {string} path - Express path
 */
app.get("/", (req, res) => Response.send201(res, "Welcome To Social Dev", {}));

/**
 * Route serving API Routes
 * @name /api/v1
 * @function
 * @param {string} path - Express path
 */
app.use("/api/v1", api);

/** Error Handling */
app.use((error, req, res, next) => {
  res.send404(res, error.message);
});

/** Server */
const runServer = async () => {
  try {
    await connect();
    app.listen(port, () =>
      console.debug("INFO:", `Dev Social is now running on Port: ${port}`)
    );
  } catch (error) {
    throw error;
  }
};

runServer();

export default app;
