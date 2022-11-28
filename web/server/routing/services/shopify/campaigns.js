import { Shopify } from "@shopify/shopify-api";
import Sequelize from "sequelize";
import db from "../../../db/models/postgres/index.js";
import { getCollectionProducts } from "../../../shopify/rest_api/collection.js";
import { getProduct } from "../../../shopify/rest_api/product.js";
import {
  startJob,
  endJob,
  start,
  end,
  starJob,
  enJob,
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
    // const session = await Shopify.Utils.loadOfflineSession(req.query.shop);

    await Promise.all(
      collectionIds.map(async (ele) => {
        const result = campaignInfo.filter((items) => {
          return items.id == ele.id;
        });

        if (result.length == 1) {
          Data.push(...result);
        } else {
          let vendor = [];
          let vendorSelect = [];
          let allVariants = [];
          let collectionProducts = await getCollectionProducts(
            session,
            ele.id.split("/").pop()
          );
          await Promise.all(
            collectionProducts.products.map(async (ele) => {
              console.log(ele.id, "ele is here========>");
              let productVariants = await getProduct(session, ele.id);

              // console.log(productVariants,"pppppppppppppppp");
              productVariants.variants.map(async (variants) => {
                allVariants.push({
                  id: variants.admin_graphql_api_id,
                  vendor: productVariants.vendor,
                });
              });

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
            allVariants,
          };
          Data.push(obj);
          console.log(obj, "&&&&&&&&&&&&&&&&");
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
    // const session = await Shopify.Utils.loadOfflineSession(req.query.shop);

    let toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

    let startDate = moment(
      `${campaignStartDate} ${campaignStartHour}:${campaignStartMinute}: 00 ${campaignStartTime}`,
      "YYYY-MM-DD hh:mm:ss a"
    ).format();

    let endDate = moment(
      `${campaignEndDate} ${campaignEndHour}:${campaignEndMinute}: 00  ${campaignEndTime}`,
      "YYYY-MM-DD hh:mm:ss a"
    ).format();

    if (startDate < endDate) {
      const cheeck = await db.Campaign.findAll({
        where: {
          campaignEnd: {
            [Op.between]: [startDate, endDate],
          },
          storeId: session.id,
        },
      });

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
          await startJob(row.id, session, row.campaignStart);
          await endJob(row.id, session, row.campaignEnd);
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
        Message =
          "Start Campaign Date or Time must be greater then now Date or time ";
        Err = "Invalid Date or Time";
      }
    } else {
      Data = null;
      Status = 401;
      Message =
        "End Campaign Date or Time must be less then Start Date or time";
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
    // const session = await Shopify.Utils.loadOfflineSession(req.query.shop);
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
    // const session = await Shopify.Utils.loadOfflineSession(req.query.shop);

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
    // const session = await Shopify.Utils.loadOfflineSession(req.query.shop);
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
    // const session = await Shopify.Utils.loadOfflineSession(req.query.shop);

    let toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

    let startDate = moment(
      `${campaignStartDate} ${campaignStartHour}:${campaignStartMinute}: 00 ${campaignStartTime}`,
      "YYYY-MM-DD hh:mm:ss a"
    ).format();

    let endDate = moment(
      `${campaignEndDate} ${campaignEndHour}:${campaignEndMinute}: 00  ${campaignEndTime}`,
      "YYYY-MM-DD hh:mm:ss a"
    ).format();

    console.log(startDate<endDate, "its Update Route!!!!!!!!!!!!");

    if (startDate < endDate) {
      const cheeck = await db.Campaign.findAll({
        where: {
          campaignEnd: {
            [Op.between]: [startDate, endDate],
          },
          storeId: session.id,
        },
      });
      console.log(toDate <= startDate,"1!!!!!!!!!!");
      if (toDate <= startDate) {
        if (cheeck.length == 0) {
          const campaigns = await db.Campaign.update(
            {
              campaignName: campaignTitle,
              campaignStart: startDate,
              campaignEnd: endDate,
              campaignInfo: campaignInfo,
              campaignStatus: "Scheduled",
            },
            { where: { storeId: session.id, id: id } }
          );
          await startJob(id, session, startDate);
          await endJob(id, session, endDate);
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
    } else {
      Data = null;
      Status = 401;
      Message =
        "End Campaign Date or Time must be less then Start Date or time";
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
    // const session = await Shopify.Utils.loadOfflineSession(req.query.shop);

    const findCampaign = await db.Campaign.findOne({
      where: { storeId: session.id, id: id },
    });

    if (findCampaign.campaignStatus == "Active") {
      await end(id, session);

      const campaigns = await db.Campaign.destroy({
        where: { storeId: session.id, id: id },
      });

      Status = 200;
      Message = "Your Request is under process it Takes a couple of minutes";
      Err = " Looking Good";
    } else {
      const campaigns = await db.Campaign.destroy({
        where: { storeId: session.id, id: id },
      });
      console.log(campaigns, "its Destroy data");
      Status = 200;
      Message = "Delete Campaign Successfully";
      Err = " Looking Good";
    }
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

export const reSchedulAllJobs = async (req, res) => {
  console.log("===> reSchedulAllJobs its work");
  let Data = [];
  let Status;
  let Message;
  let Err;
  try {
    let campaign = await db.Campaign.findAll({});

    await Promise.all(
      campaign.map(async (ele) => {
        const session = await Shopify.Utils.loadOfflineSession(
          ele.storeId.split("_").pop()
        );

        let toDate = new Date();
        let startDate = new Date(ele.campaignStart);

        if (toDate <= startDate && ele.campaignStatus == "Scheduled") {
          console.log("*******reSchedulAllJobs********");
          await startJob(ele.id, session, ele.campaignStart);
          await endJob(ele.id, session, ele.campaignEnd);
        }

        if (toDate >= startDate && ele.campaignStatus == "Active") {
          console.log("*******reSchedulAllJobs that Not Expire********");
          // await startJob(ele.id, session, ele.campaignStart);
          await endJob(ele.id, session, ele.campaignEnd);
        }
      })
    );
    console.log("else");

    Data = campaign;
    Status = 200;
    Message = " reSchedulAllJobs Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("reSchedulAllJobs Err", err);
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }

  // res.status(200).send({
  //   Response: {
  //     Data,
  //     Status,
  //     Message,
  //     Err,
  //   },
  // });
};

export const testCroneJob = async (req, res) => {
  console.log("===> testCroneJob its work");
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
    // const session = await Shopify.Utils.loadOfflineSession(req.query.shop);

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

    const campaigns = await db.Campaign.update(
      {
        campaignName: campaignTitle,
        campaignStart: startDate,
        campaignEnd: endDate,
        campaignInfo: campaignInfo,
        campaignStatus: "Scheduled",
      },
      { where: { storeId: session.id, id: id } }
    );
    await starJob(id, session, startDate);
    // await enJob(id, session, endDate);
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
