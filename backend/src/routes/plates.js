import express from "express";
import platesController from "../controllers/platesController.js";

const platesRouter = express.Router();

const platesControllerInstance = new platesController();

platesRouter.get("/", async (req, res) => {
    const plates = await platesControllerInstance.getPlates();

    return res.status(plates.statusCode).send(plates);
});

platesRouter.delete("/:id", async (req, res) => {
    const plateDeleted = await platesControllerInstance.deletePlate(req.params.id);

    return res.status(plateDeleted.statusCode).send(plateDeleted);
});

platesRouter.put("/:id", async (req, res) => {
    const plateUpdated = await platesControllerInstance.updatePlate(req.params.id, req.body);

    return res.status(plateUpdated.statusCode).send(plateUpdated);
});

platesRouter.post("/", async (req, res) => {
    const plateAdded = await platesControllerInstance.addPlates(req.body);

    return res.status(plateAdded.statusCode).send(plateAdded);
});

platesRouter.get("/availables", async (req, res) => {
    const availablePlates = await platesControllerInstance.getAvailablePlates();

    return res.status(availablePlates.statusCode).send(availablePlates);
});

export default platesRouter;