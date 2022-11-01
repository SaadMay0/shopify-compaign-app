import { Shopify } from "@shopify/shopify-api";
import db from "../../../db/models/postgres/index.js";
import { getCollectionProducts } from "../../../shopify/rest_api/collection.js";
import "colors";

export const getCompaignInfo = async (req, res) => {
  console.log("===> getCollectionProducts its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { collectionIds } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    Status = 200;
    Message = "Get Compain Info Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("getCompaignInfo", err);
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }

  res.status(200).send({
    Response: {
      Data,
      Status,
      Message,
      Err,
    },
  });
};

export const newCompaigns = async (req, res) => {
  console.log("===> getCollectionProducts its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { collectionIds } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    Status = 200;
    Message = "Get Compain Info Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("getCompaignInfo", err);
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }

  res.status(200).send({
    Response: {
      Data,
      Status,
      Message,
      Err,
    },
  });
};

export const getCompaigns = async (req, res) => {
  console.log("===> getCollectionProducts its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { collectionIds } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    Status = 200;
    Message = "Get Compain Info Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("getCompaignInfo", err);
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }

  res.status(200).send({
    Response: {
      Data,
      Status,
      Message,
      Err,
    },
  });
};

export const getCompaignsById = async (req, res) => {
  console.log("===> getCollectionProducts its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { collectionIds } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    Status = 200;
    Message = "Get Compain Info Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("getCompaignInfo", err);
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }

  res.status(200).send({
    Response: {
      Data,
      Status,
      Message,
      Err,
    },
  });
};

export const updateCompaigns = async (req, res) => {
  console.log("===> getCollectionProducts its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { collectionIds } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    Status = 200;
    Message = "Get Compain Info Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("getCompaignInfo", err);
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }

  res.status(200).send({
    Response: {
      Data,
      Status,
      Message,
      Err,
    },
  });
};

export const deleteCompaignsById = async (req, res) => {
  console.log("===> getCollectionProducts its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { collectionIds } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    Status = 200;
    Message = "Get Compain Info Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("getCompaignInfo", err);
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }

  res.status(200).send({
    Response: {
      Data,
      Status,
      Message,
      Err,
    },
  });
};
