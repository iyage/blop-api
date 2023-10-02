import express from "express";
import bodyParser from "body-parser";
import { updateUser, closeAccount } from "../controllers/userUpdateController";
const privateRouter = express.Router();
const jsonParser = bodyParser.json();

privateRouter.put("/api/v1/updateProfile", jsonParser, updateUser);
privateRouter.delete("/api/v1/closeAccount", closeAccount);

export default privateRouter;
