import express from "express";
import orderController from "../controllers/orderController.js";

const orderRouter = express.Router();

const orderControllerInstance = new orderController();

orderRouter.get("/", async(req, res) => {
    const orders = await orderControllerInstance.getOrders();

    return res.status(res.statusCode).send(orders);
});

orderRouter.get("/:userId", async(req, res) => {
    const ordersByUser = await orderControllerInstance.getOrderByUser(req.params.userId);

    return res.status(ordersByUser.statusCode).send(ordersByUser);
});

orderRouter.delete("/:orderId", async(req, res) => {
    const deletedOrder = await orderControllerInstance.deleteOrder(req.params.orderId);

    return res.status(deletedOrder.statusCode).send(deletedOrder);
});

orderRouter.put("/:orderId", async (req, res) => {
    const updatedOrder = await orderControllerInstance.updateOrder(req.params.orderId, req.body);

    return res.status(updatedOrder.statusCode).send(updatedOrder);
});

orderRouter.post("/", async (req, res) => {
    const newOrder = await orderControllerInstance.createOrder(req.body);

    return res.status(newOrder.statusCode).send(newOrder);
});

export default orderRouter;