import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { response, user } from "../utils/interfaces/interfaces";
import myConn from "../utils/dbconnection";
import getUserByemail from "../utils/fetchUserByemail";
async function registerNewUser(req: Request, res: Response) {
  //validatePayLoad
  const apiResponse: response = {
    status: 400,
    data: null,
    message: "BadRequest",
  };
  interface reqBody {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }
  const payload: reqBody = req.body;
  console.log(payload);
  if (!payload) {
    apiResponse.message = "A valid payload is mandatory";
    return res.status(400).send(apiResponse);
  }
  if (!payload.password) {
    apiResponse.message = "A valid password is mandatory";
    return res.status(400).send(apiResponse);
  }
  if (!payload.email) {
    apiResponse.message = "A valid email is mandatory";
    return res.status(400).send(apiResponse);
  }

  if (!payload.firstName) {
    apiResponse.message = "User FirstName is mandatory";
    return res.status(400).send(apiResponse);
  }
  if (!payload.lastName) {
    apiResponse.message = "User LastName is mandatory";
    return res.status(400).send(apiResponse);
  }
  let masterConnection = null;
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
    if (fetchedUser.length > 0) {
      apiResponse.message = `User with email ${payload.email} already exist`;
      apiResponse.status = 400;
      return res.status(400).send(apiResponse);
    }

    const salt = bcrypt.genSaltSync(10);
    let hashPassword: string = bcrypt.hashSync(payload.password, salt);
    const query =
      "INSERT INTO blogDB.users(password,email,firstName,lastName)  VALUES(?,?,?,?)";
    const param = [
      hashPassword,
      payload.email,
      payload.firstName,
      payload.lastName,
    ];
    const insertionResult = await masterConnection.query(query, param);
    if (insertionResult.affectedRows < 1) {
      apiResponse.message = "Record Not Save";
      apiResponse.status = 400;
      return res.status(400).send(apiResponse);
    }
    apiResponse.status = 201;
    apiResponse.message = "User Created Successfully";
    apiResponse.data = null;
    return res.status(201).send(apiResponse);
  } catch (error) {
    console.log(error);
    return res.status(500).send("internal server error");
  } finally {
    console.log("closing mysql connection ....................");
    if (masterConnection && masterConnection.end) {
      console.log("mysql connection closed ....................");
      return masterConnection.destroy();
    }
  }
}
export default registerNewUser;
