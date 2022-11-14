import gdprWebhooks from "./gdpr_webhooks.js";
import webhooks from "./webhooks.js"
export default (app) => {
  app.use("/api/gdprWebhook", gdprWebhooks);
  app.use("/api/v1.0/webhook", webhooks);
};
