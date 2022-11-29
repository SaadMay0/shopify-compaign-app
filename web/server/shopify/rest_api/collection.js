import { Collection } from "@shopify/shopify-api/dist/rest-resources/2022-10/index.js";
import "colors"

export const getCollectionProducts = async (session, id) => {
    try {
      console.log("getCollectionProduct Function id".yellow,id);
      return await Collection.products({
      limit : 250,
      session: session,
        id: id,
      
    });
  } catch (err) {
    console.log(`Catch Error of getCollectionProduct = ${err.name}`, err);
  }
};