import express, { Request, Response } from "express";
import publicRouter from "./routes/publicRoute";
import serverless from "serverless-http";
import verifyJwt from "./middleware/verifyJwt";
import privateRouter from "./routes/privateRoutes";
require("dotenv").config();
const app = express();

app.use(express.json());

app.use("/", publicRouter);
app.use(verifyJwt);
app.use("/", privateRouter);
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404).send();
  }
);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(err.status || 500).send();
  }
);
if (process.env.NODE_ENV !== "dev") {
  console.log(process.env.NODE_ENV);
  exports.handler = serverless(app);
} else {
  console.log(process.env.NODE_ENV);
  app.listen(3000, () => {
    console.log(`Server is listening on port ${3000}.`);
  });
}
