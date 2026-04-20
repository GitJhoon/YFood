import express from "express";
import orderController from "../controllers/orderController.js";

const orderRouter = express.Router();

const orderControllerInstance = new orderController();

orderRouter.get("/", async(req, res) => {
    const orders = await orderControllerInstance.getOrders();

    return res.status(res.statusCode).send(orders);
});

orderRouter.delete("/:id", async(req, res) => {
    const deletedOrder = await orderControllerInstance.deleteOrder(req.params.id);

    return res.status(deletedOrder.statusCode).send(deletedOrder);
});

orderRouter.put("/:id", async (req, res) => {
    const updatedOrder = await orderControllerInstance.updateOrder(req.params.id, req.body);

    return res.status(updatedOrder.status).send(updatedOrder);
});

orderRouter.post("/", async (req, res) => {
    const newOrder = await orderControllerInstance.createOrder(req.body);

    return res.status(newOrder.statusCode).send(newOrder);
});

export default orderRouter;