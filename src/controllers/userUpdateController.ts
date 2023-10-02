import { Response, Request } from "express";
import { response, user } from "../utils/interfaces/interfaces";
import myConn from "../utils/dbconnection";
import { Connection } from "promise-mysql";

interface reqDto {
  email?: string;
  firstName?: string;
  lastName?: string;
}

export async function updateUser(req: Request, res: Response) {
  const apiResponse: response = {
    status: 400,
    data: null,
    message: "BadRequest",
  };
  const loginUser: user = req.user;
  const payload: reqDto = req.body;
  console.log(loginUser);
  let masterConnection: Connection = null;
  try {
    const con = new myConn();
    masterConnection = await con.mysqlConnection();
    const firstName: string | undefined =
      payload.firstName || loginUser.firstName;
    const lastName: string | undefined = payload.lastName || loginUser.lastName;
    const email: string | undefined = payload.email || loginUser.email;
    console.log(firstName + " " + lastName);
    let query: string =
      "UPDATE  blogDB.users SET firstName=?,lastName=?,email=? where id =?";
    const param = [firstName, lastName, email, loginUser.id];
    const row = await masterConnection.query(query, param);

    if (row.affectedRows < 1) {
      apiResponse.message = "User profile not updated";
      return res.status(500).send(apiResponse);
    }
    const id: number = loginUser.id;
    const updatedUser: user = {
      firstName,
      lastName,
      email,
      id,
    };

    apiResponse.message = "profile updated successfully";
    apiResponse.status = 200;
    apiResponse.data = updatedUser;
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
export async function closeAccount(req: Request, res: Response) {
  const apiResponse: response = {
    status: 400,
    data: null,
    message: "BadRequest",
  };
  const loginUser: user = req.user;
  let masterConnection: Connection = null;
  try {
    const con = new myConn();
    masterConnection = await con.mysqlConnection();
    let query: string = "DELETE FROM  blogDB.users  where id =?";
    const param = [loginUser.id];
    await masterConnection.query(query, param);

    apiResponse.message = "user successfully deleted";
    apiResponse.status = 200;
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
