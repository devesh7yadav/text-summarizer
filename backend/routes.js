import express from "express";
import { summarize } from "./aiController.js";

const router = express.Router();

router.post("/", summarize);

export default router;