import { Shopify } from "@shopify/shopify-api";
import Sequelize from "sequelize";
import db from "../../../db/models/postgres/index.js";
import {
  getAllCollectionesProductsCount,
  getCollectionProductByClint,
} from "../../../shopify/rest_api/product.js";
import {
  startJob,
  endJob,
  start,
  end,
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
        const result = campaignInfo.filter((items) => {
          return items.id == ele.id;
        });

        if (result.length == 1) {
          Data.push(...result);
        } else {
          let allData = await getCollectionProductByClint(
            session,
            ele.id.split("/").pop()
          );
          let obj = {
            id: ele.id,
            image: ele.image ? ele.image.originalSrc : null,
            title: ele.title,
            campaignCostDiscount: 0,
            campaignDiscount: 0,
            vendorsOptions: allData.vendor,
            vendorsSelect: allData.vendorSelect,
            popoverActive: false,
            allVariants: allData.allVariants,
          };
          Data.push(obj);
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
  let redirect;
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

    let updatedCampaignInfo = [];

    campaignInfo.map((item) => {
      let selectesVariants = [];
      item.allVariants.map((obj) => {
        if (item.vendorsSelect.includes(`${obj.vendor}`)) {
          selectesVariants.push(obj);
        }
      });
      let newObj = {
        ...item,
        selectesVariants: selectesVariants,
      };
      updatedCampaignInfo.push(newObj);
    });

    console.log(
      campaignInfo,
      "==============CampiagnInfo",
      updatedCampaignInfo
    );

    let toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

    let startDate = moment(
      `${campaignStartDate} ${campaignStartHour}:${campaignStartMinute}: 00 ${campaignStartTime}`,
      "YYYY-MM-DD hh:mm:ss a"
    ).format();

    let endDate = moment(
      `${campaignEndDate} ${campaignEndHour}:${campaignEndMinute}: 00  ${campaignEndTime}`,
      "YYYY-MM-DD hh:mm:ss a"
    ).format();

    let productCounts = await getAllCollectionesProductsCount(
      session,
      campaignInfo
    );

    console.log("************productCounts******************", productCounts);

    if (productCounts <= 1000) {
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
          let allProductsOfThisCampaignInfo = [];

          let ProductExistes = [];
          let ProductExistes2 = [];
          let cheeckBreak = false;
          Promise.all(
            cheeck?.map(async (campaign) => {
              campaign.campaignInfo.map((campaignInf) => {
                if (cheeckBreak) {
                  return;
                }
                campaignInf.selectesVariants.map((variants) => {
                  let dbVariantId = variants.id;
                  if (cheeckBreak) {
                    return;
                  }
                  updatedCampaignInfo.map((ele) => {
                    if (cheeckBreak) {
                      return;
                    }
                    ele.selectesVariants.map((varId) => {
                      if (
                        varId.id == dbVariantId &&
                        campaign.campaignStatus == "Active"
                      ) {
                        ProductExistes.push(varId.id);
                        cheeckBreak = true;
                        return;
                      }

                      if (varId.id == dbVariantId) {
                        ProductExistes2.push(varId.id);
                        cheeckBreak = true;
                        return;
                      }
                    });
                  });
                });
              });
            })
          );

          updatedCampaignInfo.map((ele) => {
            ele.selectesVariants.map((varId) => {
              allProductsOfThisCampaignInfo.push(varId.id);
            });
          });

          const uniqueArr = new Set([...allProductsOfThisCampaignInfo]);

          console.log(
            ProductExistes,
            ProductExistes.length,
            "ProductExistes&&&&&&&&&&&&>>>>>>",
            ProductExistes2,
            ProductExistes2.length,
            "All Variants Length",
            allProductsOfThisCampaignInfo.length
          );
          if (ProductExistes.length >= 1) {
            Data = campaignInfo;
            redirect = false;
            Status = 200;
            Message = "Some products are exist in Active campaign";
            Err = " Looking Good";
          } else {
            if (ProductExistes2.length >= 1) {
              Data = campaignInfo;
              redirect = false;
              Status = 200;
              Message = "Already have a campaign with some Products and time";
              Err = " Looking Good";
            } else {
              if (uniqueArr.size < allProductsOfThisCampaignInfo.length) {
                Data = campaignInfo;
                redirect = false;
                Status = 200;
                Message = "some products are repeated in this campaign";
                Err = " Looking Good";
              } else {
                const [row, created] = await db.Campaign.findOrCreate({
                  where: {
                    storeId: session.id,
                    campaignName: campaignTitle,
                  },
                  defaults: {
                    campaignName: campaignTitle,
                    campaignStatus: "Scheduled",
                    campaignStart: startDate,
                    campaignEnd: endDate,
                    campaignInfo: updatedCampaignInfo,
                    storeId: session.id,
                  },
                });
                Data = [row];
                redirect = true;
                Status = 200;
                Message = " Campain Created Successfully";
                Err = " Looking Good";
                await startJob(session, row.id, row.campaignStart);
                await endJob(session, row.id, row.campaignEnd);
              }
            }
          }
        } else {
          Data = null;
          Status = 401;
          redirect = false;
          Message =
            "Start Campaign Date or Time must be greater then now Date or time ";
          Err = "Invalid Date or Time";
        }
      } else {
        Data = null;
        Status = 401;
        redirect = false;
        Message =
          "End Campaign Date or Time must be less then Start Date or time";
        Err = "Invalid Date or Time";
      }
    } else {
      Data = campaignInfo;
      Status = 200;
      redirect = false;
      Message = "Number of product in Campaign is exceeded the limit  ";
      Err = "Products exceeded the limit";
    }
  } catch (err) {
    console.log("newCampaigns", err);
    Status = 404;
    redirect = false;
    Message = "Following Path Not Found";
    Err = err;
  }

  res.status(200).send({
    Response: {
      Data,
      Status,
      redirect,
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
  let redirect;
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

    let updatedCampaignInfo = [];

    campaignInfo.map((item) => {
      let selectesVariants = [];
      item.allVariants.map((obj) => {
        if (item.vendorsSelect.includes(`${obj.vendor}`)) {
          selectesVariants.push(obj);
        }
      });
      let newObj = {
        ...item,
        selectesVariants: selectesVariants,
      };
      updatedCampaignInfo.push(newObj);
    });

    let toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

    let startDate = moment(
      `${campaignStartDate} ${campaignStartHour}:${campaignStartMinute}: 00 ${campaignStartTime}`,
      "YYYY-MM-DD hh:mm:ss a"
    ).format();

    let endDate = moment(
      `${campaignEndDate} ${campaignEndHour}:${campaignEndMinute}: 00  ${campaignEndTime}`,
      "YYYY-MM-DD hh:mm:ss a"
    ).format();

    let productCounts = await getAllCollectionesProductsCount(
      session,
      campaignInfo
    );

    console.log("************productCounts******************", productCounts);

    if (productCounts <= 1000) {
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
          let allProductsOfThisCampaignInfo = [];

          let ProductExistes = [];
          let ProductExistes2 = [];
          let cheeckBreak = false;
          let UpdateId;
          Promise.all(
            cheeck?.map(async (campaign) => {
              if (cheeckBreak) {
                return;
              }

              campaign.campaignInfo.map((campaignInf) => {
                if (cheeckBreak) {
                  return;
                }
                campaignInf.selectesVariants.map((variants) => {
                  if (cheeckBreak) {
                    return;
                  }
                  let dbVariantId = variants.id;
                  updatedCampaignInfo.map((ele) => {
                    if (cheeckBreak) {
                      return;
                    }
                    ele.selectesVariants.map((varId) => {
                      if (
                        varId.id == dbVariantId &&
                        campaign.campaignStatus == "Active"
                      ) {
                        ProductExistes.push(varId.id);
                        cheeckBreak = true;
                        return;
                      }

                      if (varId.id == dbVariantId) {
                        ProductExistes2.push(varId.id);
                        UpdateId = campaign.id;
                        cheeckBreak = true;
                        return;
                      }
                    });
                  });
                });
              });
            })
          );

          updatedCampaignInfo.map((ele) => {
            ele.selectesVariants.map((varId) => {
              allProductsOfThisCampaignInfo.push(varId.id);
            });
          });

          const uniqueArr = new Set([...allProductsOfThisCampaignInfo]);

          console.log(
            ProductExistes,
            ProductExistes.length,
            "ProductExistes&&&&&&&&&&&&>>>>>>",
            ProductExistes2,
            ProductExistes2.length,
            "All Variants length,",
            allProductsOfThisCampaignInfo.length
          );
          if (ProductExistes.length >= 1) {
            Data = campaignInfo;
            redirect = false;
            Status = 200;
            Message = "Some products are exist in Active campaign";
            Err = " Looking Good";
          } else {
            if (cheeck.length == 1 && UpdateId == id) {
              console.log(
                "========================Updated Id and Found Id Are Same=================="
              );
              ProductExistes2 = [];
            }
            if (ProductExistes2.length >= 1) {
              Data = campaignInfo;
              redirect = false;
              Status = 200;
              Message = "Already have a campaign with some Products and time";
              Err = " Looking Good";
            } else {
              if (uniqueArr.size < allProductsOfThisCampaignInfo.length) {
                Data = campaignInfo;
                redirect = false;
                Status = 200;
                Message = "some products are repeated in this campaign";
                Err = " Looking Good";
              } else {
                const campaigns = await db.Campaign.update(
                  {
                    campaignName: campaignTitle,
                    campaignStart: startDate,
                    campaignEnd: endDate,
                    campaignInfo: updatedCampaignInfo,
                    campaignStatus: "Scheduled",
                  },
                  { where: { storeId: session.id, id: id } }
                );
                await startJob(session, id, startDate);
                await endJob(session, id, endDate);
                Data = [...campaigns];
                redirect = true;
                Status = 200;
                Message = " Campain update Successfully";
                Err = " Looking Good";
              }
            }
          }
        } else {
          Data = null;
          redirect = false;
          Status = 401;
          Message = "Start Campaign Date or Time must be greater ";
          Err = "Invalid Date or Time";
        }
      } else {
        Data = null;
        redirect = false;
        Status = 401;
        Message =
          "End Campaign Date or Time must be less then Start Date or time";
        Err = "Invalid Date or Time";
      }
    } else {
      Data = campaignInfo;
      Status = 200;
      redirect = false;
      Message = "Number of product in Campaign is exceeded the limit  ";
      Err = "Products exceeded the limit";
    }
  } catch (err) {
    console.log("updateCampaigns", err);
    redirect = false;
    Status = 404;
    Message = "Following Path Not Found";
    Err = err;
  }

  res.status(200).send({
    Response: {
      Data,
      redirect,
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

    const findCampaign = await db.Campaign.findOne({
      where: { storeId: session.id, id: id },
    });

    if (findCampaign.campaignStatus == "Active") {
      await end(session, id);

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
        let endDate = new Date(ele.campaignEnd);

        if (toDate < startDate && ele.campaignStatus == "Scheduled") {
          console.log("*******reSchedulAllJobs that not Scheduled********");
          await startJob(session, ele.id, ele.campaignStart);
          await endJob(session, ele.id, ele.campaignEnd);
        }

        if (
          toDate > startDate &&
          ele.campaignStatus == "Scheduled" &&
          endDate > toDate
        ) {
          console.log("*******Start Campaign that Not Started********");
          await endJob(session, ele.id, ele.campaignEnd);
          await start(session, ele.id);
        }

        if (toDate > endDate && ele.campaignStatus == "Active") {
          console.log("*******End Campaign that Not End********");
          await end(session, ele.id);
        }

        if (toDate > endDate && ele.campaignStatus == "Scheduled") {
          console.log(
            "*******reScheduled  Not Scheduled Due to Time Out********"
          );
        }
      })
    );

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
};
