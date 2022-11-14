import express from "express";
import {
  customersDataReqest,
  customersRedact,
  shopRedact,
} from "../../services/webhook/gdpr_webhooks.js";
import { rawBodyHandler } from "../../../middleware/verification.js";

const router = express.Router();

router.post("/customers_data_request", rawBodyHandler, customersDataReqest);
router.post("/customers_redact", rawBodyHandler, customersRedact);
router.post("/shop_redact",rawBodyHandler, shopRedact);


export default router;
