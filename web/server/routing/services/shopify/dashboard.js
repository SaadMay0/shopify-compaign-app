import { Shopify } from "@shopify/shopify-api";
import db from "../../../db/models/postgres/index.js";
import { getCollectionProducts } from "../../../shopify/rest_api/collection.js";
import { addTagToProduct } from "../../../shopify/rest_api/product.js";
import { getProductByGraphql } from "../../../shopify/graphql_api/queryies/products.js";
import {
  variantsUpdate,
  productsUpdate,
} from "../helper_functions/shopify/campaigns.js";
import {
  scheduleJob,
  schedule2Job,
} from "../helper_functions/shopify/scheduleJob.js";
import "colors";

export const dashboard = async (req, res) => {
  const { shop } = req.query;
  console.log("===> its work", shop);
  const session = await Shopify.Utils.loadCurrentSession(re, res, shop);
  console.log(session, "===> its work");

  const allComaigns = await db.Campaigns.findAll({
    where: { storeId: session.id },
  });

  res.status(200).send("oookay");
};

export const getCampaignInfo = async (req, res) => {
  console.log("===> Dashboard/getCollectionProducts its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { collectionIds, campaignInfo, campaignTitle } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    // console.log(campaignInfo, "campaignInfo");
    // let discount;
    // let costDiscount;
    // let campainName;
    await scheduleJob(session, collectionIds, campaignInfo, campaignTitle);
    await schedule2Job(session, collectionIds, campaignInfo, campaignTitle);
    // await Promise.all(
    //   collectionIds.map(async (ele) => {
    //     campaignInfo.map((e) => {
    //       if (e.id == ele.id) {
    //         console.log("e.id =======", e, "ele.id=======", ele.id);
    //         campainName = campaignTitle;
    //         discount = e.campaignDiccount;
    //         costDiscount = e.campaignCostDiscount;
    //       }
    //     });
    //     let collectionProducts = await getCollectionProducts(
    //       session,
    //       ele.id.split("/").pop()
    //     );

    //     console.log("collectionProducts =====>>>", collectionProducts);
    //     await Promise.all(
    //       collectionProducts.products.map(async (product) => {
    //         console.log(
    //           " products collectionProducts ==== ",
    //           costDiscount,
    //           discount
    //         );
    //         let singleProduct = await getProductByGraphql(
    //           session,
    //           product.admin_graphql_api_id
    //         );

    //         let cost = Number(singleProduct.inventoryItem.unitCost.amount);
    //         let price = Number(singleProduct.price);
    //         let compareAt = Number(singleProduct.compareAtPrice);
    //         console.log(product.tags, "Tag is ");

    //         if (product.tags?.includes("Campaign")) {
    //           let value = product.tags.split("/");

    //           let dis = Number(value[1].split("=").pop());
    //           let costDis = Number(value[2].split("=").pop());
    //           let compareDis = Number(value[3].split("=").pop());

    //           cost = cost + cost * (costDis / 100);
    //           price = price + price * (dis / 100);
    //           compareAt = compareAt + compareAt * (compareDis / 100);

    //           console.log(
    //             "if condition is pass an d working and value is = ",
    //             dis,
    //             typeof dis,
    //             cost,
    //             price,
    //             compareAt
    //           );
    //         }

    //         let disCost = cost - cost * (costDiscount / 100);
    //         let disPrice = price - price * (discount / 100);
    //         let disCompareAt = compareAt - compareAt * (discount / 100);

    //         console.log(
    //           // singleProduct,
    //           "singleProduct",
    //           disCost,
    //           disPrice,
    //           disCompareAt
    //         );

    //         let updatePrductsDiscount = await productsUpdate(
    //           session,
    //           product.admin_graphql_api_id,
    //           disCost,
    //           disPrice,
    //           disCompareAt
    //         );

    //         let tag = ` ,Campaign title is =${campainName}/D=${discount}/CD=${costDiscount}`;

    //         let addTag = await addTagToProduct(
    //           session,
    //           product.id,
    //           singleProduct.tags + tag,
    //           tag
    //         );

    //         // console.log(updatePrductsDiscount,"***********************");
    //         // **********************************************

    //         // *******************************************

    //         // console.log(data);
    //       })
    //     );
    //   })
    // );
    Status = 200;
    Message = "Get Campain Info Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("getCampaignInfo", err);
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
