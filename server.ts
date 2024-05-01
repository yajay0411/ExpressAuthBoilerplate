import app from "./src/app";
import { configuration } from "./src/config/Config";
import connectMongoDB from "./src/config/databases/DB_Mongo";

const startServer = async () => {
  const port = configuration.server_port || 3000;

  // Connect database
  await connectMongoDB();
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};

startServer();
