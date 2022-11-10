import { getProductByGraphql } from "../../../../shopify/graphql_api/queryies/products.js";
import { productsUpdate } from "../../../../shopify/graphql_api/mutations/products.js";
import db from "../../../../db/models/postgres/index.js";
import { getCollectionProductsArr } from "./campaigns.js";
import cron from "node-cron";

export const scheduleJob = async (
  session,
  campaignInfo,
  campaignStartDate,
  campaignStartHour,
  campaignStartMinute,
  campaignStartTime
) => {
  let hour
  let time = campaignStartDate.split("-");
  hour = campaignStartHour;

  if (campaignStartTime == "PM") {
    hour = 12 + Number(campaignStartHour);
    // console.log(hour, campaignStartHour,"PM Conndition is work");
  }
  console.log(time, `=== 3 ${campaignStartMinute} ${hour} ${time[2]} ${time[1]}`);
  try {
    let task = cron.schedule(
      ` 3 ${campaignStartMinute} ${hour} ${time[2]} ${time[1]} *`,
      async () => {
    console.log("running a task every minute Node Crone", campaignInfo);

    let discount;
    let costDiscount;
    let campaignProducsArr = await getCollectionProductsArr(
      session,
      campaignInfo
    );

    console.log("AllData is === ", campaignProducsArr);
    await Promise.all(
      campaignProducsArr.map(async (ele) => {
        discount = ele.discount;
        costDiscount = ele.costDiscount;

        await Promise.all(
          ele.products.map(async (productId) => {
            console.log(productId, "productId======");

            let singleProduct = await getProductByGraphql(
              session,
              productId.id
            );
            let cost = Number(singleProduct.inventoryItem.unitCost.amount);
            let price = Number(singleProduct.price);
            let compareAt = Number(singleProduct.compareAtPrice);

            let disCost = cost - cost * (costDiscount / 100);
            let disPrice = price - price * (discount / 100);
            let disCompareAt = compareAt - compareAt * (discount / 100);

            let updatePrductsDiscount = await productsUpdate(
              session,
              productId.id,
              disCost,
              disPrice,
              disCompareAt
            );
            const result = await db.Campaign.update(
              { campaignStatus: "Active" },
              {
                where: {
                  storeId: session.id,
                  campaignName: campaignTitle,
                },
              }
            );
          })
        );
      })
    );

      task.stop();
    }
    );
  } catch (err) {
    console.log("scheduleJob Error", err);
  }
};

export const schedule2Job = async (
  session,
  campaignInfo,
  campaignEndDate,
  campaignEndHour,
  campaignEndMinute,
  campaignEndTime
) => {
  let hour
  let time = campaignEndDate.split("-");
  hour = campaignEndHour;

  if (campaignEndTime == "PM") {
    hour = 12 + Number(campaignEndHour);
    // console.log(hour, campaignEndHour,"PM Conndition is work");
  }
  console.log(time, `=== 3 ${campaignEndMinute} ${hour} ${time[2]} ${time[1]}`);
  try {
    let task = cron.schedule(
      ` 3 ${campaignEndMinute} ${hour} ${time[2]} ${time[1]} *`,
      async () => {
    console.log("running a task every schedule2Job");
    
 let discount;
    let costDiscount;
    
 let campaignProducsArr = await getCollectionProductsArr(session, campaignInfo);

 console.log("AllData is === ", campaignProducsArr);
 await Promise.all(
   campaignProducsArr.map(async (ele) => {
     discount = ele.discount;
     costDiscount = ele.costDiscount;

     await Promise.all(
       ele.products.map(async (productId) => {
         console.log(productId, "productId======");

         let singleProduct = await getProductByGraphql(session, productId.id);
         let cost = Number(singleProduct.inventoryItem.unitCost.amount);
         let price = Number(singleProduct.price);
         let compareAt = Number(singleProduct.compareAtPrice);

        //  let disCost = cost - cost * (costDiscount / 100);
        //  let disPrice = price - price * (discount / 100);
        //  let disCompareAt = compareAt - compareAt * (discount / 100);
         
         let disCost = cost / (1 - costDiscount / 100);
         let disPrice = price / (1 - discount / 100);
         let disCompareAt = compareAt / (1 - discount / 100);

         let updatePrductsDiscount = await productsUpdate(
           session,
           productId.id,
           disCost,
           disPrice,
           disCompareAt
         );
         const result = await db.Campaign.update(
           { campaignStatus: "Expired" },
           {
             where: {
               storeId: session.id,
               campaignName: campaignTitle,
             },
           }
         );
       })
     );
   })
 );


      task.stop();
    });
  } catch (err) {
    console.log("schedule2Job Error", err);
  }
};