import { getCollectionProducts } from "../../../../shopify/rest_api/collection.js"

export const getCollectionProductsArr = async (session, campaignInfo) => {
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

