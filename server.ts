import app from "./src/app";
import { configuration } from "./src/config/Config";
import connectMongoDB from "./src/config/databases/DB_Mongo";
import connectMySqlDB from "./src/config/databases/DB_MySql";

const startServer = async () => {
  // Connect database
  if (configuration.database_connected_to === "MONGODB") {
    await connectMongoDB();
  }

  if (configuration.database_connected_to === "MYSQLDB") {
    await connectMySqlDB();
  }

  const port = configuration.server_port || 3000;

  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};

startServer();
