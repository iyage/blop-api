import express from "express";
import bodyParser from "body-parser";
const publicRouter = express.Router();
const jsonParser = bodyParser.json({ limit: "8000mb" });
const urlparsor = bodyParser.urlencoded({ extended: true });

export default publicRouter;
