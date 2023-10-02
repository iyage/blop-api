import { Response, Request } from "express";
import { post, response } from "../utils/interfaces/interfaces";
import myConn from "../utils/dbconnection";
import { Connection } from "promise-mysql";

async function fetchallPosts(req: Request, res: Response) {
  const apiResponse: response = {
    status: 400,
    data: null,
    message: "BadRequest",
  };

  let masterConnection: Connection = null;
  try {
    const con = new myConn();
    masterConnection = await con.mysqlConnection();

    let query: string = "SELECT * FROM blogDB.posts";
    const row: post[] = await masterConnection.query(query);
    apiResponse.message = "All post fetched successfully";
    apiResponse.status = 200;
    apiResponse.data = row;
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

export default fetchallPosts;
