import { getProductByGraphql } from "../../../../shopify/graphql_api/queryies/products.js";
import { productsUpdate } from "../../../../shopify/graphql_api/mutations/products.js";
import db from "../../../../db/models/postgres/index.js";
import { getCollectionProductsArr } from "./campaigns.js";
import cron from "node-cron";

export const scheduleJob = async (
  id,
  session,
  // campaignInfo,
  campaignStartDate,
  campaignStartHour,
  campaignStartMinute,
  campaignStartTime
) => {
  // 2022-09-10
  let time = campaignStartDate.split("-");
  let hour =
    campaignStartTime == "PM"
      ? Number(campaignStartHour) == 12
        ? campaignStartHour
        : 12 + Number(campaignStartHour)
      : campaignStartHour;

  console.log(
    time,
    `=== 3 ${campaignStartMinute} ${hour} ${time[2]} ${time[1]}`
  );
  try {
    let task = cron.schedule(
      ` 3 ${campaignStartMinute} ${hour} ${time[2]} ${time[1]} *`,
      // jobProcessor(id, session, campaignInfo)
      async () => {
        let campaign = await db.Campaign.findOne({
          where: {
            storeId: session.id,
            id: id,
          },
        });
        console.log("running a task every scheduleJob", campaign);

        let discount;
        let costDiscount;

        let campaignProducsArr = await getCollectionProductsArr(
          session,
          campaign.campaignInfo
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

                // let disCost = cost / (1 - costDiscount / 100);
                // let disPrice = price / (1 - discount / 100);
                // let disCompareAt = compareAt / (1 - discount / 100);
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

                console.log("Update DB worke=======");

                console.log("Campaign ****************");

                campaign.campaignStatus = "Active";
                campaign.save();
                console.log("Update DB worke Done !!=======");
              })
            );
          })
        );

        task.stop();
      }
    );
    // tak.stop();
  } catch (err) {
    console.log("scheduleJob Error", err);
  }
};

export const schedule2Job = async (
  id,
  session,
  // campaignInfo,
  campaignEndDate,
  campaignEndHour,
  campaignEndMinute,
  campaignEndTime
) => {
  let time = campaignEndDate.split("-");
  let hour =
    campaignEndTime == "PM"
      ? Number(campaignEndHour) == 12
        ? campaignEndHour
        : 12 + Number(campaignEndHour)
      : campaignEndHour;
  console.log(time, `=== 3 ${campaignEndMinute} ${hour} ${time[2]} ${time[1]}`);
  try {
    let task = cron.schedule(
      ` 3 ${campaignEndMinute} ${hour} ${time[2]} ${time[1]} *`,
      async () => {
        
        let campaign = await db.Campaign.findOne({
          where: {
            storeId: session.id,
            id: id,
          },
        });
        console.log("running a task every schedule2Job",campaign);

        
        let discount;
        let costDiscount;
        
        let campaignProducsArr = await getCollectionProductsArr(
          session,
          campaign.campaignInfo
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
                  
                  console.log("Update DB worke=======");
                 
                  console.log( "Campaign ****************");
                  
                  campaign.campaignStatus = "Expired";
                  campaign.save();
                console.log("Update DB worke Done !!=======");
              })
            );
          })
        );

        task.stop();
      }
    );
  } catch (err) {
    console.log("schedule2Job Error", err);
  }
};

const jobProcessor = (id, session, campaignInfo) => {
  return async () => {
    const campaignProducsArr = await getCollectionProductsArr(
      session,
      campaignInfo
    );

    console.log(campaignProducsArr, "=====1");
    for (let i = 0; i < campaignProducsArr.length; i++) {
      const { discount, costDiscount, products } = campaignProducsArr[i];
      console.log("=====2");
      for (let j = 0; j < products.length; j++) {
        // const { id } = products[i];
        const {
          inventoryItem,
          price: retailPrice,
          compareAtPrice,
        } = await getProductByGraphql(session, products[i].id);
        const cost = Number(inventoryItem.unitCost.amount);
        const price = Number(retailPrice);
        const compareAt = Number(compareAtPrice);

        let disCost = cost - cost * (costDiscount / 100);
        let disPrice = price - price * (discount / 100);
        let disCompareAt = compareAt - compareAt * (discount / 100);
        await productsUpdate(
          session,
          products[i].id,
          disCost,
          disPrice,
          disCompareAt
        );
        console.log("upDate Db is worke");
        const [row, created] = await db.Campaign.findOrCreate({
          where: {
            storeId: session.id,
            // campaignName: campaignInfo.title,
            id: id,
          },
          defaults: {},
        });
        if (!created) {
          row.campaignStatus = "Active";
          row.save();
        }
        console.log("upDate Db is Done!");
      }
    }
  };

  // console.log("campaignProducsArr is === ", campaignProducsArr.length);
  // await Promise.all(
  //   campaignProducsArr.map(async (ele) => {
  //     discount = ele.discount;
  //     costDiscount = ele.costDiscount;

  //     await Promise.all(
  //       ele.products.map(async (productId) => {
  //         let singleProduct = await getProductByGraphql(session, productId.id);
  //         let cost = Number(singleProduct.inventoryItem.unitCost.amount);
  //         let price = Number(singleProduct.price);
  //         let compareAt = Number(singleProduct.compareAtPrice);

  //         let disCost = cost - cost * (costDiscount / 100);
  //         let disPrice = price - price * (discount / 100);
  //         let disCompareAt = compareAt - compareAt * (discount / 100);
  //         await productsUpdate(
  //           session,
  //           productId.id,
  //           disCost,
  //           disPrice,
  //           disCompareAt
  //         );

  //         console.log("Campaign Update ======");
  //         // await db.Campaign.update(
  //         //   { campaignStatus: "Active" },
  //         //   {
  //         //     where: {
  //         //       storeId: session.id,
  //         //       campaignName: campaignInfo.title,
  //         //     },
  //         //   }
  //         // );
  //         const [row, created] = await db.Campaign.findOrCreate({
  //           where: {
  //             storeId: session.id,
  //             campaignName: campaignInfo.title,
  //           },
  //           defaults: {},
  //         });
  //         if (!created) {
  //           row.campaignStatus = "Expired";
  //           row.save();
  //         }
  //         console.log("Campaign Update Complete======");
  //       })
  //     );
  //   })
  // );
};
