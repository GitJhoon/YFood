import Client from "../database/mongodb.js";
import { successResponse, errorResponse, notFoundResponse } from "../helpers/httpResponse.js";
import { ObjectId } from "mongodb";

class platesController {
    constructor(){
        this.collectionName = "plates";
    }

    async getPlates(){
        try{
            const plates = await Client.db.collection(this.collectionName).find().toArray();
            
            return successResponse(plates);
        }catch(error){
            return errorResponse(error);
        }
    }

    async deletePlate(id){
        try{
            const deletedPlate = await Client.db.collection(this.collectionName)
            .findOneAndDelete({ _id: new ObjectId(id)});

            return successResponse(deletedPlate);
        }catch(error){
            return errorResponse(error)
        }
    }

    async updatePlate(id, plateData){
        try{
            const updatedPlate = await Client.db.collection(this.collectionName)
            .findOneAndUpdate({_id: new ObjectId(id)}, {$set: plateData});

            return successResponse(updatedPlate);
        }catch(error){
            return errorResponse(error);
        }
    }

    async getAvailablePlates(){
        try{
            const platesAvailable = await Client.db.collection(this.collectionName).find({ available: true}).toArray();

            return successResponse(platesAvailable);
        }catch(error){
            return errorResponse(error);
        }
    }

    async addPlates(plateData){
        try{
            const newPlate = await Client.db.collection(this.collectionName).insertOne(plateData);

            return successResponse(newPlate);
        }catch(error){
            return errorResponse(error);
        }
    }
};

export default platesController;
