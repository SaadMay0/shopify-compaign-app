import express from "express";
import {
  getCampaignInfo,
  newCampaigns,
  getCampaigns,
  getCampaignsById,
  updateCampaigns,
  deleteCampaignsById,
} from "../services/shopify/campaigns.js";
import "colors";
const router = express.Router();
// GET 
router.get("/getCampaigns", getCampaigns);
router.get("/getCampaignsById", getCampaignsById);

// POST

router.post("/CampaignInfo", getCampaignInfo);
router.post("/newCampaigns", newCampaigns); 

// PUT

router.put("/updateCampaigns", updateCampaigns);

// DELETE
router.delete("/deleteCampaignsById", deleteCampaignsById);


export default router;
