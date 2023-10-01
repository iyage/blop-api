import mysql from "promise-mysql";

class myConn {
  private host: string;
  private user: string;
  private database: string;
  private password: string;
  private multipleStatements: boolean;

  public constructor() {
    this.host = "database-demo.cojvxmpgbdr4.us-east-1.rds.amazonaws.com";
    this.user = "admin";
    this.password = "oSD2vEtkUbvIW9Bvyfkb";
    this.database = "blogDB";
    this.multipleStatements = true;
  }

  public async mysqlConnection() {
    return await mysql.createConnection({
      host: this.host,
      user: this.user,
      database: this.database,
      password: this.password,
      multipleStatements: this.multipleStatements,
    });
  }
}

export default myConn;
