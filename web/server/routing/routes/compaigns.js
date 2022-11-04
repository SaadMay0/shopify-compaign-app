import express from "express";
import {
  getCompaignInfo,
  newCompaigns,
  getCompaigns,
  getCompaignsById,
  updateCompaigns,
  deleteCompaignsById,
} from "../services/shopify/compaigns.js";
import "colors";
const router = express.Router();
// GET 
router.get("/getCompaigns", getCompaigns);
router.get("/getCompaignsById", getCompaignsById);

// POST

router.post("/CompaignInfo", getCompaignInfo);
router.post("/newCompaigns", newCompaigns); 

// PUT

router.put("/updateCompaigns", updateCompaigns);

// DELETE
router.delete("/deleteCompaignsById", deleteCompaignsById);


export default router;
