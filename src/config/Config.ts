import { config } from "dotenv";
config();

const _config = {
  //mysql
  mysql_db_host: process.env.DB_HOST,
  mysql_db_user: process.env.DB_USERNAME,
  mysql_db_password: process.env.DB_PASSWORD,
  mysql_db_name: process.env.MYSQL_DB_NAME,
  mysql_db_port: process.env.MYSQL_DB_PORT,

  //mongo
  databaseMongoUrl: process.env.MONGO_CONNECTION_URL,

  //global project
  env: process.env.NODE_ENV,
  jwt_access_secret: process.env.JWT_SECRET_ACCESS_TOKEN,
  jwt_refresh_secret: process.env.JWT_SECRET_REFRESH_TOKEN,
  database_connected_to: process.env.DATABASE_CONNECT_TO,
  server_port: process.env.SERVER_PORT,
  project_name:process.env.PROJECT_NAME,

  frontendDomain: process.env.FRONTEND_DOMAIN,
};

export const configuration = Object.freeze(_config);
