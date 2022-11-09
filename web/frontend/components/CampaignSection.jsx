import { ResourcePicker } from "@shopify/app-bridge-react";

import { useState, useCallback, useEffect } from "react";

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
} from "@shopify/polaris";
import { ImageMajor } from "@shopify/polaris-icons";
import { TimeSection } from "./TimeSection";
import { ToastComponent } from "./Tost";
import { useNavigate } from "@shopify/app-bridge-react";
import { useLocation } from "react-router-dom";
import { useAuthenticatedFetch } from "../hooks";

export function CampaignSection() {
  const state = useLocation();
  // const { campaignData } = state;
  const navigate = useNavigate();

  const [ResourcePickerState, setResourceState] = useState(false);
  const fetch = useAuthenticatedFetch();

  const [isLoading, setIsLoading] = useState(false);
  const [resourcePickerInitialSelection, setResourceInitialSelection] =
    useState([]);
  const [campaignInfo, setCampaignInfo] = useState([]);
  // Campaign title
  const [campaignTitle, setCompignTitle] = useState("");
  // Campaign Start State
  const [campaignStartDate, setCampaignStartDate] = useState("");
  const [campaignStartHour, setCampaignStartHour] = useState("0");
  const [campaignStartMinute, setCampaignStartMinute] = useState("0");
  const [campaignStartTime, setCampaignStartTime] = useState("AM");
  // Campaign End State
  const [campaignEndDate, setCampaignEndDate] = useState("");
  const [campaignEndHour, setCampaignEndHour] = useState("0");
  const [campaignEndMinute, setCampaignEndMinute] = useState("0");
  const [campaignEndTime, setCampaignEndTime] = useState("AM");
  // Toast Component State
  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState("");
  const [toastIsError, setToastIsError] = useState(false);

  // console.log(
    // campaignInfo,
    // campaignStartDate,
    // campaignStartHour,
    // campaignStartMinute,
    // campaignStartTime,
    // "********************Campain Start"
  // );

  // console.log(
  //   campaignEndDate,
  //   campaignEndHour, 
  //   campaignEndMinute,
  //   campaignEndTime,
  //   "********************Campain End"
  // );
  // setTimeout(() => {
  //   console.log(state, "************", window.location);
    
  // },4000)

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

  // Functions

  const handleCampaignQuantityChange = (arrayIndex) => (ele) => {
    console.log(ele, "handleCampaignQuantityChange");
    campaignInfo[arrayIndex].campaignQuantity = ele;

    setCampaignInfo([...campaignInfo]);
  };

  const handleCampaignPriceChange = (arrayIndex) => (ele) => {
    console.log(ele, "handleCampaignProductsPriceChange");
    campaignInfo[arrayIndex].campaignCostDiscount = ele;

    setCampaignInfo([...campaignInfo]);
  };

  const handleCampaignDicountChange = (arrayIndex) => (ele) => {
    console.log(ele, "handleCampaignProductsDicountChange");
    campaignInfo[arrayIndex].campaignDiscount = ele;

    setCampaignInfo([...campaignInfo]);
  };

  const handleCampaignVendorsChange = (arrayIndex) => (ele, index) => {
    console.log(ele, "handleCampaignVendorsChange");
    campaignInfo[arrayIndex].vendorsSelect = ele;

    setCampaignInfo([...campaignInfo]);
  };
  const handleSelectionsDelete = (arrayIndex) => (ele) => {
    campaignInfo.splice(arrayIndex, 1);
    setCampaignInfo([...campaignInfo]);
  };

  const handleTogglePopoverActive = (arrayIndex) => (ele) => {
    console.log(ele, "handleTogglePopoverActive");
    campaignInfo[arrayIndex].popoverActive = !ele;
    setCampaignInfo([...campaignInfo]);
  };

  const activator = (
    <Button
      onClick={(e) => {
        e.stopPropagation(e);
        //  handleTogglePopoverActive(index);
      }}
      disclosure
    >
      Vendors
    </Button>
  );

  const rowMarkup = campaignInfo.map((ele, index) => {
    const key = `table-row-${index}`;
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
          {/* <Popover
            active={ele.popoverActive}
            activator={(index)=>activator}
            onClose={handleTogglePopoverActive(index)}
          > */}
            <OptionList
              options={ele.vendorsOptions}
              selected={ele.vendorsSelect}
              onChange={handleCampaignVendorsChange(index)}
              allowMultiple
            />
          {/* </Popover> */}
        </IndexTable.Cell>
        {/* <IndexTable.Cell>
          <TextField
            type="number"
            value={ele.campaignQuantity}
            onChange={handleCampaignQuantityChange(index)}
          />
        </IndexTable.Cell> */}
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
          <Button primary onClick={handleSelectionsDelete(index)}>
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

  // Variables

  const resourceName = {
    singular: "Campaign",
    plural: "Campaignes",
  };

  const hourSortOptions = [
    { value: "0", label: "hh" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
  ];
  const minuteSortOptions = [
    { value: "0", label: "mm" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
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
    { value: "60", label: "60" },
  ];
  const timeSortOptions = [
    { value: "AM", label: "AM" },
    { value: "PM", label: "PM" },
  ];

  // *******************************************************

  // if (campaignData) {
  useEffect(() => {
      getCampain(); 
  }, []);
  // }
  // }
  // Server Requests
  async function getCampainInfo(ids) {
    try {
      let obj = {
        collectionIds: ids,
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
          console.log("getCampainInfo ======>", data.Response.Data);
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

  async function updateVariantes(ids, campaignInfo, campaignTitle) {
    try {
      let obj = {
        collectionIds: ids,
        campaignInfo,
        campaignTitle,
      };
      await fetch("/api/CampaignInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(obj),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("getCampainInfo ======>", data.Response.Data);
          if (data.Response.Data) {
            // setCampaignInfo(data.Response.Data);
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
    let id = window.location.search.split("=").pop()
    try {
      await fetch(`/api/campaign/getCampaignsById?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("getCampain ======>", data);
          if (data.Response.Status == 200) {
            
            console.log("campaign data from the api response", data);
            const { campaignStart, campaignEnd, campaignInfo, campaignName } =
              data.Response.Data;

            let startDate = new Date(campaignStart);
            let endDate = new Date(campaignEnd);

            let startHour = startDate.getHours() + 1;
            let startMinute = startDate.getMinutes() + 1;
            let startTime = Number(startHour) <= 12 ? "AM" : "PM";

            let endHour = endDate.getHours() + 1;
            let endMinute = endDate.getMinutes() + 1;
            let endTime = Number(endHour) <= 12 ? "AM" : "PM";

             startHour =
              startHour > 12 ? Number(startHour) - 12 : startHour;
             endHour = endHour > 12 ? Number(endHour) - 12 : endHour;
            let end = endDate.toLocaleDateString().split("/");
            let start = startDate.toLocaleDateString().split("/");
            setIsLoading(true);
            setResourceInitialSelection(campaignInfo);
            setCampaignInfo(campaignInfo);
            setCompignTitle(campaignName);
            setCampaignStartDate(`${start[2]}-${start[0]}-${start[1]}`);
            setCampaignStartHour(startHour.toString());
            setCampaignStartMinute(startMinute.toString());
            setCampaignStartTime(startTime);
            setCampaignEndDate(`${end[2]}-${end[0]}-${end[1]}`);
            setCampaignEndHour(endHour.toString());
            setCampaignEndMinute(endMinute.toString());
            setCampaignEndTime(endTime);
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
    campaignEndTime
  ) {
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
          console.log("getCampainInfo ======>", data.Response.Data);
          if (data.Response.Status == 200) {
            setCampaignInfo(data.Response.Data);
            setToastContent(data.Response.Message);
            setToastIsError(false);
            setToastActive(true);

            // setTimeout(() => {
            // navigate("/dashboard");

            // },4000)
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

  return (
    <Page>
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
          // console.log("====>", ele.selection);
          // let allProducts = ele.selection;
          // allProducts.map((ele) => {
          //   Object.assign(ele, {
          //     campaignQuantity: 1,
          //     campaignCostDiscount: 0,
          //     campaignDiscount: 0,
          //   });
          // });
          // setCampaignInfo(allProducts);
          // console.log("allProducts ====>", allProducts);
          getCampainInfo(ele.selection);
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
              helpText="Only You will See This Name or Title"
              autoComplete="text"
            />
          </Card>
        </Layout.Section>

        <TimeSection
          heading="Start Date"
          paragraph="Secduled when your campaign Start"
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

        <Layout.Section>
          <Card title="Discount" sectioned>
            <p>
              only Collection with a maximum of 1000 Products can be Discounted
            </p>
            <br />
            <Button
              primary
              onClick={() => {
                setResourceState(true);
                // console.log(ele, "===resordes Pricker");
              }}
            >
              Select Campaign Products
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
                  { title: "Cost" },
                  { title: "Discount" },
                  { title: "Actions" },
                ]}
                selectable={false}
              >
                {rowMarkup}
              </IndexTable>
            )}
          </Card>
        </Layout.Section>

        <TimeSection
          heading="End Date"
          paragraph="Secduled when your campaign End"
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
      </Layout>

      <PageActions
        primaryAction={{
          content: "Save",
          onAction: () => {
            createCampaign(
              campaignTitle,
              campaignInfo,
              campaignStartDate,
              campaignStartHour,
              campaignStartMinute,
              campaignStartTime,
              campaignEndDate,
              campaignEndHour,
              campaignEndMinute,
              campaignEndTime
            );
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            // destructive: true,
            onAction: () => {
              console.log(state, "************", window.location.search);
              // navigate("/dashboard");
              // updateVariantes(
              //   resourcePickerInitialSelection,
              //   campaignInfo,
              //   campaignTitle
              // );
            },
          },
        ]}
      />
      {toastActive ? renderToastComponent : null}
    </Page>
  );
}
