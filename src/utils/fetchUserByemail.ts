import { Connection } from "promise-mysql";
import { user } from "./interfaces/interfaces";

async function getUserByemail(con: Connection, email: string): Promise<user[]> {
  console.log(
    `Fetching user with email ${email}.....................................`
  );
  if (!email) return undefined;
  try {
    let query = "SELECT * FROM blogDB.users where email = ?";
    let param = [email.toLowerCase()];
    const row: user[] = await con.query(query, param);
    return row;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}
export default getUserByemail;
