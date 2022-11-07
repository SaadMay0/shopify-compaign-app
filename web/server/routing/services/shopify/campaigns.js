import { Shopify } from "@shopify/shopify-api";
import Sequelize from "sequelize";
import db from "../../../db/models/postgres/index.js";
import { getCollectionProducts } from "../../../shopify/rest_api/collection.js";
const Op = Sequelize.Op;
import "colors";

export const getCampaignInfo = async (req, res) => {
  console.log("===> campaign/getCollectionProducts its work");
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
          campaignQuantity: 1,
          campaignCostDiscount: 0,
          // campaignCostDiscount,
          campaignDiccount: 0,
          vendorsOptions: uniqueVendorsOption,
          vendorsSlect: uniqueVendorSlect,
          popoverActive: false,
        };
        Data.push(obj);
      })
    );
    Status = 200;
    Message = "Get Campain Info Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("getCampaignInfo", err);
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

export const newCampaigns = async (req, res) => {
  console.log("===> newCampaigns its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const {
      campaignTitle,
      campaignInfo,
      campaignStartDate,
      campaignStartHour,
      campaignStartMinute,
      campaignStartTime,
      campaignEndDate,
      campaignEndHour,
      campaignEndMinute,
      campaignEndTime,
    } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    // let startDate = campaignStartDate.split("-");
    // let endDate = campaignEndDate.split("-");

    // let compStart = {
    //   year: startDate[0],
    //   month: startDate[1],
    //   day: startDate[2],
    //   hour: campaignStartHour,
    //   minute: campaignStartMinute,
    //   time: campaignStartTime,
    // };

    // let compEnd = {
    //   year: endDate[0],
    //   month: endDate[1],
    //   day: endDate[2],
    //   hour: campaignEndHour,
    //   minute: campaignEndMinute,
    //   time: campaignEndTime,
    // };
    console.log(
      campaignStartDate,
      campaignStartHour,
      campaignStartMinute,
      campaignStartTime
    );

    const cheeck = await db.Campaign.findAll({
      where: {
        campaignEnd: {
          [Op.between]: [
            `${campaignStartDate} ${campaignStartHour}:${campaignStartMinute}: 00 ${campaignStartTime}`,
            `${campaignEndDate} ${campaignEndHour}:${campaignEndMinute}: 00  ${campaignEndTime}`,
          ],
        },
      },
    });


    console.log(cheeck,"Check That value");

    if (cheeck.length == 0) {
      const [row, created] = await db.Campaign.findOrCreate({
        where: { storeId: session.id, campaignName: campaignTitle },
        defaults: {
          campaignName: campaignTitle,
          // campaignOrders: 0,
          // campaignSales: 0.0,
          campaignStatus: "Scheduled",
          campaignStart: `${campaignStartDate} ${campaignStartHour}:${campaignStartMinute}: 00 ${campaignStartTime}`,
          campaignEnd: `${campaignEndDate} ${campaignEndHour}:${campaignEndMinute}: 00  ${campaignEndTime}`,
          campaignInfo: campaignInfo,
          storeId: session.id,
        },
      });
      Data = [row];
      Status = 200; 
      Message = " Campain Created Successfully";
      Err = " Looking Good";
    } else {
      Data = null;
      Status = 401;
      Message = "Already have an Campaign between you selected Date";
      Err = "Duplication not allow";
    }
  } catch (err) {
    console.log("newCampaigns", err);
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

export const getCampaigns = async (req, res) => {
  console.log("===> getCampaigns its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    const campaigns = await db.Campaign.findAll({
      where: { storeId: session.id },
    });
    Data = [...campaigns];
    Status = 200;
    Message = "Get All Campains  Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("get All Campaign", err);
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

export const getCampaignsById = async (req, res) => {
  console.log("===> getCampaignsById its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { id } = req.query;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    const campaign = await db.Campaign.findOne({
      where: { storeId: session.id, id: id },
    });

    Data = [...campaign];
    Status = 200;
    Message = "Get Campain  Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("getCampaignsById", err);
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

export const updateCampaigns = async (req, res) => {
  console.log("===> updateCampaigns its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const {
      id,
      campaignTitle,
      campaignInfo,
      campaignStartDate,
      campaignStartHour,
      campaignStartMinute,
      campaignStartTime,
      campaignEndDate,
      campaignEndHour,
      campaignEndMinute,
      campaignEndTime,
    } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    let startDate = campaignStartDate.split("-");
    let endDate = campaignEndDate.split("-");

    let compStart = {
      year: startDate[0],
      month: startDate[1],
      day: startDate[2],
      hour: campaignStartHour,
      minute: campaignStartMinute,
      time: campaignStartTime,
    };

    let compEnd = {
      year: endDate[0],
      month: endDate[1],
      day: endDate[2],
      hour: campaignEndHour,
      minute: campaignEndMinute,
      time: campaignEndTime,
    };
    const campaigns = await db.Campaign.update(
      {
        campaignName: campaignTitle,
        campaignStart: compStart,
        campaignEnd: compEnd,
        campaignInfo: campaignInfo,
      },
      { where: { storeId: session.id, id: id } }
    );
    Data = [...campaigns];
    Status = 200;
    Message = " Campain update Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("updateCampaigns", err);
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

export const deleteCampaignsById = async (req, res) => {
  console.log("===> deleteCampaignsById its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { id } = req.query;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    const campaigns = await db.Campaign.destroy({
      where: { storeId: session.id, id: id },
    });

    Status = 200;
    Message = "delete Campaigns By Id Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("deleteCampaignsById", err);
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
