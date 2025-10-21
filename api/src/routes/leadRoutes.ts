import { Router } from "express";
import leadController from "../controllers/leadController";

const router = Router();

router.post("/companies/:companyId/leads", leadController.create);
router.get("/companies/:companyId/leads", leadController.list);
router.get("/companies/:companyId/leads/:leadId", leadController.getById);
router.put("/companies/:companyId/leads/:leadId", leadController.update);
router.patch("/companies/:companyId/leads/:leadId", leadController.update);
router.delete("/companies/:companyId/leads/:leadId", leadController.remove);

export default router;
