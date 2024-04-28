import app from "./src/app";
import { configuration } from "./src/config/Config";
import connectMongoDB from "./src/config/databases/DB_Mongo";
import sequelizeMysqlConnect from "./src/config/databases/DB_MySql";

const startServer = async () => {
  const port = configuration.server_port || 3000;

  // Connect database
  if (configuration.database_connected_to === "MONGODB") {
    await connectMongoDB();

    app.listen(port, () => {
      console.log(`Listening on port: ${port}`);
    });
  }

  if (configuration.database_connected_to === "MYSQLDB") {
    await sequelizeMysqlConnect();

    app.listen(port, () => {
      console.log(`Listening on port: ${port}`);
    });
  }
};

startServer();
