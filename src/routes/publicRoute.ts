import express from "express";
import bodyParser from "body-parser";
import registerNewUser from "../controllers/registrationController";
import authenticate from "../controllers/authenticationController";
const publicRouter = express.Router();
const jsonParser = bodyParser.json({ limit: "8000mb" });
const urlparsor = bodyParser.urlencoded({ extended: true });

publicRouter.post("/api/v1/register_new_user", jsonParser, registerNewUser);
publicRouter.post("/api/v1/authenticate", jsonParser, authenticate);

export default publicRouter;
