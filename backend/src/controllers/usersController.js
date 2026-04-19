import Client from "../database/mongodb.js";
import { successResponse, errorResponse, notFoundResponse } from "../helpers/httpResponse.js";
import { ObjectId } from "mongodb";

export default class  usersController {
    constructor(){
        this.collectionName = "users";
    }

    async getUsers(){
        try{
            const users = await Client.db.collection(this.collectionName).find().toArray();

            return successResponse(users);
        }catch(error){
            return errorResponse(error);
        }
    }

    async deleteUser(id){
        try{
            const deletedUser = await Client.db.collection(this.collectionName).findOneAndDelete({ _id: new ObjectId(id)});

            return successResponse(deletedUser);
        }catch(error){
            return errorResponse(error);
        }
    }

    async updateUser(id, dataUser){
        try{
            const updatedUser = await Client.db.collection(this.collectionName)
            .findOneAndUpdate({_id: new ObjectId(id)}, {$set: dataUser});
            
            return successResponse(updatedUser);
        }catch(error){
            return errorResponse(error);
        }
    }


}