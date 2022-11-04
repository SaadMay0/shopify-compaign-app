import { Shopify } from "@shopify/shopify-api";
import db from "../../../db/models/postgres/index.js";
import { getCollectionProducts } from "../../../shopify/rest_api/collection.js";
import "colors";

export const getCompaignInfo = async (req, res) => {
  console.log("===> compaign/getCollectionProducts its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { collectionIds } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    await Promise.all(
      collectionIds.map(async (ele) => {
        let vendor = [];
        let vendorSlect = [];
        let collectionProducts = await getCollectionProducts(
          session,
          ele.id.split("/").pop()
        );
        await Promise.all(
          collectionProducts.products.map(async (ele) => {
            console.log(ele, "====");
            vendor.push({ value: `${ele.vendor}`, label: `${ele.vendor}` });
            vendorSlect.push(ele.vendor);
          })
        );
        let uniqueVendorsOption = [...new Set(vendor)];
        let uniqueVendorSlect = [...new Set(vendorSlect)];

        let obj = {
          id: ele.id,
          image: ele.image ? ele.image.originalSrc : null,
          title: ele.title,
          compaignQuantity: 1,
          compaignCostDiscount: 0,
          // compaignCostDiscount,
          compaignDiccount: 0,
          vendorsOptions: uniqueVendorsOption,
          vendorsSlect: uniqueVendorSlect,
          popoverActive: false,
        };
        Data.push(obj);
      })
    );
    Status = 200;
    Message = "Get Compain Info Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("getCompaignInfo", err);
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }

  res.status(200).send({
    Response: {
      Data,
      Status,
      Message,
      Err,
    },
  });
};

export const newCompaigns = async (req, res) => {
  console.log("===> newCompaigns its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const {
      compaignTitle,
      compaignInfo,
      compaignStartDate,
      compaignStartHour,
      compaignStartMinute,
      compaignStartTime,
      compaignEndDate,
      compaignEndHour,
      compaignEndMinute,
      compaignEndTime,
    } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    // let startDate = compaignStartDate.split("-");
    // let endDate = compaignEndDate.split("-");

    // let compStart = {
    //   year: startDate[0],
    //   month: startDate[1],
    //   day: startDate[2],
    //   hour: compaignStartHour,
    //   minute: compaignStartMinute,
    //   time: compaignStartTime,
    // };

    // let compEnd = {
    //   year: endDate[0],
    //   month: endDate[1],
    //   day: endDate[2],
    //   hour: compaignEndHour,
    //   minute: compaignEndMinute,
    //   time: compaignEndTime,
    // };
    console.log(
      compaignStartDate,
      compaignStartHour, 
      compaignStartMinute,
      compaignStartTime
    );

    const [row, created] = await db.Compaign.findOrCreate({
      where: { storeId: session.id },
      defaults: {
        campaignName: compaignTitle,
        // campaignOrders: 0,
        // campaignSales: 0.0,
        campaignStatus: "Scheduled",
        campaignStart: `${compaignStartDate} ${compaignStartHour}:${compaignStartMinute}: 00 ${compaignStartTime}`,
        campaignEnd: `${compaignEndDate} ${compaignEndHour}:${compaignEndMinute}: 00  ${compaignEndTime}`,
        compaignInfo: compaignInfo,
        storeId: session.id,
      },
    });
    Data = [row]
    Status = 200;
    Message = " Compain Created Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("newCompaigns", err);
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }

  res.status(200).send({
    Response: {
      Data,
      Status,
      Message,
      Err,
    },
  });
};

export const getCompaigns = async (req, res) => {
  console.log("===> getCompaigns its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    const compaigns = await db.Compaign.findAll({
      where: { storeId: session.id },
    });
    Data = [...compaigns];
    Status = 200;
    Message = "Get All Compains  Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("get All Compaign", err);
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }

  res.status(200).send({
    Response: {
      Data,
      Status,
      Message,
      Err,
    },
  });
};

export const getCompaignsById = async (req, res) => {
  console.log("===> getCompaignsById its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { id } = req.query;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    const compaign = await db.Compaign.findOne({
      where: { storeId: session.id, id: id },
    });


    Data = [...compaign];
    Status = 200;
    Message = "Get Compain  Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("getCompaignsById", err);
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }

  res.status(200).send({
    Response: {
      Data,
      Status,
      Message,
      Err,
    },
  });
};

export const updateCompaigns = async (req, res) => {
  console.log("===> updateCompaigns its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
      
      
    const {
          id,
          compaignTitle,
          compaignInfo,
          compaignStartDate,
          compaignStartHour,
          compaignStartMinute,
          compaignStartTime,
          compaignEndDate,
          compaignEndHour,
          compaignEndMinute,
          compaignEndTime,
        } = req.body;
        const session = await Shopify.Utils.loadCurrentSession(req, res, false);

        let startDate = compaignStartDate.split("-");
        let endDate = compaignEndDate.split("-");

        let compStart = {
          year: startDate[0],
          month: startDate[1],
          day: startDate[2],
          hour: compaignStartHour,
          minute: compaignStartMinute,
          time: compaignStartTime,
        };

        let compEnd = {
          year: endDate[0],
          month: endDate[1],
          day: endDate[2],
          hour: compaignEndHour,
          minute: compaignEndMinute,
          time: compaignEndTime,
        };
      const compaigns = await db.Compaign.update(
        {
          campaignName: compaignTitle,
          campaignStart: compStart,
          campaignEnd: compEnd,
          compaignInfo: compaignInfo,
        },
        { where: { storeId: session.id, id: id } }
      );
        Data = [...compaigns];
    Status = 200;
    Message = " Compain update Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("updateCompaigns", err);
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }

  res.status(200).send({
    Response: {
      Data,
      Status,
      Message,
      Err,
    },
  });
};

export const deleteCompaignsById = async (req, res) => {
  console.log("===> deleteCompaignsById its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { id } = req.query;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

     const compaigns = await db.Compaign.destroy({
       where: { storeId: session.id, id: id },
     });

    Status = 200;
    Message = "delete Compaigns By Id Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("deleteCompaignsById", err);
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }

  res.status(200).send({
    Response: {
      Data,
      Status,
      Message,
      Err,
    },
  });
};
