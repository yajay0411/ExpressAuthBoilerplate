//database connection :
import { configuration } from "../Config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  configuration.mysql_db_name as string,
  configuration.mysql_db_user as string,
  configuration.mysql_db_password as string,
  {
    host: configuration.mysql_db_host as string,
    dialect: "mysql",
  }
);
export { sequelize };

const sequelizeMysqlConnect = async () => {
  sequelize
    // .authenticate()
    .sync({ force: false })
    .then(() => {
      console.log(
        `Connected to database successfully :: ${configuration.database_connected_to}`
      );
    })
    .catch((err) => {
      console.error("Failed to connect to database.", err?.original?.code);
      process.exit(1);
    });
};
export default sequelizeMysqlConnect;
