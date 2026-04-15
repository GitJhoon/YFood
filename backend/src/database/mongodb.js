import { MongoClient } from 'mongodb';

export const Mongo = {
	async connect({mongoConnectionString, mongoDbName}){
		
		try{
			const client = new MongoClient(mongoConnectionString);
			
			await client.connect();
			const db = client.db(mongoDbName);
			
			this.client = client;
			this.db = db;

			console.log("Connect to MongoDB!");

			return 0;
		
		} catch(error) {
			console.log("Error to connect MongoDB!");
			console.error(error.message);

			return 1;
		}
	}
};

