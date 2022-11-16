// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, LATEST_API_VERSION } from "@shopify/shopify-api";

import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
// import productCreator from "./helpers/product-creator.js";
import redirectToAuth from "./helpers/redirect-to-auth.js";
import { BillingInterval } from "./helpers/ensure-billing.js";

import { AppInstallations } from "./server/routing/services/helper_functions/webhook/index.js";
import config from "./server/db/config/index.js";
import mountRoutes from "./server/routing/routes/index.js";
import webhooks from "./server/routing/routes/gdpr_webhooks/index.js";
import { reSchedulAllJobs } from "./server/routing/services/shopify/campaigns.js";


const USE_ONLINE_TOKENS = false;
const { DATABASE } = config;

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

// TODO: There should be provided by env vars
const DEV_INDEX_PATH = `${process.cwd()}/frontend/`;
const PROD_INDEX_PATH = `${process.cwd()}/frontend/dist/`;

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https?:\/\//, ""),
  HOST_SCHEME: process.env.HOST.split("://")[0],
  API_VERSION: LATEST_API_VERSION,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: Shopify.Session.PostgreSQLSessionStorage.withCredentials(
    DATABASE.HOST,
    DATABASE.DATABASE,
    DATABASE.USERNAME,
    DATABASE.PASSWORD,
    {
      sessionTableName: "store",
    }
  ),
});

const BILLING_SETTINGS = {
  required: false,
  // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
  // chargeName: "My Shopify One-Time Charge",
  // amount: 5.0,
  // currencyCode: "USD",
  // interval: BillingInterval.OneTime,
};
 


// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  billingSettings = BILLING_SETTINGS
) {
  const app = express();

 

  console.log("===============================================");
  // console.log(app.on);
 
  console.log("==============================================");

  // setTimeout(async () => {
  //   console.log("setTimeOut==============================");
  //   await reSchedulAllJobs();
  // },1000)
 
  // app.use(reSchedulAllJobs);  
  webhooks(app);
  app.set("use-online-tokens", USE_ONLINE_TOKENS);
  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));
  

  applyAuthMiddleware(app, {  
    billing: billingSettings, 
  });

  // https://ee8e-110-39-147-226.ngrok.io?shop=saad-checkout-ui-ext.myshopify.com&host=c2FhZC1jaGVja291dC11aS1leHQubXlzaG9waWZ5LmNvbS9hZG1pbg

  console.log(process.env.HOST);

  // All endpoints after this point will require an active session
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: false }));
  mountRoutes(app);

  app.use(
    "/api/*",
    verifyRequest(app, {
      billing: billingSettings,
    })
  );

  // app.use("/api/*", reSchedulAllJobs);
  // app.use(express.json({ limit: "50mb" }));
  // app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${encodeURIComponent(
          shop
        )} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  // mountRoutes(app);

  if (isProd) {
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    app.use(compression());
    app.use(serveStatic(PROD_INDEX_PATH, { index: false }));
  }

  app.use("/*", async (req, res, next) => {
    if (typeof req.query.shop !== "string") {
      res.status(500);
      return res.send("No shop provided");
    }

    const shop = Shopify.Utils.sanitizeShop(req.query.shop);
    const appInstalled = await AppInstallations.includes(shop);

    if (!appInstalled && !req.originalUrl.match(/^\/exitiframe/i)) {
      return redirectToAuth(req, res, app);
    }

    if (Shopify.Context.IS_EMBEDDED_APP && req.query.embedded !== "1") {
      const embeddedUrl = Shopify.Utils.getEmbeddedAppUrl(req);

      return res.redirect(embeddedUrl + req.path);
    }

    const htmlFile = join(
      isProd ? PROD_INDEX_PATH : DEV_INDEX_PATH,
      "index.html"
    );

    return res
      .status(200)
      .set("Content-Type", "text/html")
      .send(readFileSync(htmlFile));
  });

  return { app };
}

createServer().then(({ app }) => {
  app.listen(PORT)
});
