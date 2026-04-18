import { MongoClient } from "mongodb";

const Mongo = {
  async connect({ mongoConnectionString, mongoDbName }) {
    try {
      const client = new MongoClient(mongoConnectionString);

      await client.connect();
      const db = client.db(mongoDbName);

      this.client = client;
      this.db = db;

      console.log("\nConnect to MongoDB!\n");

      return 0;
    } catch (error) {
      console.log("\nError to connect MongoDB!\n");
      console.error(error.message);

      return 1;
    }
  },
};

export default Mongo;
