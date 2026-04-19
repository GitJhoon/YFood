import express from "express";
import usersController from "../controllers/usersController.js";

const usersRouter = express.Router();

const usersControllerInstance = new usersController();

usersRouter.get("/", async (req, res) => {

    const responseUser = await usersControllerInstance.getUsers();

    return res.status(responseUser.statusCode).send(responseUser);
})

usersRouter.delete("/:id", async (req, res) => {
    const responseDeleteUser = await usersControllerInstance.deleteUser(req.params.id);

    console.log(req.params.id);

    return res.status(responseDeleteUser.statusCode).send(responseDeleteUser);
});

usersRouter.put("/:id", async (req, resp) => {
    const responseUpdatedUser = await usersControllerInstance.updateUser(req.params.id, req.body);

    return resp.status(responseUpdatedUser.statusCode).send(responseUpdatedUser);
});

export default usersRouter;

