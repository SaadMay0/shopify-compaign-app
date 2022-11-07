// import { Shopify } from "@shopify/shopify-api";
import { Product } from "@shopify/shopify-api/dist/rest-resources/2022-10/index.js";


// Product

export const getAllProducts = async (session) => {
  try {
    return await Product.all({
      // limit:1,
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