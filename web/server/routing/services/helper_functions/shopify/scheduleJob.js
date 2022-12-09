import {
  getProductVariantByGraphql,
} from "../../../../shopify/graphql_api/queryies/products.js";
import {
  variantsUpdate,
} from "../../../../shopify/graphql_api/mutations/products.js";
import db from "../../../../db/models/postgres/index.js";
import cron from "node-cron";
import moment from "moment";

export const startJob = async (session, id, campaignStart) => {
  let dateOfStart = new Date(campaignStart);

  let dd = moment(new Date(campaignStart), "YYYY-MM-DD hh:mm:ss a").date()

  // console.log(dateOfStart.toJSON(), ":;;;;;;;;;;", dd);

  let startedDate = dateOfStart.toISOString().split("T").shift();
  let startedHour = dateOfStart.getHours();
  let startedMinute = dateOfStart.getMinutes();

  console.log(
    `StartJob ${startedDate} === 3 ${startedMinute} ${startedHour} ${
      dd
    } ${startedDate.split("-")[1]}`
  );
  try {
    let task = cron.schedule(
      ` 1 ${startedMinute} ${startedHour} ${dd} ${
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

          for (let ele of campaign.campaignInfo) {
            console.log(
              "$$$$$$$$$$$$$$ Get Next Collection Of campaign  $$$$$$$$$$$$$$$$$$$"
            );
            discount = ele.campaignDiscount;
            costDiscount = ele.campaignCostDiscount;
            for (let productId of ele.selectesVariants) {
              // console.log(
              //   "$$$$$$$$$$$$$$ Get Next Variant Of Collection  $$$$$$$$$$$$$$$$$$$",
              //   productId.Name
              // );

              let singleProduct = await getProductVariantByGraphql(
                session,
                productId.id
              );
              let price = Number(singleProduct.price);
              let compareAt = Number(singleProduct.compareAtPrice || price);
              let cost = Number(
                singleProduct.inventoryItem?.unitCost?.amount || price
              );

              let disCost = cost - cost * (costDiscount / 100);
              let disPrice = price - price * (discount / 100);
              let disCompareAt = compareAt - compareAt * (discount / 100);

              let result = await variantsUpdate(
                session,
                productId.id,
                disCost,
                disPrice,
                disCompareAt
              );
              // console.log("Update result 111 ", !result);

              if (result) {
                console.log(
                  "*********************************Whanted to update StartJob ***********************************************"
                );
              }
              // console.log("Update result 222 ");
            }
          }

          campaign.campaignStatus = "Active";
          campaign.save();
          console.log("Update DB worke Done !! At StartJob=======");
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

export const endJob = async (session, id, campaignEnd) => {
  let dateOfEnd = new Date(campaignEnd);

  let dd = moment(new Date(campaignEnd), "YYYY-MM-DD hh:mm:ss a").date();

  let campaignEndDate1 = dateOfEnd.toISOString().split("T").shift();
  let campaignEndHour1 = dateOfEnd.getHours();
  let campaignEndMinute1 = dateOfEnd.getMinutes();

  console.log(
    `endJob ${campaignEndDate1} === 3 ${campaignEndMinute1} ${campaignEndHour1} ${
      dd
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

          for (let ele of campaign.campaignInfo) {
            console.log(
              "$$$$$$$$$$$$$$ Get Next Collection Of campaign  $$$$$$$$$$$$$$$$$$$"
            );
            discount = ele.campaignDiscount;
            costDiscount = ele.campaignCostDiscount;
            for (let productId of ele.selectesVariants) {
              // console.log(
              //   "$$$$$$$$$$$$$$ Get Next Variant Of Collection  $$$$$$$$$$$$$$$$$$$",
              //   productId.Name
              // );

              let singleProduct = await getProductVariantByGraphql(
                session,
                productId.id
              );
              let price = Number(singleProduct.price);
              let compareAt = Number(singleProduct.compareAtPrice || price);
              let cost = Number(
                singleProduct.inventoryItem?.unitCost?.amount || price
              );

              let disCost = cost / (1 - costDiscount / 100);
              let disPrice = price / (1 - discount / 100);
              let disCompareAt = compareAt / (1 - discount / 100);

              let result = await variantsUpdate(
                session,
                productId.id,
                disCost,
                disPrice,
                disCompareAt
              );
              // console.log("Update result 111 ", !result);

              if (result) {
                console.log(
                  "*********************************Whanted to update endJob ***********************************************"
                );
              }
              // console.log("Update result 222 ");
            }
          }
          campaign.campaignStatus = "Expired";
          campaign.save();
          console.log("Update DB worke Done !!  at endJob=======");
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



export const start = async (session, id) => {
  try {
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

    for (let ele of campaign.campaignInfo) {
      console.log(
        "$$$$$$$$$$$$$$ Get Next Collection Of campaign  $$$$$$$$$$$$$$$$$$$"
      );
      discount = ele.campaignDiscount;
      costDiscount = ele.campaignCostDiscount;
      for (let productId of ele.selectesVariants) {
        // console.log(
        //   "$$$$$$$$$$$$$$ Get Next Variant Of Collection  $$$$$$$$$$$$$$$$$$$",
        //   productId.Name
        // );

        let singleProduct = await getProductVariantByGraphql(
          session,
          productId.id
        );
        let price = Number(singleProduct.price);
        let compareAt = Number(singleProduct.compareAtPrice || price);
        let cost = Number(
          singleProduct.inventoryItem?.unitCost?.amount || price
        );

        let disCost = cost - cost * (costDiscount / 100);
        let disPrice = price - price * (discount / 100);
        let disCompareAt = compareAt - compareAt * (discount / 100);

        let result = await variantsUpdate(
          session,
          productId.id,
          disCost,
          disPrice,
          disCompareAt
        );
        // console.log("Update result 111 ", !result);

        if (result) {
          console.log(
            "*********************************Whanted to update Start ***********************************************"
          );
        }
        // console.log("Update result 222 ");
      }
    }

    campaign.campaignStatus = "Active";
    campaign.save();
    console.log("Update DB worke Done !! At StartJob=======");
  } catch (err) {
    console.log("scheduled Start Error", err);
  }
};



export const end = async (session, id) => {

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

     for (let ele of campaign.campaignInfo) {
       console.log(
         "$$$$$$$$$$$$$$ Get Next Collection Of campaign  $$$$$$$$$$$$$$$$$$$"
       );
       discount = ele.campaignDiscount;
       costDiscount = ele.campaignCostDiscount;
       for (let productId of ele.selectesVariants) {
         // console.log(
         //   "$$$$$$$$$$$$$$ Get Next Variant Of Collection  $$$$$$$$$$$$$$$$$$$",
         //   productId.Name
         // );

         let singleProduct = await getProductVariantByGraphql(
           session,
           productId.id
         );
         let price = Number(singleProduct.price);
         let compareAt = Number(singleProduct.compareAtPrice || price);
         let cost = Number(
           singleProduct.inventoryItem?.unitCost?.amount || price
         );

         let disCost = cost / (1 - costDiscount / 100);
         let disPrice = price / (1 - discount / 100);
         let disCompareAt = compareAt / (1 - discount / 100);

         let result = await variantsUpdate(
           session,
           productId.id,
           disCost,
           disPrice,
           disCompareAt
         );
         // console.log("Update result 111 ", !result);

         if (result) {
           console.log(
             "*********************************Whanted to update End ***********************************************"
           );
         }
         // console.log("Update result 222 ");
       }
     }
     campaign.campaignStatus = "Expired";
     campaign.save();
     console.log("Update DB worke Done !!  at End=======");
    }
  } catch (err) {
    console.log("scheduled End Job", err);
  }
}; 