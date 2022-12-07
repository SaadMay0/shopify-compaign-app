
import { Shopify } from "@shopify/shopify-api";

export const getProductByGraphql = async (session, id) => {
  console.log("getProduct is working GraphQl");
  try {
    console.log(session.shop, session.accessToken, "----");
    const client = new Shopify.Clients.Graphql(
      `${session.shop}`,
      session.accessToken
    );

    const data = await client.query({
      data: `query {
    product(id: "${id}") {
      title
      variants(first: 5) {
        edges {
          node {
            displayName
            id
            price
            compareAtPrice
            inventoryItem {
            unitCost {
             amount
             currencyCode
            }
            tracked
           }
          }
        }
      }
    }
  }`,
    });

    //   console.log(data.body.data.product.variants.edges[0].node, "Data is here");
    if (data.body.data) {
      return data.body.data.product.variants.edges[0].node;
    } else {
      return data;
    }
  } catch (err) {
    console.log(
      ` Catch Error of get products Graphql  = ${err.name}`,
      //   err
      err.response.errors
    );
  }
};


export const getProductVariantByGraphql = async (session, id) => {
  console.log("getProductVariantByGraphql is working GraphQl");
  try {
    const client = new Shopify.Clients.Graphql(
      `${session.shop}`,
      session.accessToken
    );

    const data = await client.query({
      data: `query {
    productVariant(id: "${id}") {
      id
      title
      displayName
      price
      compareAtPrice
      inventoryItem {
          unitCost {
            amount
            currencyCode
          }
          tracked
        }
    }
  }`,
    });

      // console.log(
      //   data.body.extensions.cost.throttleStatus.currentlyAvailable,
      //   "Data is here"
      // );
    if (data.body.data) {
      return data.body.data.productVariant;
    } else {
      return data;
    } 
  } catch (err) {
    console.log(
      ` Catch Error of get products Graphql  = ${err.name}`,
      //   err
      err.response.errors
    );
  }
};