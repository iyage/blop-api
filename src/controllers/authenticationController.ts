import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Response, Request } from "express";
import { response, user } from "utils/interfaces/interfaces";
import myConn from "../utils/dbconnection";
import { Connection } from "promise-mysql";
import getUserByemail from "../utils/fetchUserByemail";
interface reqBody {
  email: string;
  password: string;
}

async function authenticate(req: Request, res: Response) {
  const apiResponse: response = {
    status: 400,
    data: null,
    message: "BadRequest",
  };
  const payload: reqBody = req.body;

  if (!payload) {
    apiResponse.message = "A valid payload is mandatory";
    return res.status(400).send(apiResponse);
  }
  if (!payload.email) {
    apiResponse.message = "A valid email is mandatory";
    return res.status(400).send(apiResponse);
  }
  if (!payload.password) {
    apiResponse.message = "A valid password is mandatory";
    return res.status(400).send(apiResponse);
  }
  let masterConnection: Connection = null;
  try {
    const con = new myConn();
    masterConnection = await con.mysqlConnection();

    const fetchedUser: user[] | undefined = await getUserByemail(
      masterConnection,
      payload.email
    );
    if (fetchedUser == undefined) {
      apiResponse.message = "Unknow Error has occur";
      apiResponse.status = 500;
      return res.status(500).send(apiResponse);
    }
    if (fetchedUser.length < 1) {
      apiResponse.message = `User with email ${payload.email} does not exist`;
      apiResponse.status = 401;
      return res.status(401).send(apiResponse);
    }
    const password: string = fetchedUser[0].password;
    const match: boolean = bcrypt.compareSync(payload.password, password);

    // bcrypt.compare(, password);
    if (!match) {
      apiResponse.message = `Invalid passwword`;
      apiResponse.data = null;
      apiResponse.status = 401;
      return res.status(401).send(apiResponse);
    }

    const filteredUser = {
      id: fetchedUser[0].id,
      email: fetchedUser[0].email,
    };
    const accessToken = jwt.sign(
      { userInfo: filteredUser },

      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "10m",
      }
    );
    apiResponse.data = filteredUser;
    apiResponse.message = "Successfully Login";
    apiResponse.status = 200;
    apiResponse.data = accessToken;
    return res.status(200).send(apiResponse);
  } catch (error) {
    console.log(error);
    apiResponse.message =
      "An unknown error has occured. Please try again latter";
    return res.status(500).send(apiResponse);
  } finally {
    console.log("closing mysql connection ....................");
    if (masterConnection && masterConnection.end) {
      console.log("mysql connection closed ....................");
      return masterConnection.destroy();
    }
  }
}

export default authenticate;
