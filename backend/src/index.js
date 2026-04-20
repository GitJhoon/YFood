import cors from "cors";
import express from "express";
import Client from "./database/mongodb.js";
import { config } from "dotenv";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import platesRouter from "./routes/plates.js";
import ordersRouter from "./routes/orders.js";

config();

async function main() {
  const hostname = "localhost";
  const port = 3000;

  const app = express();
  
  const mongoConnection = await Client.connect({
    mongoConnectionString: process.env.MONGO_CS,
    mongoDbName: process.env.MONGO_DB_NAME,
  });

  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.send({
      sucess: true,
      statusCode: 200,
      body: "Welcome to Yfood",
    });
  });

  app.use("/auth", authRouter);

  app.use("/users", usersRouter);

  app.use("/plates", platesRouter);

  app.use("/orders", ordersRouter);

  app.listen(port, () => {
    console.log(`\nServer is running on: http://${hostname}:${port}\n`);
  });
}

main();
