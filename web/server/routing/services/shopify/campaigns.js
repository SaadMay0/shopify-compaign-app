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

import {
  setDefaultProductPricesOfAllCampaign,
  updateProductPricesInShoify,
} from "../helper_functions/shopify/campaigns.js";
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
    Message = "Serer Error";
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
      selected,
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

    let selectedOption = selected.pop();
    console.log(
      // campaignInfo,
      selectedOption,
      "==============CampiagnInfo"
      // updatedCampaignInfo,
      // selected
    );

    // selectedOption == "schedule_campaign" ? null : null;
    // selectedOption == "schedule_without_end_date" ? null : null;
    // selectedOption == "with_end_date" ? null : null;
    // selectedOption == "without_end_date" ? null : null;
    let toDate;
    let startDate;
    let endDate;

    let startedDate;
    let endedDate;

    if (selectedOption == "with_end_date") {
      console.log("with_end_date is working ======>");
      toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

      startDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a")
        .add(1, "minutes")
        .format();

      endDate = moment(
        `${campaignEndDate} ${campaignEndHour}:${campaignEndMinute}: 00  ${campaignEndTime}`,
        "YYYY-MM-DD hh:mm:ss a"
      ).format();
      startedDate = startDate;
      endedDate = endDate;
      console.log(
        "toDate==>",
        toDate,
        "startDate===>",
        startDate,
        "endDate===>",
        endDate
      );
    } else if (selectedOption == "without_end_date") {
      console.log("without_end_date is working ======>");
      toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

      startDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a")
        .add(1, "minutes")
        .format();

      endDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a")
        .add(10, "minutes")
        .format();

      startedDate = startDate;
      endedDate = null;
      console.log(
        "toDate==>",
        toDate,
        "startDate===>",
        startDate,
        "endDate===>",
        endDate
      );
    } else if (selectedOption == "schedule_without_end_date") {
      console.log("schedule_without_end_date is working ======>");
      toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

      startDate = moment(
        `${campaignStartDate} ${campaignStartHour}:${campaignStartMinute}: 00 ${campaignStartTime}`,
        "YYYY-MM-DD hh:mm:ss a"
      ).format();

      endDate = moment(
        `${campaignStartDate} ${campaignStartHour}:${campaignStartMinute}: 00 ${campaignStartTime}`,
        "YYYY-MM-DD hh:mm:ss a"
      )
        .add(10, "minutes")
        .format();

      startedDate = startDate;
      endedDate = null;
      console.log(
        "toDate==>",
        toDate,
        "startDate===>",
        startDate,
        "endDate===>",
        endDate
      );
    } else {
      console.log("schedule_campaign is working ======>");
      toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

      startDate = moment(
        `${campaignStartDate} ${campaignStartHour}:${campaignStartMinute}: 00 ${campaignStartTime}`,
        "YYYY-MM-DD hh:mm:ss a"
      ).format();

      endDate = moment(
        `${campaignEndDate} ${campaignEndHour}:${campaignEndMinute}: 00  ${campaignEndTime}`,
        "YYYY-MM-DD hh:mm:ss a"
      ).format();
      startedDate = startDate;
      endedDate = endDate;
      console.log(
        "toDate==>",
        toDate,
        "startDate===>",
        startDate,
        "endDate===>",
        endDate
      );
    }

    let productCounts = await getAllCollectionesProductsCount(
      session,
      campaignInfo
    );

    console.log("************productCounts******************", productCounts);

    if (productCounts <= 1000) {
      if (startDate < endDate) {
        const cheeck = await db.Campaign.findAll({
          where: {
            [Op.or]: [
              // { campaignStatus: "Active" },
              {
                [Op.and]: [{ campaignEnd: null }, { campaignStatus: "Active" }],
              },
              {
                [Op.or]: [
                  {
                    [Op.or]: [
                      {
                        // [Op.or]:[{campaignStatus: "Scheduled"},{campaignStatus: "Expired"}],
                        campaignStatus: "Scheduled",
                        campaignEnd: null,
                        campaignStart: {
                          [Op.gt]: startedDate,
                        },
                      },
                      {
                        campaignStatus: "Scheduled",
                        campaignEnd: null,
                        campaignStart: {
                          [Op.lt]: startedDate,
                        },
                      },
                    ],
                  },
                  {
                    campaignEnd: {
                      [Op.between]: [startedDate, endedDate],
                    },
                  },
                ],
              },
              // {
              //   campaignEnd: {
              //     [Op.between]: [startedDate, endedDate],
              //   },
              // },
            ],
            // campaignStart: {
            //   [Op.between]: [startDate, endDate],
            // },
            storeId: session.id,
          },
        });

        console.log(
          cheeck,
          "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%////////////////"
        );
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
            Status = 405;
            Message = "Some products are exist in Active Campaign";
            Err = " Looking Good";
          } else {
            if (ProductExistes2.length >= 1) {
              Data = campaignInfo;
              redirect = false;
              Status = 405;
              Message = "Already have a campaign with same Products or Time";
              Err = " Looking Good";
            } else {
              if (uniqueArr.size < allProductsOfThisCampaignInfo.length) {
                Data = campaignInfo;
                redirect = false;
                Status = 405;
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
                    campaignOption: selectedOption,
                    // campaignStart: startDate,
                    // campaignEnd: endDate,
                    campaignStart: startedDate,
                    campaignEnd: endedDate,
                    campaignInfo: updatedCampaignInfo,
                    campaignMessage: "Looking Good",
                    storeId: session.id,
                  },
                });
                Data = [row];
                redirect = true;
                Status = 200;
                Message = "Campaign Created Successfully";
                Err = " Looking Good";
                await startJob(session, row.id, row.campaignStart);
                endedDate == null
                  ? null
                  : await endJob(session, row.id, row.campaignEnd);
                // await endJob(session, row.id, row.campaignEnd);
              }
            }
          }
        } else {
          Data = null;
          Status = 405;
          redirect = false;
          Message =
            "The Started  Date or Time must be greater than today's date or  time";
          Err = "Invalid Date or Time";
        }
      } else {
        Data = null;
        Status = 405;
        redirect = false;
        Message =
          "The end Date or Time must be greater than the start Date or Time";
        Err = "Invalid Date or Time";
      }
    } else {
      Data = campaignInfo;
      Status = 405;
      redirect = false;
      Message = "The number of products in the Campaign exceeded the limit.";
      Err = "Products exceeded the limit";
    }
  } catch (err) {
    console.log("newCampaigns", err);
    Status = 404;
    redirect = false;
    Message = "Serer Error";
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
      order: [["campaignStart", "ASC"]],
      where: {
        storeId: session.id,
      },
    });
    Data = [...campaigns];
    Status = 200;
    Message = "Get All Campains  Successfully";
    Err = " Looking Good";
  } catch (err) {
    console.log("get All Campaign", err);
    Status = 404;
    Message = "Serer Error";
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
    Message = "Serer Error";
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

   let toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

    if (tab == "All") {
      campaign = await db.Campaign.findAll({
        order: [["campaignStart", "ASC"]],
        where: {
          storeId: session.id,
        },
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
    Message = "Serer Error";
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

export const startCampaign = async (req, res) => {
  console.log("===> startCampaign its work ****");
  // res.status(200).send({});
  // let Data = [];
  // let Status;
  // let Message;
  // let Err;
  try {
    const { id } = req.query;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    const allCampaign = await db.Campaign.findAll({
      where: {
        storeId: session.id,
        // id: id,
        campaignStatus: "Active",
      },
    });

    if (allCampaign.length > 0) {
      console.log(allCampaign.length, "<===Active Campaign Length");
      res.status(200).send({
        Response: {
          Status : 405,
          Message : "Already have a campaign active",
          Err : " Looking Good",

        }
      })
    } else {
      const findCampaign = await db.Campaign.findOne({
        where: {
          storeId: session.id,
          id: id,
          // campaignStatus: "Expired",
        },
      });
      if (findCampaign.campaignMessage == "Updated campaignInfo") {
        console.log("Updated campaignInfo message====>***********************");
        findCampaign.isCampaignStart = true;
        await findCampaign.save();
         res.status(200).send({
           Response: {
             Status: 200,
             // Message : "Starting the campaign is under process",
             Message: " Campaign start successfully",
             Err: " Looking Good",
           },
         });
        await updateProductPricesInShoify(session, id);
        res.redirect("/campaign/cheackStatus");
      } else {
        findCampaign.isCampaignStart = true;
        await findCampaign.save();

        res.status(200).send({
          Response: {
            Status: 200,
            // Message : "Starting the campaign is under process",
            Message: " Campaign start successfully",
            Err: " Looking Good",
          },
        });

        await start(session, id);
        // res.redirect("/api/campaign/cheackStatus");
        console.log(
          "its startCampaign data",
          findCampaign.campaignStatus == "Active"
        );
      }
    }
  } catch (err) {
    console.log("startCampaign", err);
     res.status(200).send({
       Response: {
         Status : 404,
         Message : "Serer Error",
         Err : err,
       },
     });
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

export const stopCampaign = async (req, res) => {
  console.log("===> stopCampaign its work");
  // res.status(200).send({});
  // let Data = [];
  // let Status;
  // let Message;
  // let Err;
  try {
    const { id } = req.query;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    const findCampaign = await db.Campaign.findOne({
      where: {
        storeId: session.id,
        id: id,
        campaignStatus: "Active",
      },
    });
    if (!findCampaign.campaignStatus == "Active") return null;

    findCampaign.isCampaignStart = true;
    await findCampaign.save();

     res.status(200).send({
       Response: {
         Status : 200,
         // Message : "stopping the campaign is under process",
         Message : " Campaign end successfully",
         Err : " Looking Good",
         
       },
     });

    await end(session, id);

    console.log("its Destroy data");
  } catch (err) {
    console.log("stopCampaign", err);
     res.status(200).send({
       Response: {
         Status : 404,
         Message : "Serer Error",
         Err : err,
       },
     });
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

export const stopAllCampaignAndSetDefaultValues = async (req, res) => {
  console.log("===> stopAllCampaignAndSetDefaultValues its work");
  // let Data = [];
  // let Status;
  // let Message;
  // let Err;
  try {
    // const { id } = req.query;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);

    const campaign = await db.Campaign.findAll({
      where: {
        storeId: session.id,
        campaignStatus: "Active",
        // campaignMessage: "gracefully updated the price in Shopify",
      },
    });

    
    if (campaign.length> 0 ) {
      console.log("stopAllCampaignAndSetDefaultValues data");
      let result = await db.Campaign.findOne(
       
        {
          where: {
            storeId: session.id,
            campaignStatus: "Active",
            // campaignMessage: "gracefully updated the price in Shopify",
          },
        }
      );

      result.isCampaignStart = true
      await result.save();


      console.log(result.id,"<======={{{{{{{}}}}}}}}}}}}");
      res.status(200).send({
        Data: result.id,
        Status : 200,
        Message : "Your Request is under process it Takes a couple of minutes",
        Err : " Looking Good",
      });
       await setDefaultProductPricesOfAllCampaign(session, campaign);
    } else {
      console.log("stopAllCampaignAndSetDefaultValues data");
      res.status(200).send({
        Status : 200,
        Message : " There is not any active Campaign ",
        Err : " Looking Good",
      }) 
    }

    // console.log("stopAllCampaignAndSetDefaultValues data");
    // Status = 200;
    // Message = "Stop the Campaign Successfully";
    // Err = " Looking Good";
  } catch (err) {
    console.log("stopAllCampaignAndSetDefaultValues", err);
    res.status(200).send({
      Status : 404,
      Message : "Serer Error",
      Err : err,
    })
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
      selected,
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

    // let toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

    // let startDate = moment(
    //   `${campaignStartDate} ${campaignStartHour}:${campaignStartMinute}: 00 ${campaignStartTime}`,
    //   "YYYY-MM-DD hh:mm:ss a"
    // ).format();

    // let endDate = moment(
    //   `${campaignEndDate} ${campaignEndHour}:${campaignEndMinute}: 00  ${campaignEndTime}`,
    //   "YYYY-MM-DD hh:mm:ss a"
    // ).format();

    let selectedOption = selected.pop();
    console.log(
      // campaignInfo,
      selectedOption,
      "==============CampiagnInfo"
      // updatedCampaignInfo,
      // selected
    );

    // selectedOption == "schedule_campaign" ? null : null;
    // selectedOption == "schedule_without_end_date" ? null : null;
    // selectedOption == "with_end_date" ? null : null;
    // selectedOption == "without_end_date" ? null : null;
    let toDate;
    let startDate;
    let endDate;
    let startedDate;
    let endedDate;

    if (selectedOption == "with_end_date") {
      console.log("with_end_date is working ======>");
      toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

      startDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a")
        .add(1, "minutes")
        .format();

      endDate = moment(
        `${campaignEndDate} ${campaignEndHour}:${campaignEndMinute}: 00  ${campaignEndTime}`,
        "YYYY-MM-DD hh:mm:ss a"
      ).format();
      startedDate = startDate;
      endedDate = endDate;
      console.log(
        "toDate==>",
        toDate,
        "startDate===>",
        startDate,
        "endDate===>",
        endDate
      );
    } else if (selectedOption == "without_end_date") {
      console.log("without_end_date is working ======>");
      toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

      startDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a")
        .add(1, "minutes")
        .format();

      endDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a")
        .add(10, "minutes")
        .format();

      startedDate = startDate;
      endedDate = null;
      console.log(
        "toDate==>",
        toDate,
        "startDate===>",
        startDate,
        "endDate===>",
        endDate
      );
    } else if (selectedOption == "schedule_without_end_date") {
      console.log("schedule_without_end_date is working ======>");
      toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

      startDate = moment(
        `${campaignStartDate} ${campaignStartHour}:${campaignStartMinute}: 00 ${campaignStartTime}`,
        "YYYY-MM-DD hh:mm:ss a"
      ).format();

      endDate = moment(
        `${campaignStartDate} ${campaignStartHour}:${campaignStartMinute}: 00 ${campaignStartTime}`,
        "YYYY-MM-DD hh:mm:ss a"
      )
        .add(10, "minutes")
        .format();

      startedDate = startDate;
      endedDate = null;
      console.log(
        "toDate==>",
        toDate,
        "startDate===>",
        startDate,
        "endDate===>",
        endDate
      );
    } else {
      console.log("schedule_campaign is working ======>");
      toDate = moment(new Date(), "YYYY-MM-DD hh:mm:ss a").format();

      startDate = moment(
        `${campaignStartDate} ${campaignStartHour}:${campaignStartMinute}: 00 ${campaignStartTime}`,
        "YYYY-MM-DD hh:mm:ss a"
      ).format();

      endDate = moment(
        `${campaignEndDate} ${campaignEndHour}:${campaignEndMinute}: 00  ${campaignEndTime}`,
        "YYYY-MM-DD hh:mm:ss a"
      ).format();
      startedDate = startDate;
      endedDate = endDate;
      console.log(
        "toDate==>",
        toDate,
        "startDate===>",
        startDate,
        "endDate===>",
        endDate
      );
    }

    let productCounts = await getAllCollectionesProductsCount(
      session,
      campaignInfo
    );

    console.log("************productCounts******************", productCounts);

    if (productCounts <= 1000) {
      if (startDate < endDate) {
        const cheeck = await db.Campaign.findAll({
          // where: {
          //   campaignEnd: {
          //     [Op.between]: [startDate, endDate],
          //   },
          //   storeId: session.id,
          // },
          where: {
            [Op.or]: [
              { campaignStatus: "Scheduled" },
              {
                [Op.and]: [{ campaignEnd: null }, { campaignStatus: "Active" }],
              },
              {
                [Op.or]: [
                  {
                    [Op.or]: [
                      {
                        // [Op.or]:[{campaignStatus: "Scheduled"},{campaignStatus: "Expired"}],
                        campaignStatus: "Scheduled",
                        campaignEnd: null,
                        campaignStart: {
                          [Op.gt]: startedDate,
                        },
                      },
                      {
                        campaignStatus: "Scheduled",
                        campaignEnd: null,
                        campaignStart: {
                          [Op.lt]: startedDate,
                        },
                      },
                    ],
                  },
                  {
                    campaignEnd: {
                      [Op.between]: [startedDate, endedDate],
                    },
                  },
                ],
              },
              // {
              //   [Op.and]: [
              //     {
              //       campaignStart: {
              //         [Op.between]: [startedDate, endedDate],
              //       },
              //     },
              //     {
              //       campaignEnd: {
              //         [Op.between]: [startedDate, endedDate],
              //       },
              //     },
              //   ],
              // },
            ],
            storeId: session.id,
          },
        });
        console.log(
          cheeck,
          "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Update Campaign"
        );
        if (toDate <= startDate) {
          let allProductsOfThisCampaignInfo = [];

          let ProductExistes = [];
          let ProductExistes2 = [];
          let cheeckBreak = false;
          let UpdateId;

          // let campaignStart
          // let campaignEnd
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
                  // campaignStart = new Date(campaign.campaignStart);
                  // campaignEnd = campaign.campaignEnd
                  //   ? new Date(campaign.campaignEnd)
                  //   : null;
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

                      // if (varId.id == dbVariantId && campaignStart < startedDate || campaignStart > startedDate) {
                      // if(!campaignEnd==null && campaignEnd > endedDate)
                      if (varId.id == dbVariantId) {
                        ProductExistes2.push(varId.id);
                        UpdateId = campaign.id;
                        cheeckBreak = true;

                        // if (campaignEnd==null) return;
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
            Status = 405;
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
              Status = 405;
              Message = "Already have a campaign with some Products and time";
              Err = " Looking Good";
            } else {
              if (uniqueArr.size < allProductsOfThisCampaignInfo.length) {
                Data = campaignInfo;
                redirect = false;
                Status = 405;
                Message = "some products are repeated in this campaign";
                Err = " Looking Good";
              } else {
                const campaigns = await db.Campaign.update(
                  {
                    campaignName: campaignTitle,
                    campaignOption: selectedOption,
                    // campaignStart: startDate,
                    // campaignEnd: endDate,
                    campaignStart: startedDate,
                    campaignEnd: endedDate,
                    campaignInfo: updatedCampaignInfo,
                    campaignMessage: "Looking Good",
                    campaignStatus: "Scheduled",
                  },
                  { where: { storeId: session.id, id: id } }
                );
                await startJob(session, id, startDate);
                endedDate == null ? null : await endJob(session, id, endDate);
                // await endJob(session, id, endDate);

                Data = [...campaigns];
                redirect = true;
                Status = 200;
                Message = " Campaign updated Successfully";
                Err = " Looking Good";
              }
            }
          }
        } else {
          Data = null;
          redirect = false;
          Status = 405;
          Message =
            "The Started  Date or Time must be greater than today's date or  time";
          Err = "Invalid Date or Time";
        }
      } else {
        Data = null;
        redirect = false;
        Status = 405;
        Message =
          "The end Date or Time must be greater than the start Date or Time";
        Err = "Invalid Date or Time";
      }
    } else {
      Data = campaignInfo;
      Status = 405;
      redirect = false;
      Message =
        "The number of products in the Campaign is exceeded the limit  ";
      Err = "Products exceeded the limit";
    }
  } catch (err) {
    console.log("updateCampaigns", err);
    redirect = false;
    Status = 404;
    Message = "Serer Error";
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
    Message = "Serer Error";
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
          ele.campaignEnd == null
            ? null
            : await endJob(session, ele.id, ele.campaignEnd);
          // await endJob(session, ele.id, ele.campaignEnd);
        }

        if (toDate > startDate && ele.campaignStatus == "Scheduled") {
          console.log("*******Start Campaign that Not Started********");
          // await endJob(session, ele.id, ele.campaignEnd);
          ele.campaignEnd == null
            ? null
            : await endJob(session, ele.id, ele.campaignEnd);
          await start(session, ele.id);
        }

        if (toDate > endDate && ele.campaignStatus == "Active") {
          console.log("*******End Campaign that Not End********");
          ele.campaignEnd == null ? null : await end(session, ele.id);
          // await end(session, ele.id);
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
    Message = "Serer Error";
    Err = err;
  }
};

export const cheackStatus = async (req, res) => {
  console.log("===> cheackStatus its work******************&&&&&&&&&&&&&&&&&&&&");
  // let Data = [];
  // let Status;
  // let Message;
  // let Err;
  try {
    const { id } = req.query;
    const session = await Shopify.Utils.loadCurrentSession(req, res, false);


    async function cheackStatus(session, id) {

      let result = false
      
        const findCampaign = await db.Campaign.findOne({
          where: { storeId: session.id, id: id },
        });
        if (findCampaign.isCampaignStart) {
          // Do something with the result
          console.log(findCampaign.isCampaignStart, "*******Result ********");
        } else {
          console.log(
            findCampaign.isCampaignStart,
            "*******Result == False ********"
          );
          result = true
        }
      
      return result;
    }


    const intervalId = setInterval(async() => {
      // Check the condition here
      
      let condition = await cheackStatus(session, id); 
      if (condition) {
        // Clear the interval if the condition is met
        clearInterval(intervalId);

          res.status(200).send({
            Response: {
              // Data,
              Status:200,
              Message:"Update Campaign Status successfully ",
              Err:"Loocking Good",
            },
          });
        // Perform any additional actions if the condition is met
        return;
      }
      // Do something else if the condition is not met
      console.log("&&&&&&&&&&&&Interval not cleared&&&&&&&&&&&");
    }, 5000); // Check every 1 second

    // This line will not be executed until the interval is cleared
    console.log(
      "********************Interval cleared****************",
      // intervalId
    ); 





    // console.log("##########################################");

    // console.log("its Destroy data");
    // Data = "findCampaign";
    // Status = 200;
    // Message = "Update Campaign Sta Successfully";
    // Err = " Looking Good";
  }
   catch (err) {
    console.log("cheackStatus", err);
      res.status(200).send({
        Response: {
          // Data,
          Status:404,
          Message:"Server Error",
          Err:err,
        },
      });
    // Status = 404;
    // Message = "Serer Error";
    // Err = err;
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
