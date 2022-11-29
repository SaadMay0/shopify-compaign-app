import { Shopify } from "@shopify/shopify-api";
import { Product } from "@shopify/shopify-api/dist/rest-resources/2022-10/index.js";


// Product

export const getAllProducts = async (session) => {
  try {
    return await Product.all({
      limit:250,
      session: session,
    });
  } catch (err) {
    console.log(` Catch Error of Get All Products = ${err.name}`,err);
  }
};

export const getProduct = async (session,id) => {
  try {
    return await Product.find({
      session: session,
      id: id,
    });
  } catch (err) {
    console.log(` Catch Error of Get Product = ${err.name}`, err);
  }
};


export const addTagToProduct = async (session,id, tag) => {
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
    console.log(` Catch Error of get All Collection Products = ${err.name}`, err);
  }
};

export const getProductCount = async (session, collectionId) => {
  try {
    return await Product.all({
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


    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
//     const body = {
  
// };
// Use `client.post` to send your request to the specified Shopify REST API endpoint.
let data = await client.get({
  path: `products.json?limit=1&collection_id=${collectionId}`,
  // data: body,
  // type: DataType.JSON,
})
    
    console.log(data, "==============getCollectionProductByClint==========");

    // return await Product.all({
    //   session: session,
    //   collection_id: collectionId,
    // });
  } catch (err) {
    console.log(` Catch Error of Get All Products By Clint = ${err.name}`, err);
  }
};