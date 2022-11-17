import { Shopify } from "@shopify/shopify-api";
import crypto from "crypto";

export const customersDataReqest = async (req, res) => {
  try {
    console.log("customersDataReqest is working");
    const { body, headers, rawBody } = req;
    const headerHMAC = headers["x-shopify-hmac-sha256"];
    const shopifyWehookSecretKey = process.env.SHOPIFY_API_SECRET;

    const generatedHash = crypto
      .createHmac("sha256", shopifyWehookSecretKey)
      .update(rawBody, "utf-8")
      .digest("base64");

    let hashEquals = Shopify.Utils.safeCompare(generatedHash, headerHMAC);

    if (hashEquals) {
      res.status(200).send({});
      console.log("hashEquals True");
    } else {
      res.status(401).send({});
      console.log("hashEquals false");
    }
  } catch (err) {
    console.log("customersDataReqest Error", err);
  }
};

export const customersRedact = async (req, res) => {
  try {
    const { body, headers, rawBody } = req;
    const headerHMAC = headers["x-shopify-hmac-sha256"];
    const shopifyWehookSecretKey = process.env.SHOPIFY_API_SECRET;

    const generatedHash = crypto
      .createHmac("sha256", shopifyWehookSecretKey)
      .update(rawBody, "utf-8")
      .digest("base64");

    let hashEquals = Shopify.Utils.safeCompare(generatedHash, headerHMAC);

    if (hashEquals) {
      res.status(200).send({});
      console.log("hashEquals True");
    } else {
      res.status(401).send({});
      console.log("hashEquals false");
    }
  } catch (err) {
    console.log("customersRedact", err);
  }
};

export const shopRedact = async (req, res) => {
  try {
    const { body, headers, rawBody } = req;
    const headerHMAC = headers["x-shopify-hmac-sha256"];
    const shopifyWehookSecretKey = process.env.SHOPIFY_API_SECRET;

    const generatedHash = crypto
      .createHmac("sha256", shopifyWehookSecretKey)
      .update(rawBody, "utf-8")
      .digest("base64");

    let hashEquals = Shopify.Utils.safeCompare(generatedHash, headerHMAC);

    if (hashEquals) {
      res.status(200).send({});
      console.log("hashEquals True");
    } else {
      res.status(401).send({});
      console.log("hashEquals false");
    }
  } catch (err) {
    console.log("shopRedact Error", err);
  }
};
