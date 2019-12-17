/** Imports */
import express from "express";
import env from "custom-env";

env.env();

/** Variable Definitions */
const app = express();
const port = process.env.PORT || 3000;

/** Routes */
app.get("/", (req, res) => res.send("Hey there Dev!"));

/** Server Run */
app.listen(port, () =>
  console.log(`Dev Social is now running on Port: ${port}`)
);
