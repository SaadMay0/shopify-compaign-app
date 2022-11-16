import { getProductByGraphql } from "../../../../shopify/graphql_api/queryies/products.js";
import { productsUpdate } from "../../../../shopify/graphql_api/mutations/products.js";
import db from "../../../../db/models/postgres/index.js";
import { getCollectionProductsArr } from "./campaigns.js";
import cron from "node-cron";
// import moment from "moment";

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
        console.log("running a task every schedule2Job", campaign);

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

                console.log("Campaign ****************");

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

export const testjobs = async (id, session, campaignStart) => {
  let dateOfStart = new Date(campaignStart);

  let startedDate = dateOfStart.toISOString().split("T").shift();
  let startedHour = dateOfStart.getHours();
  let startedMinute = dateOfStart.getMinutes();

  console.log(
    
    `=== 3 ${startedMinute} ${startedHour} ${startedDate[2]} ${startedDate[1]}`
  );
  let campaign = await db.Campaign.findOne({
    where: {
      storeId: session.id,
      id,
      campaignStatus: "Scheduled",
    },
  });

  let toDate = new Date();
  let startDate = new Date(campaign.campaignStart);

  // let startedDate = startDate.toISOString().split("T").shift();
  // let startedHour = startDate.getHours();
  // let startedMinute = startDate.getMinutes();

  let toDayDate = toDate.toISOString().split("T").shift();
  let toDateHour = toDate.getHours();
  let toDateMinute = toDate.getMinutes();
  // console.log(
  //   startedDate,
  //   startedHour,
  //   startedMinute,
  //   "************startDate***********",
  //   toDayDate,
  //   toDateHour,
  //   toDateMinute,
  //   "===========",
  //   toDayDate == startedDate,
  //   toDateHour == startedHour,
  //   toDateMinute == startedMinute
  // );
  if (
    toDayDate == startedDate &&
    toDateHour == startedHour &&
    toDateMinute == startedMinute
  ) {
    console.log("running a task on Exact scheduleJob", campaign);

    let discount;
    let costDiscount;

    let campaignProducsArr = await getCollectionProductsArr(
      session,
      campaign.campaignInfo
    );

    console.log("AllData is === ");
    await Promise.all(
      campaignProducsArr.map(async (ele) => {
        discount = ele.discount;
        costDiscount = ele.costDiscount;

        await Promise.all(
          ele.products.map(async (productId) => {
            console.log( "productIds======");

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
  } else {
    console.log("************Again schedule ****************");
    testjobs(campaign.id, campaign.storeId, campaign.campaignStart);
  }


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
      ` 3 ${startedMinute} ${startedHour} ${startedDate.split("-")[2]} ${
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
        console.log(campaign,"schedule Condition First StartJob =======");

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
          console.log("running a task on Exact scheduleJob", campaign);

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
                  // console.log("productIds======");

                  let singleProduct = await getProductByGraphql(
                    session,
                    productId.id
                  );
                  let cost = Number(
                    singleProduct.inventoryItem.unitCost.amount
                  );
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

                  // console.log("Update DB worke=======");

                  // console.log("Campaign ****************");

                  campaign.campaignStatus = "Active";
                  campaign.save();
                  console.log("Update DB worke Done !! At StartJob=======");
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
      ` 3 ${campaignEndMinute1} ${campaignEndHour1} ${campaignEndDate1.split("-")[2]} ${
        campaignEndDate1.split("-")[1]
      } *`,
      async () => {
        
        let campaign = await db.Campaign.findOne({
          where: {
            storeId: session.id,
            id,
            campaignStatus: "Active",
          },
        });
        
        console.log(campaign,"schedule Condition First endJob =======");
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
          console.log("running a task on Exact scheduled endJob",);

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
                  // console.log("productIds======");

                  let singleProduct = await getProductByGraphql(
                    session,
                    productId.id
                  );
                  let cost = Number(
                    singleProduct.inventoryItem.unitCost.amount
                  );
                  let price = Number(singleProduct.price);
                  let compareAt = Number(singleProduct.compareAtPrice);

                  let disCost = cost / (1 - costDiscount / 100);
                  let disPrice = price / (1 - discount / 100);
                  let disCompareAt = compareAt / (1 - discount / 100);
                  // let disCost = cost - cost * (costDiscount / 100);
                  // let disPrice = price - price * (discount / 100);
                  // let disCompareAt = compareAt - compareAt * (discount / 100);

                  let updatePrductsDiscount = await productsUpdate(
                    session,
                    productId.id,
                    disCost,
                    disPrice,
                    disCompareAt
                  );

                  // console.log("Update DB worke at endJob=======");
                  campaign.campaignStatus = "Expired";
                  campaign.save();
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

