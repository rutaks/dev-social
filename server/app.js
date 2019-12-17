/** Imports */
import express from "express";
import env from "custom-env";
import Calculator from "./util/calculator";
import Response from "./util/response";

env.env();

/** Variable Definitions */
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

/** Routes */
app.get("/", (req, res) => Response.send201(res, "Welcome To Social Dev", {}));

app.post("/add", (req, res) => {
  const { num1, num2 } = req.body;
  const sum = Calculator.add(num1, num2);
  Response.send201(res, "success", { sum: sum });
});

/** Server */
app.listen(port, () =>
  console.log(`Dev Social is now running on Port: ${port}`)
);

export default app;
