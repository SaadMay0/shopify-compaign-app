import express from "express";
import {
  dashboard,
  getCampaignInfo,
} from "../services/shopify/dashboard.js";
import "colors";
const router = express.Router();


router.get("/dashboard", dashboard);
router.post("/CampaignInfo", getCampaignInfo);

export default router;
