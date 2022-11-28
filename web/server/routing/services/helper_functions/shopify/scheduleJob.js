import {
  getProductByGraphql,
  getProductVariantByGraphql,
} from "../../../../shopify/graphql_api/queryies/products.js";
import {
  productsUpdate,
  variantsUpdate,
} from "../../../../shopify/graphql_api/mutations/products.js";
import db from "../../../../db/models/postgres/index.js";
import { getCollectionProductsArr } from "./campaigns.js";
import { getProduct } from "../../../../shopify/rest_api/product.js";
import cron from "node-cron";

export const startJob = async (id, session, campaignStart) => {
  let dateOfStart = new Date(campaignStart);

  let startedDate = dateOfStart.toISOString().split("T").shift();
  let startedHour = dateOfStart.getHours();
  let startedMinute = dateOfStart.getMinutes(); 

  console.log(
    `StartJob ${startedDate} === 3 ${startedMinute} ${startedHour} ${
      startedDate.split("-")[2]
    } ${startedDate.split("-")[1]}`
  );
  try {
    let task = cron.schedule(
      ` 1 ${startedMinute} ${startedHour} ${startedDate.split("-")[2]} ${
        startedDate.split("-")[1]
      } *`,
      async () => {
        let campaign = await db.Campaign.findOne({
          where: {
            storeId: session.id,
            id,
            campaignStatus: "Scheduled",
          },
        });
        console.log("schedule Condition First StartJob =======");

        let toDate = new Date();
        let startDate = new Date(campaign.campaignStart);

        let startedDate = startDate.toISOString().split("T").shift();
        let startedHour = startDate.getHours();
        let startedMinute = startDate.getMinutes();

        let toDayDate = toDate.toISOString().split("T").shift();
        let toDateHour = toDate.getHours();
        let toDateMinute = toDate.getMinutes();

        if (
          toDayDate == startedDate &&
          toDateHour == startedHour &&
          toDateMinute == startedMinute
        ) {
          console.log("running a task on Exact scheduleJob");

          let discount;
          let costDiscount;

          await Promise.all(
            campaign.campaignInfo.map(async (ele) => {
              console.log(ele, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
              discount = ele.campaignDiscount;
              costDiscount = ele.campaignCostDiscount;

              await Promise.all(
                ele.allVariants.map(async (productId) => {
                  if (ele.vendorsSelect.includes(`${productId.vendor}`)) {
                    let singleProduct = await getProductVariantByGraphql(
                      session,
                      productId.id
                    );
                    console.log(
                      // productId,
                      // ele.vendorsSelect,
                      "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
                      // productId.vendor,
                      // ele.vendorsSelect.includes(`${productId.vendor}`)
                    );

                    console.log(
                      singleProduct.displayName,
                      "******************"
                    );

                    let cost = Number(
                      singleProduct.inventoryItem.unitCost.amount
                    );
                    let price = Number(singleProduct.price);
                    let compareAt = Number(singleProduct.compareAtPrice);

                    let disCost = cost - cost * (costDiscount / 100);
                    let disPrice = price - price * (discount / 100);
                    let disCompareAt = compareAt - compareAt * (discount / 100);

                    await variantsUpdate(
                      session,
                      productId.id,
                      disCost,
                      disPrice,
                      disCompareAt
                    );
                    campaign.campaignStatus = "Active";
                    campaign.save();
                    console.log("Update DB worke Done !! At StartJob=======");
                  }
                })
              );
            })
          );
        } else {
          console.log("************Again schedule StartJob ****************");
          await startJob(campaign.id, session, campaign.campaignStart);
        }

        console.log(">>>>>>task.stop StartJob <<<<<<<");

        task.stop();
      }
    );
  } catch (err) {
    console.log("scheduled StartJob Error", err);
  }
};

export const endJob = async (id, session, campaignEnd) => {
  let dateOfEnd = new Date(campaignEnd);

  let campaignEndDate1 = dateOfEnd.toISOString().split("T").shift();
  let campaignEndHour1 = dateOfEnd.getHours();
  let campaignEndMinute1 = dateOfEnd.getMinutes();

  console.log(
    `endJob ${campaignEndDate1} === 3 ${campaignEndMinute1} ${campaignEndHour1} ${
      campaignEndDate1.split("-")[2]
    } ${campaignEndDate1.split("-")[1]}`
  );
  try {
    let task = cron.schedule(
      ` 1 ${campaignEndMinute1} ${campaignEndHour1} ${
        campaignEndDate1.split("-")[2]
      } ${campaignEndDate1.split("-")[1]} *`,
      async () => {
        let campaign = await db.Campaign.findOne({
          where: {
            storeId: session.id,
            id,
            campaignStatus: "Active",
          },
        });

        console.log("schedule Condition First endJob =======");
        let toDate = new Date();
        let endDate = new Date(campaign.campaignEnd);

        let campaignEndDate = endDate.toISOString().split("T").shift();
        let campaignEndHour = endDate.getHours();
        let campaignEndMinute = endDate.getMinutes();

        let toDayDate = toDate.toISOString().split("T").shift();
        let toDateHour = toDate.getHours();
        let toDateMinute = toDate.getMinutes();

        if (
          toDayDate == campaignEndDate &&
          toDateHour == campaignEndHour &&
          toDateMinute == campaignEndMinute
        ) {
          console.log("running a task on Exact scheduled endJob");

          let discount;
          let costDiscount;

          await Promise.all(
            campaign.campaignInfo.map(async (ele) => {
              discount = ele.campaignDiscount;
              costDiscount = ele.campaignCostDiscount;

              await Promise.all(
                ele.allVariants.map(async (productId) => {
                  if (ele.vendorsSelect.includes(`${productId.vendor}`)) {
                    let singleProduct = await getProductVariantByGraphql(
                      session,
                      productId.id
                    );

                    console.log(
                      singleProduct.displayName,
                      "******************"
                    );

                    let cost = Number(
                      singleProduct.inventoryItem.unitCost.amount
                    );
                    let price = Number(singleProduct.price);
                    let compareAt = Number(singleProduct.compareAtPrice);

                    let disCost = cost / (1 - costDiscount / 100);
                    let disPrice = price / (1 - discount / 100);
                    let disCompareAt = compareAt / (1 - discount / 100);

                    await variantsUpdate(
                      session,
                      productId.id,
                      disCost,
                      disPrice,
                      disCompareAt
                    );

                    campaign.campaignStatus = "Expired";
                    campaign.save();
                    console.log("Update DB worke Done !!  at endJob=======");
                  }
                })
              );
            })
          );
        } else {
          console.log("************Again schedule endJob ****************");
          await endJob(campaign.id, session, campaign.campaignEnd);
        }
        console.log(">>>>>>task.stop endJob<<<<<<<");
        task.stop();
      }
    );
  } catch (err) {
    console.log("scheduled End Job", err);
  }
};


export const start = async (id, session) => {

  try {
    let task = cron.schedule(
      ` 1 * * * * *`,
      async () => {
        let campaign = await db.Campaign.findOne({
          where: {
            storeId: session.id,
            id,
            campaignStatus: "Scheduled",
          },
        });
        console.log("schedule Condition First Start =======");

 

          let discount;
          let costDiscount;

          await Promise.all(
            campaign.campaignInfo.map(async (ele) => {
              console.log(ele, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
              discount = ele.campaignDiscount;
              costDiscount = ele.campaignCostDiscount;

              await Promise.all(
                ele.allVariants.map(async (productId) => {
                  if (ele.vendorsSelect.includes(`${productId.vendor}`)) {
                    let singleProduct = await getProductVariantByGraphql(
                      session,
                      productId.id
                    );
                    console.log(
                      // productId,
                      // ele.vendorsSelect,
                      "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%"
                      // productId.vendor,
                      // ele.vendorsSelect.includes(`${productId.vendor}`)
                    );

                    console.log(
                      singleProduct.displayName,
                      "****************** START"
                    );

                    let cost = Number(
                      singleProduct.inventoryItem.unitCost.amount
                    );
                    let price = Number(singleProduct.price);
                    let compareAt = Number(singleProduct.compareAtPrice);

                    let disCost = cost - cost * (costDiscount / 100);
                    let disPrice = price - price * (discount / 100);
                    let disCompareAt = compareAt - compareAt * (discount / 100);

                    await variantsUpdate(
                      session,
                      productId.id,
                      disCost,
                      disPrice,
                      disCompareAt
                    );
                    campaign.campaignStatus = "Active";
                    campaign.save();
                    console.log("Update DB worke Done !! At Start=======");
                  }
                })
              );
            })
          );
    

        console.log(">>>>>>task.stop Start <<<<<<<");

        task.stop();
      }
    );
  } catch (err) {
    console.log("scheduled Start Error", err);
  }
};

export const end = async (id, session) => {


  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
 
  try {
        let campaign = await db.Campaign.findOne({
          where: {
            storeId: session.id,
            id,
            campaignStatus: "Active",
          },
        });


        if (campaign) {


          console.log("running a task on Exact scheduled end");

          let discount;
          let costDiscount;

          await Promise.all(
            campaign.campaignInfo.map(async (ele) => {
              discount = ele.campaignDiscount;
              costDiscount = ele.campaignCostDiscount;

              await Promise.all(
                ele.allVariants.map(async (productId) => {
                  if (ele.vendorsSelect.includes(`${productId.vendor}`)) {
                    let singleProduct = await getProductVariantByGraphql(
                      session,
                      productId.id
                    );

                    console.log(
                      singleProduct.displayName,
                      "******************  END"
                    );

                    let cost = Number(
                      singleProduct.inventoryItem.unitCost.amount
                    );
                    let price = Number(singleProduct.price);
                    let compareAt = Number(singleProduct.compareAtPrice);

                    let disCost = cost / (1 - costDiscount / 100);
                    let disPrice = price / (1 - discount / 100);
                    let disCompareAt = compareAt / (1 - discount / 100);

                    await variantsUpdate(
                      session,
                      productId.id,
                      disCost,
                      disPrice,
                      disCompareAt
                    );

                    campaign.campaignStatus = "Expired";
                    campaign.save();
                    console.log("Update DB worke Done !!  at end=======");
                  }
                })
              );
            })
          );

          console.log("If Condition is work");
          
        }

  } catch (err) {
    console.log("scheduled End Job", err);
  }
};




export const starJob = async (id, session, campaignStart) => {
  let dateOfStart = new Date(campaignStart);

  let startedDate = dateOfStart.toISOString().split("T").shift();
  let startedHour = dateOfStart.getHours();
  let startedMinute = dateOfStart.getMinutes();

  console.log(
    `StartJob ${startedDate} === 3 ${startedMinute} ${startedHour} ${
      startedDate.split("-")[2]
    } ${startedDate.split("-")[1]}`
  );
  try {
    let task = cron.schedule(
      ` 1 ${startedMinute} ${startedHour} ${startedDate.split("-")[2]} ${
        startedDate.split("-")[1]
      } *`,
      async () => {
        let campaign = await db.Campaign.findOne({
          where: {
            storeId: session.id,
            id,
            campaignStatus: "Scheduled",
          },
        });
        console.log(campaign, "schedule Condition First StartJob =======");

        let toDate = new Date();
        let startDate = new Date(campaign.campaignStart);

        let startedDate = startDate.toISOString().split("T").shift();
        let startedHour = startDate.getHours();
        let startedMinute = startDate.getMinutes();

        let toDayDate = toDate.toISOString().split("T").shift();
        let toDateHour = toDate.getHours();
        let toDateMinute = toDate.getMinutes();

        if (
          toDayDate == startedDate &&
          toDateHour == startedHour &&
          toDateMinute == startedMinute
        ) {
          console.log(
            "running a task on Exact scheduleJob [[[",
            campaign.campaignInfo
          );

          let discount;
          let costDiscount;

          await Promise.all(
            campaign.campaignInfo.map(async (ele) => {
              discount = ele.campaignDiscount;
              costDiscount = ele.campaignCostDiscount;

              await Promise.all(
                ele.allVariants.map(async (productId) => {
                  console.log(productId.id, "***********llll*******");

                  if (ele.vendorSelect.includes(`${productId.vendor}`)) {
                    let singleProduct = await getProductVariantByGraphql(
                      session,
                      productId.id
                    );

                    let cost = Number(
                      singleProduct.inventoryItem.unitCost.amount
                    );
                    let price = Number(singleProduct.price);
                    let compareAt = Number(singleProduct.compareAtPrice);

                    console.log(
                      cost,
                      price,
                      compareAt,
                      "======",
                      costDiscount,
                      discount,
                      "productIds>>>>>>>>>>>><<<<<<<<",
                      singleProduct
                    );
                    // let disCost = cost / (1 - costDiscount / 100);
                    // let disPrice = price / (1 - discount / 100);
                    // let disCompareAt = compareAt / (1 - discount / 100);

                    let disCost = cost - cost * (costDiscount / 100);
                    let disPrice = price - price * (discount / 100);
                    let disCompareAt = compareAt - compareAt * (discount / 100);

                    await variantsUpdate(
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
                    console.log("Update DB worke Done !! At StartJob=======");
                  }
                })
              );
            })
          );
        } else {
          console.log("************Again schedule StartJob ****************");
          await startJob(campaign.id, session, campaign.campaignStart);
        }

        console.log(">>>>>>task.stop <<<<<<<");

        task.stop();
      }
    );
  } catch (err) {
    console.log("scheduled StartJob Error", err);
  }
};

export const enJob = async (id, session, campaignEnd) => {
  let dateOfEnd = new Date(campaignEnd);

  let campaignEndDate1 = dateOfEnd.toISOString().split("T").shift();
  let campaignEndHour1 = dateOfEnd.getHours();
  let campaignEndMinute1 = dateOfEnd.getMinutes();

  console.log(
    `endJob ${campaignEndDate1} === 3 ${campaignEndMinute1} ${campaignEndHour1} ${
      campaignEndDate1.split("-")[2]
    } ${campaignEndDate1.split("-")[1]}`
  );
  try {
    let task = cron.schedule(
      ` 3 ${campaignEndMinute1} ${campaignEndHour1} ${
        campaignEndDate1.split("-")[2]
      } ${campaignEndDate1.split("-")[1]} *`,
      async () => {
        let campaign = await db.Campaign.findOne({
          where: {
            storeId: session.id,
            id,
            campaignStatus: "Active",
          },
        });

        console.log(campaign, "schedule Condition First endJob =======");
        let toDate = new Date();
        let endDate = new Date(campaign.campaignEnd);

        let campaignEndDate = endDate.toISOString().split("T").shift();
        let campaignEndHour = endDate.getHours();
        let campaignEndMinute = endDate.getMinutes();

        let toDayDate = toDate.toISOString().split("T").shift();
        let toDateHour = toDate.getHours();
        let toDateMinute = toDate.getMinutes();

        if (
          toDayDate == campaignEndDate &&
          toDateHour == campaignEndHour &&
          toDateMinute == campaignEndMinute
        ) {
          console.log("running a task on Exact scheduled endJob");

          let discount;
          let costDiscount;

          let campaignProducsArr = await getCollectionProductsArr(
            session,
            campaign.campaignInfo
          );

          // console.log("AllData is === ");
          await Promise.all(
            campaignProducsArr.map(async (ele) => {
              discount = ele.discount;
              costDiscount = ele.costDiscount;

              await Promise.all(
                ele.products.map(async (productId) => {
                  let singleProduct = await getProductByGraphql(
                    session,
                    productId.id
                  );

                  console.log(
                    "productIds>>>>>>>>>><<<<<<<<<<<<<<",
                    singleProduct
                  );
                  // let cost = Number(
                  //   singleProduct.inventoryItem.unitCost.amount
                  // );
                  // let price = Number(singleProduct.price);
                  // let compareAt = Number(singleProduct.compareAtPrice);

                  // let disCost = cost / (1 - costDiscount / 100);
                  // let disPrice = price / (1 - discount / 100);
                  // let disCompareAt = compareAt / (1 - discount / 100);

                  // let disCost = cost - cost * (costDiscount / 100);
                  // let disPrice = price - price * (discount / 100);
                  // let disCompareAt = compareAt - compareAt * (discount / 100);

                  // let updatePrductsDiscount = await productsUpdate(
                  //   session,
                  //   productId.id,
                  //   disCost,
                  //   disPrice,
                  //   disCompareAt
                  // );

                  // console.log("Update DB worke at endJob=======");
                  // campaign.campaignStatus = "Expired";
                  // campaign.save();
                  console.log("Update DB worke Done !!  at endJob=======");
                })
              );
            })
          );
        } else {
          console.log("************Again schedule endJob ****************");
          await endJob(campaign.id, session, campaign.campaignEnd);
        }
        console.log(">>>>>>task.stop <<<<<<<");
        task.stop();
      }
    );
  } catch (err) {
    console.log("scheduled End Job", err);
  }
};
