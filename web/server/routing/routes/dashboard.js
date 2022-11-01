import express from "express";
import {
  dashboard,
  getCompaignInfo,
} from "../services/shopify/dashboard.js";
import "colors";
const router = express.Router();


router.get("/dashboard", dashboard);
router.post("/CompaignInfo", getCompaignInfo);

export default router;
