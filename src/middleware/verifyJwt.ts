import jwt from "jsonwebtoken";
import { Response, Request, NextFunction, Express } from "express";
import { response, user } from "utils/interfaces/interfaces";

declare global {
  namespace Express {
    interface Request {
      user: user;
    }
  }
}

const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader: any =
    req.headers["authorization"] || req.headers["Authorization"];
  const apiResponse: response = {
    status: 400,
    data: null,
    message: "Unauthorized",
  };
  if (!authHeader?.startsWith("Bearer ")) {
    apiResponse.status = 401;
    return res.status(401).send(apiResponse);
  }
  const token: string = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded: any) => {
    if (err) {
      apiResponse.message = "Forbideen invalid token";
      return res.status(403).send(apiResponse);
    }
    req.user = decoded.userInfo;
    next();
  });
};

export default verifyJwt;
