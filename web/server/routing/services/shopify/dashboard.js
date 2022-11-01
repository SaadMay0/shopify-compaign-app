import { Shopify } from "@shopify/shopify-api";
import db from "../../../db/models/postgres/index.js";
import { getCollectionProducts } from "../../../shopify/rest_api/collection.js";
import "colors";

export const dashboard = async (req, res) => {
  const { shop } = req.query;
  console.log("===> its work", shop);
  const session = await Shopify.Utils.loadCurrentSession(re, res, shop);
  console.log(session, "===> its work");
  res.status(200).send("oookay");
};

export const getCompaignInfo = async (req, res) => {
  console.log("===> getCollectionProducts its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { collectionIds } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    await Promise.all(
      collectionIds.map(async (ele) => {
        let vendor = [];
        let vendorSlect = []
        let collectionProducts = await getCollectionProducts(
          session,
          ele.id.split("/").pop()
        );
        await Promise.all(
          collectionProducts.products.map(async (ele) => {
            console.log(ele,"====");
            vendor.push({ value: `${ele.vendor}`, label: `${ele.vendor}` });
            vendorSlect.push(ele.vendor);
          })
        );
        let uniqueVendorsOption = [...new Set(vendor)];
        let uniqueVendorSlect = [...new Set(vendorSlect)];

      
        
        let obj = {
          id: ele.id,
          image: ele.image ? ele.image.originalSrc : null,
          title: ele.title,
          compaignQuantity: 1,
          compaignPrice: 0,
          compaignDiccount: 0,
          vendorsOptions: uniqueVendorsOption,
          vendorsSlect: uniqueVendorSlect,
          popoverActive:false,
        };
        Data.push(obj);
      })
    );
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
