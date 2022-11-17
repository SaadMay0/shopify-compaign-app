import campaign from "./campaigns.js";

export default (app) => {
  app.use("/api/campaign", campaign);
};
