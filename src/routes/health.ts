import { Router } from "express";

const router = Router();

router.get("/health", (req, res, next) => {
  res.send({ status: 200, message: "Ok!" });
});

export default router;
