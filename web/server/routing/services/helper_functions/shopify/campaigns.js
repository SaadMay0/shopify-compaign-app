import { getCollectionProducts } from "../../../../shopify/rest_api/collection.js";
import { getProductVariantByGraphql } from "../../../../shopify/graphql_api/queryies/products.js";
import { variantsUpdate } from "../../../../shopify/graphql_api/mutations/products.js";
import db from "../../../../db/models/postgres/index.js";

export const getCollectionProductsArr = async (session, id) => {
  try {
    let allData = [];

    await Promise.all(
      campaignInfo.map(async (ele) => {
        let discount = ele.campaignDiscount;
        let costDiscount = ele.campaignCostDiscount;
        let vendors = ele.vendorsSelect;
        let allProducts = [];

        let collectionProducts = await getCollectionProducts(
          session,
          ele.id.split("/").pop()
        );

        await Promise.all(
          collectionProducts.products.map(async (product) => {
            vendors.filter((vender) => {
              if (vender == product.vendor) {
                allProducts.push({
                  id: product.admin_graphql_api_id,
                });
              }
            });
          })
        );
        let uniqueProductsArr = [...new Set(allProducts)];

        let obj1 = {
          discount,
          costDiscount,
          vendors,
          products: uniqueProductsArr,
        };

        console.log("Arr of Product Created");

        allData.push(obj1);
      })
    );
    return allData;
  } catch (err) {
    console.log("getCollectionProductsArr Error ", err);
  }
};

export const updateCampaignInfoArr = async (session, id) => {
  try {
    const [campaign, created] = await db.Campaign.findOrCreate({
      where: {
        storeId: session.id,
        id,
      },
      defaults: {},
    });

    let updatedCampaignInfo = [];

    for (let ele of campaign.campaignInfo) {
      console.log(
        "$$$$$$$$$$$$$$ Get Next Collection Of campaign for update CampaignInfo $$$$$$$$$$$$$$$$$$$"
      );
      let variantsValueUpdate = [];
      for (let productId of ele.selectesVariants) {
        // console.log( "selectesVariants****");
        let singleProduct = await getProductVariantByGraphql(
          session,
          productId.id
        );

        let price = Number(singleProduct.price);
        let compareAt = Number(singleProduct.compareAtPrice || price);
        let cost = Number(
          singleProduct.inventoryItem?.unitCost?.amount || price
        );

        let obj = {
          ...productId,
          price,
          compareAt,
          cost,
        };

        console.log(obj, "-------obj is now");

        variantsValueUpdate.push(obj);
      }

      let ob1 = {
        ...ele,
        selectesVariants: variantsValueUpdate,
      };
      updatedCampaignInfo.push(ob1);
    }
    console.log("updatedCampaignInfo is ====>");

    if (!created) {
      // campaign.campaignInfo = JSON.parse(JSON.stringify(updatedCampaignInfo));
      campaign.campaignInfo = updatedCampaignInfo;
      campaign.campaignMessage = "Updated campaignInfo";
      await campaign.save();
      console.log(
        "updatedCampaignInfo in db DB worke Done !! At StartJob======="
      );
    }
    return true;
  } catch (err) {
    console.log("Catch Error updateSelecetedVariantsArr ", err);
  }
};

export const updateProductPricesInShoify = async (session, id) => {
  try {
    const [campaign, created] = await db.Campaign.findOrCreate({
      where: {
        storeId: session.id,
        id,
        campaignMessage: "Updated campaignInfo",
      },
      defaults: {},
    });

    // console.log("^^^^^^^^^^^^^^^^^",campaign);

    if (campaign) {
      console.log(
        "Updated campaignInfo Found Know Update Product prices===----"
      );
      let discount;
      let costDiscount;
      for (let ele of campaign.campaignInfo) {
        console.log(
          "$$$$$$$$$$$$$$ Get Next Collection Of campaign for variants Update $$$$$$$$$$$$$$$$$$$"
        );
        discount = ele.campaignDiscount;
        costDiscount = ele.campaignCostDiscount;
        for (let productId of ele.selectesVariants) {
          // console.log(productId,"^^^^^^^");
          const { price, compareAt, cost, Name } = productId;

          // console.log(
          //   price,
          //   compareAt,
          //   cost,
          //   Name,
          //   "[[[[[[][[[[[[[[[[[[[[[[[[[[[["
          // );
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

          console.log("Result is ======>>>>", result);
        }
      }
      if (!created) {
        campaign.campaignStatus = "Active";
        campaign.isCampaignStart = false;
        campaign.campaignMessage = "gracefully updated the price in Shopify";
        await campaign.save();
      }
      console.log(
        "updateProductPricesInShoify in db DB worke Done !! At StartJob======="
      );
      return true;
    } else {
      console.log(
        "updateProductPricesInShoify  not work due to campaignInfo Not Updated======="
      );

      campaign.campaignStatus = "Failed";
      campaign.isCampaignStart = false;
      campaign.campaignMessage =
        "It cannot be able to update the price on Shopify due to some reason, ";
      await campaign.save();
    }
  } catch (err) {
    console.log("Catch Error updateProductPricesInShoify ", err);
  }
};

export const setDefaultProductPricesInShoify = async (session, id) => {
  try {
    const [campaign, created] = await db.Campaign.findOrCreate({
      where: {
        storeId: session.id,
        id,
        campaignMessage: "gracefully updated the price in Shopify",
        campaignStatus: "Active",
      },
      defaults: {},
    });

    if (campaign) {
      if (!created) {
        campaign.isCampaignStart = true;
        await campaign.save();
      }
      for (let ele of campaign.campaignInfo) {
        console.log(
          "$$$$$$$$$$$$$$ Get Next Collection Of campaign for variants Update $$$$$$$$$$$$$$$$$$$"
        );
        for (let productId of ele.selectesVariants) {
          // console.log(productId,"^^^^^^^");
          const { id, price, compareAt, cost, Name } = productId;

          // console.log(
          //   price,
          //   compareAt,
          //   cost,
          //   Name,
          //   "[[[[[[][[[[[[[[[[[[[[[[[[[[[["
          // );

          let result = await variantsUpdate(
            session,
            id,
            cost,
            price,
            compareAt
          );

          console.log(
            "Result of setDefaultProductPricesInShoify is ======>>>>",
            result
          );
        }
      }
      if (!created) {
        campaign.campaignStatus = "Expired";
        campaign.isCampaignStart = false;
        (campaign.campaignMessage =
          "gracefully updated default price in Shopify"),
          await campaign.save();
      }
      console.log(
        "setDefaultProductPricesInShoify in db DB worke Done !! At StartJob======="
      );
      return true;
    } else {
      //  if (!created) {
      //    campaign.campaignMessage =
      //      "unable to set default price in Shopify due to some reasons.";
      //    await campaign.save();
      //  }

      console.log(
        "********** setDefaultProductPricesInShoify else Part Working *********"
      );
    }
  } catch (err) {
    console.log("Catch Error setDefaultProductPricesInShoify ", err);
  }
};

export const setDefaultProductPricesOfAllCampaign = async (session) => {
  try {
    const campaign = await db.Campaign.findAll({
      where: {
        storeId: session.id,
        campaignStatus: "Active",
        campaignMessage: "gracefully updated the price in Shopify",
      },
    });

    console.log("campaign========>", campaign[0].id);

    if (campaign.length == 0) return false;

    for (let items of campaign) {
      console.log("********** Get Next Campaign *********");
      await db.Campaign.update(
        {
          isCampaignStart: true,
        },
        {
          where: {
            storeId: items.storeId,
            id: items.id,
          },
        }
      );
      for (let ele of items.campaignInfo) {
        console.log(
          "$$$$$$$$$$$$$$ Get Next Collection Of campaign for variants Update $$$$$$$$$$$$$$$$$$$"
        );
        for (let productId of ele.selectesVariants) {
          // console.log(productId,"^^^^^^^");
          const { id, price, compareAt, cost, Name } = productId;

          // console.log(
          //   price,
          //   compareAt,
          //   cost,
          //   Name,
          //   "[[[[[[][[[[[[[[[[[[[[[[[[[[[["
          // );

          let result = await variantsUpdate(
            session,
            id,
            cost,
            price,
            compareAt
          );

          console.log(
            "Result of setDefaultProductPricesOfAllCampaign is ======>>>>",
            result,
            ele,
            ele.id,
            ele.storeId
          );

          console.log("Updated campaign status");
        }
      }

      await db.Campaign.update(
        {
          campaignStatus: "Expired",
          campaignMessage: "gracefully updated default price in Shopify",
          isCampaignStart: false,
        },
        {
          where: {
            storeId: items.storeId,
            id: items.id,
            campaignMessage: "gracefully updated the price in Shopify",
            campaignStatus: "Active",
          },
        }
      );
    }
    console.log(
      "setDefaultProductPricesOfAllCampaign in db DB worke Done !! At StartJob======="
    );

    return true;
  } catch (err) {
    console.log("Catch Error setDefaultProductPricesOfAllCampaign ", err);
  }
};
