import { getCollectionProducts } from "../../../../shopify/rest_api/collection.js";
import { getProductByGraphql } from "../../../../shopify/graphql_api/queryies/products.js";
import { productsUpdate } from "./campaigns.js";
import cron from "node-cron"
export const scheduleJob = async (
  session,
  collectionIds,
  campaignInfo,
  campaignTitle
) => {
    let Data = [];
    let Status;
    let Message;
    let Err;
  try {
    let task = cron.schedule("1 11 23 * * *", async () => {
      console.log("running a task every minute Node Crone");
      let discount;
      let costDiscount;
      let campainName;


      // let allPrductsId = []
 
      await Promise.all(
        collectionIds.map(async (ele) => {
          campaignInfo.map((e) => {
            if (e.id == ele.id) {
              console.log("e.id =======", e, "ele.id=======", ele.id);
              campainName = campaignTitle;
              discount = e.campaignDiccount;
              costDiscount = e.campaignCostDiscount;
            }
          });
          let collectionProducts = await getCollectionProducts(
            session,
            ele.id.split("/").pop()
          );




          console.log("collectionProducts =====>>>", collectionProducts);
          await Promise.all(
            collectionProducts.products.map(async (product) => {
              console.log(
                " products collectionProducts ==== ",
                costDiscount,
                discount
              );
              let singleProduct = await getProductByGraphql(
                session,
                product.admin_graphql_api_id
              );

              let cost = Number(singleProduct.inventoryItem.unitCost.amount);
              let price = Number(singleProduct.price);
              let compareAt = Number(singleProduct.compareAtPrice);

              // if (product.tags?.includes("Campaign")) {
              //   let value = product.tags.split("/");

              //   let dis = Number(value[1].split("=").pop());
              //   let costDis = Number(value[2].split("=").pop());
              //   let compareDis = Number(value[3].split("=").pop());

              //   cost = cost + cost * (costDis / 100);
              //   price = price + price * (dis / 100);
              //   compareAt = compareAt + compareAt * (compareDis / 100);

              //   console.log(
              //     "if condition is pass an d working and value is = ",
              //     dis,
              //     typeof dis,
              //     cost,
              //     price,
              //     compareAt
              //   );
              // }

              let disCost = cost - cost * (costDiscount / 100);
              let disPrice = price - price * (discount / 100);
              let disCompareAt = compareAt - compareAt * (discount / 100);

              // console.log(
              //   // singleProduct,
              //   "singleProduct",
              //   disCost,
              //   disPrice,
              //   disCompareAt
              // );

              let updatePrductsDiscount = await productsUpdate(
                session,
                product.admin_graphql_api_id,
                disCost,
                disPrice,
                disCompareAt
              );

              // let tag = ` ,Campaign title is =${campainName}/D=${discount}/CD=${costDiscount}`;

              // let addTag = await addTagToProduct(
              //   session,
              //   product.id,
              //   singleProduct.tags + tag,
              //   tag
              // );

              // console.log(updatePrductsDiscount,"***********************");
              // **********************************************

              // *******************************************

              // console.log(data);
            })
          );
        })
      );
    });
    // task.stop();
    Status = 200;
    Message = "Get Campain Info Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("getCampaignInfo", err);
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }
};


export const schedule2Job = async (
  session,
  collectionIds,
  campaignInfo,
  campaignTitle
) => {
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    let task = cron.schedule("1 39 23 * * *", async () => {
      console.log("running a task every minute Node Crone");
      let discount;
      let costDiscount;
      let campainName;

      // let allPrductsId = []

      await Promise.all(
        collectionIds.map(async (ele) => {
          campaignInfo.map((e) => {
            if (e.id == ele.id) {
              console.log("e.id =======", e, "ele.id=======", ele.id);
              campainName = campaignTitle;
              discount = e.campaignDiccount;
              costDiscount = e.campaignCostDiscount;
            }
          });
          let collectionProducts = await getCollectionProducts(
            session,
            ele.id.split("/").pop()
          );

          console.log("collectionProducts =====>>>", collectionProducts);
          await Promise.all(
            collectionProducts.products.map(async (product) => {
              console.log(
                " products collectionProducts ==== ",
                costDiscount,
                discount
              );
              let singleProduct = await getProductByGraphql(
                session,
                product.admin_graphql_api_id
              );

              let cost = Number(singleProduct.inventoryItem.unitCost.amount);
              let price = Number(singleProduct.price);
              let compareAt = Number(singleProduct.compareAtPrice);
             

              // if (product.tags?.includes("Campaign")) {
              //   let value = product.tags.split("/");

              //   let dis = Number(value[1].split("=").pop());
              //   let costDis = Number(value[2].split("=").pop());
              //   let compareDis = Number(value[3].split("=").pop());

              //   cost = cost + cost * (costDis / 100);
              //   price = price + price * (dis / 100);
              //   compareAt = compareAt + compareAt * (compareDis / 100);

              //   console.log(
              //     "if condition is pass an d working and value is = ",
              //     dis,
              //     typeof dis,
              //     cost,
              //     price,
              //     compareAt
              //   );
              // }

              let disCost = cost / (1 - costDiscount / 100);
              let disPrice = price / (1-discount / 100);
              let disCompareAt =compareAt/ (1- discount / 100);

              console.log(
                disCost,
                "singleProduct",
                costDiscount,
                cost,
                // disCompareAt
              );

              let updatePrductsDiscount = await productsUpdate(
                session,
                product.admin_graphql_api_id,
                disCost,
                disPrice,
                disCompareAt
              );

              // let tag = ` ,Campaign title is =${campainName}/D=${discount}/CD=${costDiscount}`;

              // let addTag = await addTagToProduct(
              //   session,
              //   product.id,
              //   singleProduct.tags + tag,
              //   tag
              // );

              // console.log(updatePrductsDiscount,"***********************");
              // **********************************************

              // *******************************************

              // console.log(data);
            })
          );
        })
      );
    });
    // task.stop();
    Status = 200;
    Message = "Get Campain Info Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("getCampaignInfo", err);
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }
};
