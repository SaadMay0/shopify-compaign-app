import { ResourcePicker } from "@shopify/app-bridge-react";

import { useState, useCallback, useEffect } from "react";
// import WebSocket from "ws";

import {
  Page,
  Layout,
  Card,
  TextField,
  Select,
  Stack,
  Button,
  IndexTable,
  Thumbnail,
  TextStyle,
  PageActions,
  Spinner,
  OptionList,
  Popover,
  Banner,
  Frame,
  Loading,
  ChoiceList,
  // TitleBar,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { ImageMajor } from "@shopify/polaris-icons";
import { TimeSection } from "./TimeSection";
import { ToastComponent } from "./Tost";
import { BannerComponent } from "./Banner";
import { useNavigate } from "@shopify/app-bridge-react";
// import { useLocation } from "react-router-dom";
import { useAuthenticatedFetch } from "../hooks";

export function CampaignSection2() {
  //   const state = useLocation();
  const navigate = useNavigate();

  //  Other State
  const [startDateComponentDisable, setStartDateComponentDisable] =
    useState(false);
  const [endDateComponentDisable, setEndDateComponentDisable] = useState(false);
  const [ResourcePickerState, setResourceState] = useState(false);
  const fetch = useAuthenticatedFetch();

  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [resourcePickerInitialSelection, setResourceInitialSelection] =
    useState([]);

  const [updateCampaign, setUpdateCampaign] = useState(false);

  const [campaignInfo, setCampaignInfo] = useState([]);
  // Campaign title
  const [campaignTitle, setCompignTitle] = useState("");
  // Campaign Start State
  const [campaignStartDate, setCampaignStartDate] = useState("");
  const [campaignStartHour, setCampaignStartHour] = useState("88");
  const [campaignStartMinute, setCampaignStartMinute] = useState("99");
  const [campaignStartTime, setCampaignStartTime] = useState("AM");
  // Campaign End State
  const [campaignEndDate, setCampaignEndDate] = useState("");
  const [campaignEndHour, setCampaignEndHour] = useState("88");
  const [campaignEndMinute, setCampaignEndMinute] = useState("99");
  const [campaignEndTime, setCampaignEndTime] = useState("AM");
  // Toast Component State
  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState("");
  const [toastIsError, setToastIsError] = useState(false);
  //  ChoiceList State
  const [selected, setSelected] = useState(["schedule_campaign"]);

  // console.log(
  //   campaignStartDate,
  //   campaignStartHour,
  //   campaignStartMinute,
  //   campaignStartTime,
  //   "Start Campaign *******",
  //   selected
  // );

  // Banner component States
  const [bannerActive, setBannerActive] = useState(false);
  const [bannerTitle, setBannerTitle] = useState("Note");
  const [bannerStatus, setBannerStatus] = useState("warning");
  const [bannerDescription, setBannerDescription] = useState("");
  const bannerToggleActive = useCallback(
    () => setBannerActive((active) => !active),
    []
  );

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );
  // Banner End

  // UseEffect && Callback

  const handleCampaignTitleTextChange = useCallback(
    (value) => setCompignTitle(value),
    []
  );

  // Campaign Start Callback

  const handleStartDateChange = useCallback((value) => {
    setCampaignStartDate(value);
  }, []);
  const handleStartHourChange = useCallback((value) => {
    setCampaignStartHour(value);
  }, []);
  const handleStartMinuteChange = useCallback((value) => {
    setCampaignStartMinute(value);
  }, []);
  const handleStartTimeChange = useCallback(
    (value) => setCampaignStartTime(value),
    []
  );

  // Campaign End Callback

  const handleEndDateChange = useCallback(
    (value) => setCampaignEndDate(value),
    []
  );
  const handleEndHourChange = useCallback(
    (value) => setCampaignEndHour(value),

    []
  );
  const handleEndMinuteChange = useCallback(
    (value) => setCampaignEndMinute(value),
    []
  );
  const handleEndTimeChange = useCallback(
    (value) => setCampaignEndTime(value),
    []
  );

  // Toast Callback
  const toastToggleActive = useCallback(
    () => setToastActive((active) => !active),
    []
  );

  // choices list Callback
  const handleChoiceListChange = useCallback((value) => {
    // console.log(value[0], "&&&&&&&&&&");
    value[0] == "schedule_campaign"
      ? (setStartDateComponentDisable(false), setEndDateComponentDisable(false))
      : null;
    value[0] == "schedule_without_end_date"
      ? (setStartDateComponentDisable(false), setEndDateComponentDisable(true))
      : null;
    value[0] == "with_end_date"
      ? (setStartDateComponentDisable(true), setEndDateComponentDisable(false))
      : null;
    value[0] == "without_end_date"
      ? (setStartDateComponentDisable(true), setEndDateComponentDisable(true))
      : null;
    setSelected(value);
  }, []);

  // Functions

  const handleCampaignPriceChange = (arrayIndex) => (ele) => {
    // console.log(ele, "handleCampaignProductsPriceChange");
    campaignInfo[arrayIndex].campaignCostDiscount = ele;

    setCampaignInfo([...campaignInfo]);
  };

  const handleCampaignDicountChange = (arrayIndex) => (ele) => {
    // console.log(ele, "handleCampaignProductsDicountChange");
    campaignInfo[arrayIndex].campaignDiscount = ele;

    setCampaignInfo([...campaignInfo]);
  };

  const handleCampaignVendorsChange = (arrayIndex) => (ele, index) => {
    // console.log(ele, "handleCampaignVendorsChange");
    campaignInfo[arrayIndex].vendorsSelect = ele;

    setCampaignInfo([...campaignInfo]);
  };
  const handleSelectionsDelete = (arrayIndex) => (ele) => {
    campaignInfo.splice(arrayIndex, 1);
    setCampaignInfo([...campaignInfo]);
  };

  const activator = (index, ele) => {
    return (
      <Button
        onClick={(e) => {
          // console.log("buttom", ele.popoverActive);
          campaignInfo[index].popoverActive = !ele.popoverActive;
          setCampaignInfo([...campaignInfo]);
        }}
        disclosure
      >
        Vendors
      </Button>
    );
  };

  const rowMarkup = campaignInfo.map((ele, index) => {
    // const key = `table-row-${index}`;
    // console.log(ele)
    return (
      <IndexTable.Row id={ele.id} key={ele.id} position={index}>
        <IndexTable.Cell>
          <Stack alignment="center">
            <Thumbnail
              source={ele.image ? ele.image : ImageMajor}
              alt="Black orange scarf"
              size="large"
            />
            <TextStyle>{ele.title}</TextStyle>
          </Stack>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Popover
            active={ele.popoverActive}
            activator={activator(index, ele)}
            // onClose={handleTogglePopoverActive(index)}
          >
            <OptionList
              options={ele.vendorsOptions}
              selected={ele.vendorsSelect}
              onChange={handleCampaignVendorsChange(index)}
              allowMultiple
            />
          </Popover>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="number"
            value={ele.campaignCostDiscount}
            onChange={handleCampaignPriceChange(index)}
            suffix="%"
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="number"
            value={ele.campaignDiscount}
            onChange={handleCampaignDicountChange(index)}
            suffix="%"
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Button destructive onClick={handleSelectionsDelete(index)}>
            Deleted
          </Button>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  let renderToastComponent = (
    <ToastComponent
      toggleActive={toastToggleActive}
      active={toastActive}
      content={toastContent}
      error={toastIsError}
    />
  );

  const renderBanner = (
    <BannerComponent
      active={bannerActive}
      title={bannerTitle}
      status={bannerStatus}
      Description={bannerDescription}
      toggleActive={bannerToggleActive}
    />
  );

  // Variables

  const resourceName = {
    singular: "Campaign",
    plural: "Campaigns",
  };

  const hourSortOptions = [
    { value: "88", label: "hh" },
    { value: "0", label: "00" },
    { value: "1", label: "01" },
    { value: "2", label: "02" },
    { value: "3", label: "03" },
    { value: "4", label: "04" },
    { value: "5", label: "05" },
    { value: "6", label: "06" },
    { value: "7", label: "07" },
    { value: "8", label: "08" },
    { value: "9", label: "09" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
  ];
  const minuteSortOptions = [
    { value: "99", label: "mm" },
    { value: "0", label: "00" },
    { value: "1", label: "01" },
    { value: "2", label: "02" },
    { value: "3", label: "03" },
    { value: "4", label: "04" },
    { value: "5", label: "05" },
    { value: "6", label: "06" },
    { value: "7", label: "07" },
    { value: "8", label: "08" },
    { value: "9", label: "09" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" },
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
    { value: "21", label: "21" },
    { value: "22", label: "22" },
    { value: "23", label: "23" },
    { value: "24", label: "24" },
    { value: "25", label: "25" },
    { value: "26", label: "26" },
    { value: "27", label: "27" },
    { value: "28", label: "28" },
    { value: "29", label: "29" },
    { value: "30", label: "30" },
    { value: "31", label: "31" },
    { value: "32", label: "32" },
    { value: "33", label: "33" },
    { value: "34", label: "34" },
    { value: "35", label: "35" },
    { value: "36", label: "36" },
    { value: "37", label: "37" },
    { value: "38", label: "38" },
    { value: "39", label: "39" },
    { value: "40", label: "40" },
    { value: "41", label: "41" },
    { value: "42", label: "42" },
    { value: "43", label: "43" },
    { value: "44", label: "44" },
    { value: "45", label: "45" },
    { value: "46", label: "46" },
    { value: "47", label: "47" },
    { value: "48", label: "48" },
    { value: "49", label: "49" },
    { value: "50", label: "50" },
    { value: "51", label: "51" },
    { value: "52", label: "52" },
    { value: "53", label: "53" },
    { value: "54", label: "54" },
    { value: "55", label: "55" },
    { value: "56", label: "56" },
    { value: "57", label: "57" },
    { value: "58", label: "58" },
    { value: "59", label: "59" },
    // { value: "60", label: "60" },
  ];
  const timeSortOptions = [
    { value: "AM", label: "AM" },
    { value: "PM", label: "PM" },
  ];

  useEffect(() => {
    if (
      window.location.search.length < 50 &&
      window.location.search.length > 15
    ) {
      setIsLoading(true);
      setUpdateCampaign(true);
      getCampain();
    }
  }, []);

  // Server Requests
  async function getCampainInfo(ids, campaignInfo) {
    try {
      let obj = {
        collectionIds: ids,
        campaignInfo,
      };
      await fetch("/api/campaign/CampaignInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(obj),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log("getCampainInfo ======>", data.Response.Data);
          if (data.Response.Status == 200) {
            setCampaignInfo(data.Response.Data);
          } else {
            setToastContent(data.Response.Message);
            setToastIsError(true);
            setToastActive(true);
          }
          setIsLoading(false);

          // console.log("getCollectionProduct get Upsell *******************");
          return data;
        });
    } catch (error) {
      console.log(`${error}`);
    }
  }

  async function getCampain() {
    let id = window.location.search.split("=").pop();
    try {
      await fetch(`/api/campaign/getCampaignsById?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.Response.Status == 200) {
            const {
              campaignStart,
              campaignEnd,
              campaignInfo,
              campaignName,
              campaignOption,
              campaignStatus,
              campaignMessage,
            } = data.Response.Data;

            let startDate = new Date(campaignStart);
            let endDate = new Date(campaignEnd);

            let startdd = startDate.getDate(); //.toString().split(",").shift().replace("/","-").replace("/","-")
            let startmm = startDate.toLocaleString().split("/").shift();
            let startyy = startDate.getFullYear();

            let enddd = endDate.getDate(); //.toString().split(",").shift().replace("/","-").replace("/","-")
            let endmm = endDate.toLocaleString().split("/").shift();
            let endyy = endDate.getFullYear();

            let startedDate = startDate.toISOString().split("T").shift();
            // console.log(
            //   // dd,
            //   startDate.toLocaleString().split("/").shift(),
            //   "************startDate***********",
            //   startdd,
            //   startmm,
            //   startyy
            // );

            startmm = startmm < 10 ? `0${startmm}` : startmm;
            startdd = startdd < 10 ? `0${startdd}` : startdd;
            endmm = endmm < 10 ? `0${endmm}` : endmm;
            enddd = enddd < 10 ? `0${enddd}` : enddd;

            let startHour = startDate.getHours();
            let startMinute = startDate.getMinutes();
            let startTime = Number(startHour) < 12 ? "AM" : "PM";

            let endHour = endDate.getHours();
            let endMinute = endDate.getMinutes();
            let endTime = Number(endHour) < 12 ? "AM" : "PM";

            startHour = startHour > 12 ? Number(startHour) - 12 : startHour;
            endHour = endHour > 12 ? Number(endHour) - 12 : endHour;
            // startHour == 0 ?? "12";
            // endHour == 0 ? "12" : endHour;
            let start = `${startyy}-${startmm}-${startdd}`;
            let end = `${endyy}-${endmm}-${enddd}`;
            // console.log(
            //   // typeof startHour,
            //   `${startyy}-${startmm}-${startdd}`,
            //   // startHour == 0 ? "1" : startHour,
            //   "************StartDate And EndDate***********",
            //   // typeof endHour
            //   `${endyy}-${endmm}-${enddd}`,
            // );
            // setIsLoading(true);
            // *****************************************************
            campaignOption == "schedule_campaign"
              ? (setStartDateComponentDisable(false),
                setEndDateComponentDisable(false))
              : null;
            campaignOption == "schedule_without_end_date"
              ? (setStartDateComponentDisable(false),
                setEndDateComponentDisable(true))
              : null;
            campaignOption == "with_end_date"
              ? (setStartDateComponentDisable(true),
                setEndDateComponentDisable(false))
              : null;
            campaignOption == "without_end_date"
              ? (setStartDateComponentDisable(true),
                setEndDateComponentDisable(true))
              : null;
            // *************************************

            setSelected([campaignOption]);
            setResourceInitialSelection(campaignInfo);
            setCampaignInfo(campaignInfo);
            setCompignTitle(campaignName);
            setCampaignStartDate(start);
            setCampaignStartHour(startHour.toString());
            setCampaignStartMinute(startMinute.toString());
            setCampaignStartTime(startTime);
            setCampaignEndDate(end);
            setCampaignEndHour(endHour.toString());
            setCampaignEndMinute(endMinute.toString());
            setCampaignEndTime(endTime);
            setBannerDescription(campaignMessage);
            campaignStatus == "Failed" ? setBannerActive(true) : null;
          } else {
            setToastContent(data.Response.Message);
            setToastIsError(true);
            setToastActive(true);
          }
          setIsLoading(false);
          // setUpdateCampaign(true)

          // console.log("getCollectionProduct get Upsell *******************");
          return data;
        });
    } catch (error) {
      console.log(`${error}`);
    }
  }

  async function createCampaign(
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
    selected
  ) {
    // console.log("createCampaign is Work");
    try {
      let obj = {
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
      };
      await fetch("/api/campaign/newCampaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(obj),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log("createCampaign ======>", data.Response.Data);
          if (data.Response.Status == 200) {
            // setRedirect(data.Response.redirect);
            setResourceInitialSelection(data.Response.Data);
            setCampaignInfo(data.Response.Data);
            setCampaignInfo(data.Response.Data);
            setToastContent(data.Response.Message);
            setToastIsError(false);
            setToastActive(true);

            setTimeout(() => {
              data.Response.redirect ? navigate("/") : null;
            }, 3000);
          } else {
            setToastContent(data.Response.Message);
            setToastIsError(true);
            setToastActive(true);
          }
          setIsLoading(false);
          return data;
        });
    } catch (error) {
      console.log(`${error}`);
    }
  }

  async function updateCampaigns(
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
    selected
  ) {
    // console.log("updateCampaigns is Work");
    let id = window.location.search.split("=").pop();
    try {
      let obj = {
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
      };
      await fetch("/api/campaign/updateCampaigns", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(obj),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log("updateCampaigns ======>", data.Response.Data);
          if (data.Response.Status == 200) {
            // setRedirect(data.Response.redirect);
            setCampaignInfo(data.Response.Data);
            setToastContent(data.Response.Message);
            setToastIsError(false);
            setToastActive(true);
            setIsLoading(true);

            setTimeout(() => {
              data.Response.redirect ? navigate("/") : null;
            }, 3000);
          } else {
            setToastContent(data.Response.Message);
            setToastIsError(true);
            setToastActive(true);
          }
          setIsLoading(false);
          return data;
        });
    } catch (error) {
      console.log(`${error}`);
    }
  }

  return (
    <>
      {isLoading ? (
        <div style={{ height: "1px" }}>
          <Frame>
            <Loading />
          </Frame>
        </div>
      ) : null}

      <TitleBar
        title="Campaign"
        primaryAction={{
          content: "Save",
          onAction: () => {
            if (campaignTitle && campaignInfo) {
              setIsLoading(true);
              // console.log("Passss");
              isLoading
                ? null
                : updateCampaign
                ? updateCampaigns(
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
                    selected
                  )
                : createCampaign(
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
                    selected
                  );
            } else {
              setToastContent("All fields are mandatory");
              setToastIsError(true);
              setToastActive(true);
            }
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => {
              navigate("/");
            },
          },
        ]}
      />
      <Page>
        {renderBanner}
        <br />
        <ResourcePicker
          resourceType="Collection"
          showVariants={true}
          open={ResourcePickerState}
          // initialSelectionIds={{id:"gid://shopify/Collection/425608020246"}}
          onCancel={() => {
            setResourceState(false);
          }}
          onSelection={(ele) => {
            setIsLoading(true);
            setResourceInitialSelection(ele.selection);
            getCampainInfo(ele.selection, campaignInfo);
            setResourceState(false);
          }}
        />
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <TextField
                label="Title"
                type="text"
                value={campaignTitle}
                onChange={handleCampaignTitleTextChange}
                helpText="Only you will see this Name or Title"
                autoComplete="text"
              />
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card sectioned>
              <ChoiceList
                title="When does the campaign start or stop"
                choices={[
                  {
                    label: "Schedule campaign",
                    value: "schedule_campaign",
                  },
                  {
                    label: "Schedule a campaign without an end date",
                    value: "schedule_without_end_date",
                  },
                  {
                    label: "Start the campaign right away  with an end date",
                    value: "with_end_date",
                  },
                  {
                    label: "Start the campaign right away  without an end date",
                    value: "without_end_date",
                  },
                ]}
                selected={selected}
                onChange={handleChoiceListChange}
              />
            </Card>
          </Layout.Section>

          {startDateComponentDisable ? null : (
            <TimeSection
              heading="Start Date"
              paragraph="When does the campaign start"
              inputTitle="Start Date"
              dateValue={campaignStartDate}
              hourSortOptions={hourSortOptions}
              minuteSortOptions={minuteSortOptions}
              timeSortOptions={timeSortOptions}
              hourValue={campaignStartHour}
              minuteValue={campaignStartMinute}
              timeValue={campaignStartTime}
              handleDate={handleStartDateChange}
              handleHour={handleStartHourChange}
              handleMinute={handleStartMinuteChange}
              handleTime={handleStartTimeChange}
            />
          )}

          <Layout.Section>
            <Card title="Discount" sectioned>
              <p>
                Only collection with a maximum of 1000 products can be
                discounted
              </p>

              <div style={{ height: "10px" }}></div>
              <Banner
                title="Make sure that all collections are up to date "
                status="warning"
              >
                If the selected collection is changed. Edit the campaign and
                delete that selected collection and then re-select that
                collection.
              </Banner>
              <br />

              <Button
                primary
                onClick={() => {
                  setResourceState(true);
                }}
              >
                Select campaign products
              </Button>
              {isLoading ? (
                <div style={{ padding: "5% 50%" }}>
                  <Spinner accessibilityLabel="Spinner example" size="small" />
                </div>
              ) : campaignInfo.length == 0 ? null : (
                <IndexTable
                  resourceName={resourceName}
                  itemCount={resourcePickerInitialSelection.length}
                  loading={isLoading}
                  headings={[
                    { title: "" },
                    { title: "Vendors" },
                    { title: "Cost Discount" },
                    { title: "Price Discount" },
                    { title: "Action" },
                  ]}
                  selectable={false}
                >
                  {rowMarkup}
                </IndexTable>
              )}
            </Card>
          </Layout.Section>

          {endDateComponentDisable ? null : (
            <TimeSection
              heading="End Date"
              paragraph="When does the campaign end"
              inputTitle="End Date"
              dateValue={campaignEndDate}
              hourSortOptions={hourSortOptions}
              minuteSortOptions={minuteSortOptions}
              timeSortOptions={timeSortOptions}
              hourValue={campaignEndHour}
              minuteValue={campaignEndMinute}
              timeValue={campaignEndTime}
              handleDate={handleEndDateChange}
              handleHour={handleEndHourChange}
              handleMinute={handleEndMinuteChange}
              handleTime={handleEndTimeChange}
            />
          )}
        </Layout>

        <PageActions
          primaryAction={{
            content: "Save",
            onAction: () => {
              if (campaignTitle && campaignInfo) {
                // console.log("Passss");
                setIsLoading(true);
                isLoading
                  ? null
                  : updateCampaign
                  ? updateCampaigns(
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
                      selected
                    )
                  : createCampaign(
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
                      selected
                    );
              } else {
                setToastContent("All fields are mandatory");
                setToastIsError(true);
                setToastActive(true);
              }
            },
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => {
                navigate("/");
              },
            },
          ]}
        />
        {toastActive ? renderToastComponent : null}
      </Page>
    </>
  );
}
