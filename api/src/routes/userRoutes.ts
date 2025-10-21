import { Router } from "express";
import userController from "../controllers/userController";

const router = Router();

router.post("/users", userController.create);
router.get("/users", userController.list);
router.get("/users/:id", userController.getById);
router.put("/users/:id", userController.update);
router.patch("/users/:id", userController.update);
router.delete("/users/:id", userController.remove);
router.post("/users/login", userController.authenticate);

export default router;
