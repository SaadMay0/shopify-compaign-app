import {Shopify} from "@shopify/shopify-api";

export const variantsUpdate = async (session, cost,price,compareAtPrice) => {
  try {
    const client = new Shopify.Clients.Graphql(
      session.shop,
      session.accessToken
    );

    const data = await client.query({
      data: {
        query: `mutation productVariantUpdate($input: ProductVariantInput!) {
      productVariantUpdate(input: $input) {
        productVariant {
          id
          title
          inventoryPolicy
          inventoryQuantity
          inventoryItem: {
            cost
            tracked
          },
          price
          compareAtPrice
        }
        userErrors {
          field
          message
        }
      }
    }`,
        variables: {
          input: {
            id: "gid://shopify/ProductVariant/43729076",
            inventoryItem: {
              cost: cost,
              tracked: true,
            },
            price: price,
            compareAtPrice: compareAtPrice || " ",
          },
        },
      },
    });

    return data;
  } catch (err) {
    console.log(` Catch Error ofvariantsUpdate = ${err.name}`, err);
  }
};

let productUpdate_mutation = `mutation productUpdate($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
      id
      title
    }
    userErrors {
      field
      message
    }
  }
}`;


export const productsUpdate = async (session,id, cost, price, compareAtPrice) => {
    try {
        console.log(session.shop, session.accessToken ,"----");
         const client = new Shopify.Clients.Graphql(
           `${session.shop}`,
           session.accessToken
         );
        
        const data = await client.query({
          data: {
            query: productUpdate_mutation,
            variables: {
              input: {
                id: id,

                variants: [
                  {
                    compareAtPrice: compareAtPrice,
                    inventoryItem: {
                      cost: cost,
                      tracked: true,
                    },
                    price: price,
                  },
                ],
              },
            },
          },

          // }
        });

        return data;
    } catch (err) {
        console.log(
          ` Catch Error of productsUpdate = ${err.name}`,
          err,
        //   err.response.errors.locations
        );
    }
}

import { getCollectionProducts } from "../../../../shopify/rest_api/collection.js"

export const getCollectionProductsArr = async (session, campaignInfo) => {
  try {
    let allData = [];

    await Promise.all(
      campaignInfo.map(async (ele) => {
        console.log("campaignInfo === ", ele.id);
        let discount = ele.campaignDiccount;
        let costDiscount = ele.campaignCostDiscount;
        let vendors = ele.vendorsSlect;
        let allProducts = [];

        let collectionProducts = await getCollectionProducts(
          session,
          ele.id.split("/").pop()
        );

        await Promise.all(
          collectionProducts.products.map(async (product) => {
            vendors.filter((vender) => {
              console.log(vender, product.vendor);
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

        allData.push(obj1);
      })
    );
    return allData;
  } catch (err) {
    console.log("getCollectionProductsArr Error ", err);
  }
};

