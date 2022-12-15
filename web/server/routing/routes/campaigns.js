import express from "express";
import {
  getCampaignInfo,
  newCampaigns,
  getCampaigns,
  getCampaignsById,
  updateCampaigns,
  deleteCampaignsById,
  getCampaignsByStatus,
  reSchedulAllJobs,
  startCampaign,
  stopCampaign,
  stopAllCampaignAndSetDefaultValues,
} from "../services/shopify/campaigns.js";
import "colors";
const router = express.Router();
// GET
router.get("/getCampaigns", getCampaigns);
router.get("/getCampaignsById", getCampaignsById);
router.get("/getCampaignsByStatus", getCampaignsByStatus);
router.get("/reSchedulAllJobs", reSchedulAllJobs);
router.get("/startCampaign", startCampaign);
router.get("/stopCampaign", stopCampaign);
router.get("/setAllDefaultPrices", stopAllCampaignAndSetDefaultValues);
// POST

router.post("/CampaignInfo", getCampaignInfo);
router.post("/newCampaigns", newCampaigns);

// PUT

router.put("/updateCampaigns", updateCampaigns);

// DELETE
router.delete("/deleteCampaignsById", deleteCampaignsById);

export default router;
