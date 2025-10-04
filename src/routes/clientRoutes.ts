import { Router } from "express";
import clientController from "../controllers/clientController";

const router = Router();

router.post("/companies/:companyId/clients", clientController.create);
router.get("/companies/:companyId/clients", clientController.list);
router.get("/companies/:companyId/clients/:clientId", clientController.getById);
router.put("/companies/:companyId/clients/:clientId", clientController.update);
router.patch("/companies/:companyId/clients/:clientId", clientController.update);
router.delete("/companies/:companyId/clients/:clientId", clientController.remove);

export default router;
