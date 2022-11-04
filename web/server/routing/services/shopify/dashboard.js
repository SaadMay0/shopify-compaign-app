import { Shopify } from "@shopify/shopify-api";
import db from "../../../db/models/postgres/index.js";
import { getCollectionProducts } from "../../../shopify/rest_api/collection.js";
// import { getProduct } from "../../../shopify/rest_api/product.js";
import { getProductByGraphql } from "../../../shopify/graphql_api/queryies/products.js";
import {
  variantsUpdate,
  productsUpdate,
} from "../helper_functions/shopify/compaigns.js";
import "colors";

export const dashboard = async (req, res) => {
  const { shop } = req.query;
  console.log("===> its work", shop);
  const session = await Shopify.Utils.loadCurrentSession(re, res, shop);
  console.log(session, "===> its work");

  const allComaigns = await db.Compaigns.findAll({
    where: { storeId: session.id },
  });

  res.status(200).send("oookay");
};

export const getCompaignInfo = async (req, res) => {
  console.log("===> Dashboard/getCollectionProducts its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { collectionIds, compaignInfo } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    console.log(compaignInfo, "compaignInfo");
    let discount;
    let costDiscount;
    await Promise.all(
      collectionIds.map(async (ele) => {
        compaignInfo.map((e) => {
          if (e.id == ele.id) {
            console.log("e.id =======", e.id, "ele.id=======", ele.id);

            discount = e.compaignDiccount;
            costDiscount = e.compaignCostDiscount;
          }
        });
        let collectionProducts = await getCollectionProducts(
          session,
          ele.id.split("/").pop()
        );
        await Promise.all(
          collectionProducts.products.map(async (ele) => {
            console.log(
              " products collectionProducts ==== ",
              costDiscount,
              discount
            );

            let singleProduct = await getProductByGraphql(
              session,
              ele.admin_graphql_api_id
            );
            let cost = Number(singleProduct.inventoryItem.unitCost.amount);
            let price = Number(singleProduct.price);
            let compareAt = Number(singleProduct.compareAtPrice);

            let disCost = cost - cost * (costDiscount / 100);
            let disPrice = price - price * (discount / 100);
            let disCompareAt = compareAt - compareAt * (discount / 100);



            console.log(
              singleProduct,
              "singleProduct",
              disCost,
              disPrice,
              disCompareAt
            );

            // let updatePrducts = await productsUpdate(
            //   session,
            //   ele.admin_graphql_api_id,
            //   30,
            //   40,
            //   50
            // );

            // console.log(updatePrducts,"***********************");
            // **********************************************

            // *******************************************

            // console.log(data);
          })
        );
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
