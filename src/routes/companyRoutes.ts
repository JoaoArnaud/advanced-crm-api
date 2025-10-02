import { Router } from "express";
import companyController from "../controllers/companyController";

const router = Router();

router.post("/companies", companyController.create);
router.get("/companies", companyController.list);
router.get("/companies/:id", companyController.getById);
router.put("/companies/:id", companyController.update);
router.patch("/companies/:id", companyController.update);
router.delete("/companies/:id", companyController.remove);

export default router;
