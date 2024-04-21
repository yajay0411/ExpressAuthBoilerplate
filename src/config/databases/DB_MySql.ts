//database connection :
import mysql from "mysql";
import { configuration } from "../Config";

const connectMySqlDB = async () => {
  try {
    const mysqlConnection = mysql.createConnection({
      host: configuration.mysql_db_host,
      port: parseInt(configuration.mysql_db_port as string),
      user: configuration.mysql_db_user,
      password: configuration.mysql_db_password,
      database: configuration.mysql_db_name,
    });

    mysqlConnection.connect((err) => {
      if (err) {
        console.log(`ERROR:${err}`);
      } else {
        console.log("Connected to database successfully");
      }
    });
  } catch (err) {
    console.error("Failed to connect to database.", err);
    process.exit(1);
  }
};

export default connectMySqlDB;
