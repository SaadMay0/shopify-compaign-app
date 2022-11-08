import { getCollectionProducts } from "../../../../shopify/rest_api/collection.js";
import { getProductByGraphql } from "../../../../shopify/graphql_api/queryies/products.js";
import { productsUpdate } from "./campaigns.js";
import db from "../../../../db/models/postgres/index.js";
import { getCollectionProductsArr } from "./campaigns.js";
import cron from "node-cron";

// export const scheduleJob = async (
//   session,
//   collectionIds,
//   campaignInfo,
//   campaignTitle
// ) => {
//   try {
//     let task = cron.schedule("1 8 11 * * *", async () => {
//       console.log("running a task every minute Node Crone");
//       let discount;
//       let costDiscount;
//       let campainName;

//       // let allPrductsId = []

//       await Promise.all(
//         collectionIds.map(async (ele) => {
//           campaignInfo.map((e) => {
//             if (e.id == ele.id) {
//               console.log("e.id =======", e, "ele.id=======", ele.id);
//               campainName = campaignTitle;
//               discount = e.campaignDiccount;
//               costDiscount = e.campaignCostDiscount;
//             }
//           });
//           let collectionProducts = await getCollectionProducts(
//             session,
//             ele.id.split("/").pop()
//           );

//           console.log("collectionProducts =====>>>", collectionProducts);
//           await Promise.all(
//             collectionProducts.products.map(async (product) => {
//               console.log(
//                 " products collectionProducts ==== ",
//                 costDiscount,
//                 discount
//               );
//               let singleProduct = await getProductByGraphql(
//                 session,
//                 product.admin_graphql_api_id
//               );

//               let cost = Number(singleProduct.inventoryItem.unitCost.amount);
//               let price = Number(singleProduct.price);
//               let compareAt = Number(singleProduct.compareAtPrice);

//               // if (product.tags?.includes("Campaign")) {
//               //   let value = product.tags.split("/");

//               //   let dis = Number(value[1].split("=").pop());
//               //   let costDis = Number(value[2].split("=").pop());
//               //   let compareDis = Number(value[3].split("=").pop());

//               //   cost = cost + cost * (costDis / 100);
//               //   price = price + price * (dis / 100);
//               //   compareAt = compareAt + compareAt * (compareDis / 100);

//               //   console.log(
//               //     "if condition is pass an d working and value is = ",
//               //     dis,
//               //     typeof dis,
//               //     cost,
//               //     price,
//               //     compareAt
//               //   );
//               // }

//               let disCost = cost - cost * (costDiscount / 100);
//               let disPrice = price - price * (discount / 100);
//               let disCompareAt = compareAt - compareAt * (discount / 100);

//               // console.log(
//               //   // singleProduct,
//               //   "singleProduct",
//               //   disCost,
//               //   disPrice,
//               //   disCompareAt
//               // );

//               let updatePrductsDiscount = await productsUpdate(
//                 session,
//                 product.admin_graphql_api_id,
//                 disCost,
//                 disPrice,
//                 disCompareAt
//               );

//               // let tag = ` ,Campaign title is =${campainName}/D=${discount}/CD=${costDiscount}`;

//               // let addTag = await addTagToProduct(
//               //   session,
//               //   product.id,
//               //   singleProduct.tags + tag,
//               //   tag
//               // );

//               // console.log(updatePrductsDiscount,"***********************");
//               // **********************************************

//               // *******************************************

//               // console.log(data);

//               const result = await db.Campaign.update(
//                 { campaignStatus: "Active" },
//                 {
//                   where: {
//                     storeId: session.id,
//                     campaignName: campaignTitle,
//                   },
//                 }
//               );
//             })
//           );
//         })
//       );
//       task.stop();
//     });

//   } catch (err) {
//     console.log("scheduleJob Error", err);
//   }
// };

// export const schedule2Job = async (
//   session,
//   collectionIds,
//   campaignInfo,
//   campaignTitle
// ) => {
//   try {
//     let task = cron.schedule("1 39 23 * * *", async () => {
//       console.log("running a task every minute Node Crone");
//       let discount;
//       let costDiscount;
//       let campainName;
//       await Promise.all(
//         collectionIds.map(async (ele) => {
//           campaignInfo.map((e) => {
//             if (e.id == ele.id) {
//               console.log("e.id =======", e, "ele.id=======", ele.id);
//               campainName = campaignTitle;
//               discount = e.campaignDiccount;
//               costDiscount = e.campaignCostDiscount;
//             }
//           });
//           let collectionProducts = await getCollectionProducts(
//             session,
//             ele.id.split("/").pop()
//           );

//           console.log("collectionProducts =====>>>", collectionProducts);
//           await Promise.all(
//             collectionProducts.products.map(async (product) => {
//               console.log(
//                 " products collectionProducts ==== ",
//                 costDiscount,
//                 discount
//               );
//               let singleProduct = await getProductByGraphql(
//                 session,
//                 product.admin_graphql_api_id
//               );

//               let cost = Number(singleProduct.inventoryItem.unitCost.amount);
//               let price = Number(singleProduct.price);
//               let compareAt = Number(singleProduct.compareAtPrice);

//               // if (product.tags?.includes("Campaign")) {
//               //   let value = product.tags.split("/");

//               //   let dis = Number(value[1].split("=").pop());
//               //   let costDis = Number(value[2].split("=").pop());
//               //   let compareDis = Number(value[3].split("=").pop());

//               //   cost = cost + cost * (costDis / 100);
//               //   price = price + price * (dis / 100);
//               //   compareAt = compareAt + compareAt * (compareDis / 100);

//               //   console.log(
//               //     "if condition is pass an d working and value is = ",
//               //     dis,
//               //     typeof dis,
//               //     cost,
//               //     price,
//               //     compareAt
//               //   );
//               // }

//               let disCost = cost / (1 - costDiscount / 100);
//               let disPrice = price / (1 - discount / 100);
//               let disCompareAt = compareAt / (1 - discount / 100);

//               console.log(
//                 disCost,
//                 "singleProduct",
//                 costDiscount,
//                 cost
//                 // disCompareAt
//               );

//               let updatePrductsDiscount = await productsUpdate(
//                 session,
//                 product.admin_graphql_api_id,
//                 disCost,
//                 disPrice,
//                 disCompareAt
//               );

//               // let tag = ` ,Campaign title is =${campainName}/D=${discount}/CD=${costDiscount}`;

//               // let addTag = await addTagToProduct(
//               //   session,
//               //   product.id,
//               //   singleProduct.tags + tag,
//               //   tag
//               // );

//               // console.log(updatePrductsDiscount,"***********************");
//               // **********************************************

//               // *******************************************

//               // console.log(data);
//               const result = await db.Campaign.update(
//                 { campaignStatus: "Expired" },
//                 {
//                   where: {
//                     storeId: session.id,
//                     campaignName: campaignTitle,
//                   },
//                 }
//               );
//             })
//           );
//         })
//       );
//       task.stop();
//     });
//   } catch (err) {
//     console.log("schedule2Job Error", err);
//   }
// };

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
    // let task = cron.schedule(
    //   ` 3 ${campaignEndMinute} ${hour} ${time[2]} ${time[1]} *`,
    //   async () => {
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


    //   task.stop();
    // });
  } catch (err) {
    console.log("schedule2Job Error", err);
  }
};
/**
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
              let disPrice = price / (1 - discount / 100);
              let disCompareAt = compareAt / (1 - discount / 100);

              console.log(
                disCost,
                "singleProduct",
                costDiscount,
                cost
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
 */
