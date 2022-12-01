import { Shopify } from "@shopify/shopify-api";
import { Product } from "@shopify/shopify-api/dist/rest-resources/2022-10/index.js";

// Product

export const getAllProducts = async (session) => {
  try {
    return await Product.all({
      limit: 250,
      session: session,
    });
  } catch (err) {
    console.log(` Catch Error of Get All Products = ${err.name}`, err);
  }
};

export const getProduct = async (session, id) => {
  try {
    return await Product.find({
      session: session,
      id: id,
    });
  } catch (err) {
    console.log(` Catch Error of Get Product = ${err.name}`, err);
  }
};

export const addTagToProduct = async (session, id, tag) => {
  try {
    // let allTag = tag
    console.log("addTagToProduct****", tag);

    const product = new Product({ session: session });
    product.id = id;
    product.tags = tag;
    return await product.save({
      update: true,
    });
  } catch (err) {
    console.log(` Catch Error of add Tag To Product = ${err.name}`, err);
  }
};

export const getAllCollectionProducts = async (session, collectionId) => {
  try {
    return await Product.all({
      limit: 250,
      session: session,
      collection_id: collectionId,
    });
  } catch (err) {
    console.log(
      ` Catch Error of get All Collection Products = ${err.name}`,
      err
    );
  }
};

export const getCollectionProductsCount = async (session, collectionId) => {
  try {
    return await Product.count({
      session: session,
      collection_id: collectionId,
    });
  } catch (err) {
    console.log(` Catch Error of Get All Products Count = ${err.name}`, err);
  }
};

export const getCollectionProductByClint = async (session, collectionId) => {
  try {
    console.log("getCollectionProductByClint Is working**************");
    let limit = 250;
    let allVariants = [];
    let vendor = [];
    let vendorSelect = [];
    let productCount = await Product.count({
      session: session,
      collection_id: collectionId,
    });

    const { count } = productCount;

    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    let makeRequest = Math.ceil(count / limit);

    console.log(
      "Product Count iS =",
      count,
      "Make Request for products",
      makeRequest
    );
    let nextPage = {
      collection_id: collectionId,
      limit: limit,
    };

    //  let allVariants = [];

    for (let index = 0; index < makeRequest; index++) {
      console.log("Next Page");

      let otherProducts = await client.get({
        path: `products`,
        query: nextPage,
      });

      nextPage = otherProducts?.pageInfo?.nextPage?.query || {
        limit: limit,
      };

      otherProducts.body.products.map(async (ele) => {
        ele.variants.map((variants) => {
          allVariants.push({
            Name: ele.title,
            id: variants.admin_graphql_api_id,
            vendor: ele.vendor,
          });
        });

        if (!vendorSelect.includes(`${ele.vendor}`)) {
          vendor.push({
            value: `${ele.vendor}`,
            label: `${ele.vendor}`,
          });
          vendorSelect.push(`${ele.vendor}`);
        }
      });
    }

    console.log(
      allVariants.length,
      "****************allVariants************"
      // });
      // new Set([...allVariants])
    );
    // allVariants = new Set([...allVariants]);
    return { allVariants, vendor, vendorSelect };
  } catch (err) { 
    console.log(` Catch Error of Get All Products By Clint = ${err.name}`, err);
  }
};

export const getAllCollectionesProductsCount = async (
  session,
  campaignInfo
) => {
  try {
    console.log(" getAllCollectionesProductsCount Is working");

    let productCounts = 0;
    await Promise.all(
      campaignInfo.map(async (ele) => {
        let count = await getCollectionProductsCount(
          session,
          ele.id.split("/").pop()
        );

        productCounts = productCounts + Number(count.count);

        //  console.log(count, "count====", productCounts);
      })
    );

    return productCounts;
  } catch (err) {
    console.log(
      ` Catch Error of Get All Collectiones Products Count = ${err.name}`,
      err
    );
  }
};
