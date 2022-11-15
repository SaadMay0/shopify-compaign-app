import { Shopify } from "@shopify/shopify-api";
import Sequelize from "sequelize";
import db from "../../../db/models/postgres/index.js";
import { getCollectionProducts } from "../../../shopify/rest_api/collection.js";
import {
  scheduleJob,
  schedule2Job,
} from "../helper_functions/shopify/scheduleJob.js";
import "colors";
import moment from "moment";
const Op = Sequelize.Op;

export const getCampaignInfo = async (req, res) => {
  console.log("===> getCampaignInfo its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { collectionIds, campaignInfo } = req.body;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    await Promise.all(
      collectionIds.map(async (ele) => {
        if (campaignInfo.length >= 0) {
          const result = campaignInfo.filter((items) => {
            return items.id == ele.id;
          });

          if (result.length == 1) {
            Data.push(...result);
          } else {
            let vendor = [];
            let vendorSelect = [];
            let collectionProducts = await getCollectionProducts(
              session,
              ele.id.split("/").pop()
            );
            await Promise.all(
              collectionProducts.products.map(async (ele) => {
                if (!vendorSelect.includes(`${ele.vendor}`)) {
                  vendor.push({
                    value: `${ele.vendor}`,
                    label: `${ele.vendor}`,
                  });
                  vendorSelect.push(`${ele.vendor}`);
                }
              })
            );

            let obj = {
              id: ele.id,
              image: ele.image ? ele.image.originalSrc : null,
              title: ele.title,
              campaignCostDiscount: 0,
              campaignDiscount: 0,
              vendorsOptions: vendor,
              vendorsSelect: vendorSelect,
              popoverActive: false,
            };
            Data.push(obj);
          }
        }
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

    let toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

    let startDate = moment(
      `${campaignStartDate} ${campaignStartHour}:${campaignStartMinute}: 00 ${campaignStartTime}`,
      "YYYY-MM-DD hh:mm:ss a"
    ).format();

    let endDate = moment(
      `${campaignEndDate} ${campaignEndHour}:${campaignEndMinute}: 00  ${campaignEndTime}`,
      "YYYY-MM-DD hh:mm:ss a"
    ).format();
    const cheeck = await db.Campaign.findAll({
      where: {
        campaignEnd: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    console.log(campaignStartHour,"888888888", campaignStartMinute);

    if (toDate <= startDate) {
      if (cheeck.length == 0) {
        const [row, created] = await db.Campaign.findOrCreate({
          where: { storeId: session.id, campaignName: campaignTitle },
          defaults: {
            campaignName: campaignTitle,
            campaignStatus: "Scheduled",
            campaignStart: startDate,
            campaignEnd: endDate,
            campaignInfo: campaignInfo,
            storeId: session.id,
          },
        });
        console.log(row.id, "Row Id ");
        Data = [row];
        Status = 200;
        Message = " Campain Created Successfully";
        Err = " Looking Good";
        await scheduleJob(
          row.id,
          session,
          // campaignInfo,
          campaignStartDate,
          campaignStartHour,
          campaignStartMinute,
          campaignStartTime
        );
        await schedule2Job(
          row.id,
          session,
          // campaignInfo,
          campaignEndDate,
          campaignEndHour,
          campaignEndMinute,
          campaignEndTime
        );
      } else {
        Data = null;
        Status = 401;
        Message = "Already have an Campaign between you selected Date";
        Err = "Duplication not allow";
      }
      // console.log(endDate, "Start Campaign*******", startDate, toDate);
    } else {
      console.log("else Part Is working");

      Data = null;
      Status = 401;
      Message = "Start Campaign Date or Time must be greater ";
      Err = "Invalid Date or Time";
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

    console.log("campaign Get");
    Data = campaign;
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

export const getCampaignsByStatus = async (req, res) => {
  console.log("===> getCampaignsByStatus its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    const { tab } = req.query;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);
    let campaign;

    if (tab == "All") {
      campaign = await db.Campaign.findAll({
        where: { storeId: session.id },
      });
    } else {
      campaign = await db.Campaign.findAll({
        where: { storeId: session.id, campaignStatus: tab },
      });
    }

    Data = [...campaign];
    Status = 200;
    Message = "Get Campain  Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("getCampaignsByStatus", err);
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

    let toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

    let startDate = moment(
      `${campaignStartDate} ${campaignStartHour}:${campaignStartMinute}: 00 ${campaignStartTime}`,
      "YYYY-MM-DD hh:mm:ss a"
    ).format();

    let endDate = moment(
      `${campaignEndDate} ${campaignEndHour}:${campaignEndMinute}: 00  ${campaignEndTime}`,
      "YYYY-MM-DD hh:mm:ss a"
    ).format();

    console.log(startDate, endDate, "its Update Route");

    const cheeck = await db.Campaign.findAll({
      where: {
        campaignEnd: {
          [Op.between]: [startDate, endDate],
        },
      },
    });
    if (toDate <= startDate) {
      if (cheeck.length == 0) {
        const campaigns = await db.Campaign.update(
          {
            campaignName: campaignTitle,
            campaignStart: startDate,
            campaignEnd: endDate,
            campaignInfo: campaignInfo,
          },
          { where: { storeId: session.id, id: id } }
        );
        Data = [...campaigns];
        Status = 200;
        Message = " Campain update Successfully";
        Err = " Looking Good";
      } else {
        Data = null;
        Status = 401;
        Message = "Already have an Campaign between you selected Date";
        Err = "Duplication not allow";
      }
    } else {
      console.log("else Part Is working");

      Data = null;
      Status = 401;
      Message = "Start Campaign Date or Time must be greater ";
      Err = "Invalid Date or Time";
    }
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
