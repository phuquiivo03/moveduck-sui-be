import { Router } from "express";
import v1Router from "./v1";
import healthRouter from "./health";

const router = Router();

router.use("", v1Router);
router.use("", healthRouter);

export default router;
