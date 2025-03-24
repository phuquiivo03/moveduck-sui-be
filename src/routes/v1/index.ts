
import { Router } from "express";
import healthRouter from "./health";
import contractRouter from "./contract";

const router = Router();

// router.get("/v1/quiz", purchaseController.findAll);
router.use("/v1", healthRouter);
router.use("/v1/contract", contractRouter);
export default router;
