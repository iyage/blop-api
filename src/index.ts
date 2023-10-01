import express, { Request, Response } from "express";
import serverless from "serverless-http";

const app = express();

app.use(express.json());
app.use("/index", (req: Request, res: Response) => {
  res.send("working");
});
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
if (process.env.ENVIRONMENT === "production") {
  exports.handler = serverless(app);
} else {
  app.listen(3000, () => {
    console.log(`Server is listening on port ${3000}.`);
  });
}
