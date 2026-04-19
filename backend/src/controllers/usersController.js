import Client from "../database/mongodb.js";
import { successResponse, errorResponse, notFoundResponse } from "../helpers/httpResponse.js";
import { ObjectId } from "mongodb";
import crypto from "crypto";

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

    async updateUser(id, userData){
        try{
            if(userData.password){
                const salt = crypto.randomBytes(16);

                crypto.pbkdf2(userData.password, salt, 31000, 16, "sha256", async (error, hashedPassword) => {
                    if(error){
                        throw error;
                    }
                    
                    userData = { ...userData, password: hashedPassword, salt: salt};
                });

            }
            const updatedUser = await Client.db.collection(this.collectionName)
            .findOneAndUpdate({_id: new ObjectId(id)}, {$set: userData});
            
            return successResponse(updatedUser);
        }catch(error){
            return errorResponse(error);
        }
    }

}