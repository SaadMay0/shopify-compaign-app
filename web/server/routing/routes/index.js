import webhooks from "./webhook.route.js";
import dashboard from "./dashboard.js";
import compaign from "./compaigns.js";

export default (app) => {
  app.use("/api/v1.0/webhook", webhooks);
  app.use("/api", dashboard);
  app.use("/api/compaign", compaign);
};
