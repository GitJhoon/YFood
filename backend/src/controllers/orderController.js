import Client from "../database/mongodb.js";
import { ObjectId } from "mongodb";
import { errorResponse, successResponse } from "../helpers/httpResponse.js";

class orderController {
    constructor(){
        this.collectionName = "orders";
    }

    async getOrders(){
        try{
            const orders = await Client.db.collection(this.collectionName)
            .aggregate([
                {
                    $lookup:{
                        from: "orderItems",
                        localField: "_id",
                        foreignField: "orderId",
                        as: "orderItems"
                    }
                },
                {
                    $lookup:{
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $project: {
                        "userDetails.password": 0,
                        "userDetails.salt": 0
                    }
                },
                {
                    $unwind:"$orderItems"
                },
                {
                    $lookup:{
                        from: "plates",
                        localField: "orderItems.plateId",
                        foreignField: "_id",
                        as: "orderItems.itemDetails"
                    }
                }
            ]).toArray();

            return successResponse(orders);
        }catch(error){
            return errorResponse(error);
        }
    }

    async deleteOrder(id){
        try{
            const deletedOrder = await Client.db.collection(this.collectionName).findOneAndDelete({ _id: new ObjectId(id)});

            return successResponse(deletedOrder);
        }catch(error){
            return errorResponse(error);
        }
    }

    async updateOrder(id, orderData){
        try{
            const updatedOrder = await Client.db.collection(this.collection)
            .findOneAndUpdate({_id: new ObjectId(id)}, {$set: orderData});

            return successResponse(updatedOrder);
        }catch(error){
            return errorResponse(error);
        }
    }

    async createOrder(orderData){
        try{
            
            const {items, ...orderDataRest} = orderData;

            orderDataRest.createdAt = new Date();
            orderDataRest.status = "pending";
            orderDataRest.userId = new ObjectId(orderDataRest.userId);

            const newOrder = await Client.db.collection(this.collectionName).insertOne(orderDataRest);

            if(!newOrder.insertedId){
                throw new Error("Failed to create order");
            }

            items.map((item) => {
                item.plateId = new ObjectId(item.plateId);
                item.orderId = new ObjectId(newOrder.insertedId);
            })

            const itemsResult = await Client.db.collection("orderItems").insertMany(items);

            return successResponse(itemsResult);
        }catch(error){
            return errorResponse(error);
        }
    }
};

export default orderController;