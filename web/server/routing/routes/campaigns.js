import express from "express";
import {
  getCampaignInfo,
  newCampaigns,
  getCampaigns,
  getCampaignsById,
  updateCampaigns,
  deleteCampaignsById,
  getCampaignsByStatus,
  testCroneJob,
  reSchedulAllJobs,
} from "../services/shopify/campaigns.js";
import "colors";
const router = express.Router();
// GET 
router.get("/getCampaigns", getCampaigns);
router.get("/getCampaignsById", getCampaignsById);
router.get("/getCampaignsByStatus", getCampaignsByStatus);
router.get("/reSchedulAllJobs", reSchedulAllJobs);
// POST

router.post("/CampaignInfo", getCampaignInfo);
router.post("/newCampaigns", newCampaigns); 

// PUT

router.put("/updateCampaigns", updateCampaigns);

// DELETE
router.delete("/deleteCampaignsById", deleteCampaignsById);

////  
router.put("/testCroneJob" , testCroneJob);
 
export default router;
