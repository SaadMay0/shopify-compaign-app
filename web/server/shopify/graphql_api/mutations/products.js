import { Shopify } from "@shopify/shopify-api";

export const variantsUpdate = async (
  session,
  id,
  cost,
  price,
  compareAtPrice
) => {
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
          inventoryItem {
            unitCost {
          amount,
        },
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
            id: id,
            inventoryItem: {
              // unitCost: {
              //   amount: cost,
              // },
              cost: cost,
              tracked: true,
            },
            price: price,
            compareAtPrice: compareAtPrice || " ",
          },
        },
      },
    });
    // console.log(data.response);
    return data;
  } catch (err) {
    console.log(` Catch Error ofvariantsUpdate = ${err.name}`, err.response);
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

export const productsUpdate = async (
  session,
  id,
  cost,
  price,
  compareAtPrice
) => {
  try {
    console.log(session.shop, session.accessToken, "----");
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
      err
      //   err.response.errors.locations
    );
  }
};
