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
import { useAuthenticatedFetch } from "../hooks";
export function CampaignSection() {
  const navigate = useNavigate();
  const [ResourcePickerState, setResourceState] = useState(false);
  const fetch = useAuthenticatedFetch();

  const [isLoading, setIsLoading] = useState(false);
  const [resourcePickerInitialSelection, setResourceInitialSelection] =
    useState(false);
  const [compaignInfo, setCompaignInfo] = useState([]);
  // Compaign title
  const [compaignTitle, setCompignTitle] = useState("");
  // Compaign Start State
  const [compaignStartDate, setCompaignStartDate] = useState("");
  const [compaignStartHour, setCompaignStartHour] = useState("0");
  const [compaignStartMinute, setCompaignStartMinute] = useState("0");
  const [compaignStartTime, setCompaignStartTime] = useState("AM");
  // Compaign End State
  const [compaignEndDate, setCompaignEndDate] = useState("");
  const [compaignEndHour, setCompaignEndHour] = useState("0");
  const [compaignEndMinute, setCompaignEndMinute] = useState("0");
  const [compaignEndTime, setCompaignEndTime] = useState("AM");
  // Toast Component State
  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState("");
  const [toastIsError, setToastIsError] = useState(false);

  // UseEffect && Callback

  const handleCompaignTitleTextChange = useCallback(
    (value) => setCompignTitle(value),
    []
  );

  // Compaign Start Callback

  const handleStartDateChange = useCallback((value) => {
    setCompaignStartDate(value);
    console.log(value, "???????????????");
  }, []);
  const handleStartHourChange = useCallback((value) => {
    setCompaignStartHour(value);
    console.log(value, "???????????????");
  }, []);
  const handleStartMinuteChange = useCallback(
    (value) => setCompaignStartMinute(value),
    []
  );
  const handleStartTimeChange = useCallback(
    (value) => setCompaignStartTime(value),
    []
  );

  // Compaign End Callback

  const handleEndDateChange = useCallback(
    (value) => setCompaignEndDate(value),
    []
  );
  const handleEndHourChange = useCallback(
    (value) => setCompaignEndHour(value),

    []
  );
  const handleEndMinuteChange = useCallback(
    (value) => setCompaignEndMinute(value),
    []
  );
  const handleEndTimeChange = useCallback(
    (value) => setCompaignEndTime(value),
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
    compaignInfo[arrayIndex].compaignQuantity = ele;

    setCompaignInfo([...compaignInfo]);
  };

  const handleCampaignPriceChange = (arrayIndex) => (ele) => {
    console.log(ele, "handleCampaignProductsPriceChange");
    compaignInfo[arrayIndex].compaignCostDiscount = ele;

    setCompaignInfo([...compaignInfo]);
  };

  const handleCampaignDicountChange = (arrayIndex) => (ele) => {
    console.log(ele, "handleCampaignProductsDicountChange");
    compaignInfo[arrayIndex].compaignDiccount = ele;

    setCompaignInfo([...compaignInfo]);
  };

  const handleCampaignVendorsChange = (arrayIndex) => (ele, index) => {
    console.log(ele, "handleCampaignVendorsChange");
    compaignInfo[arrayIndex].vendorsSlect = ele;

    setCompaignInfo([...compaignInfo]);
  };
  const handleSlectionsDelete = (arrayIndex) => (ele) => {
    compaignInfo.splice(arrayIndex, 1);
    setCompaignInfo([...compaignInfo]);
  };

  const handleTogglePopoverActive = (arrayIndex) => (ele) => {
    console.log(ele, "handleTogglePopoverActive");
    compaignInfo[arrayIndex].popoverActive = !ele;
    setCompaignInfo([...compaignInfo]);
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

  const rowMarkup = compaignInfo.map((ele, index) => {
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
        {/* <IndexTable.Cell>
          <Popover
            active={ele.popoverActive}
            activator={(index)=>{
               handleTogglePopoverActive(index)
              return activator
            }}
            onClose={handleTogglePopoverActive(index)}
          >
            <OptionList
              options={ele.vendorsOptions}
              selected={ele.vendorsSlect}
              onChange={handleCampaignVendorsChange(index)}
              allowMultiple
            />
          </Popover>
        </IndexTable.Cell> */}
        <IndexTable.Cell>
          <TextField
            type="number"
            value={ele.compaignQuantity}
            onChange={handleCampaignQuantityChange(index)}
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="number"
            value={ele.compaignCostDiscount}
            onChange={handleCampaignPriceChange(index)}
            suffix="%"
          />
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            type="number"
            value={ele.compaignDiccount}
            onChange={handleCampaignDicountChange(index)}
            suffix="%"
          />
        </IndexTable.Cell>
        {/* <IndexTable.Cell>
          <Button primary onClick={handleSlectionsDelete(index)}>
            Deleted
          </Button>
        </IndexTable.Cell> */}
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
    singular: "customer",
    plural: "customers",
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

  // Server Requests
  async function getCompainInfo(ids) {
    try {
      let obj = {
        collectionIds: ids,
      };
      await fetch("/api/compaign/CompaignInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(obj),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("getCompainInfo ======>", data.Response.Data);
          if (data.Response.Data) {
            setCompaignInfo(data.Response.Data);
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



  async function updateVariantes(ids, compaignInfo) {
    try {
      let obj = {
        collectionIds: ids,
        compaignInfo,
      };
      await fetch("/api/CompaignInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(obj),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("getCompainInfo ======>", data.Response.Data);
          if (data.Response.Data) {
            // setCompaignInfo(data.Response.Data);
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
  async function getCompain() {
    try {
      await fetch("/api/compaign/getCompaignsById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("getCompainInfo ======>", data.Response.Data);
          if (data.Response.Data) {
            setCompaignInfo(data.Response.Data);
            // setCompaignTitle(),
            // setCompaignInfo(),
            // setCompaignStartDate(),
            // setCompaignStartHour(),
            // setCompaignStartMinute(),
            // setCompaignStartTime(),
            // setCompaignEndDate(),
            // setCompaignEndHour(),
            // setCompaignEndMinute(),
            // setCompaignEndTime(),
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

  async function createCompaign(
    compaignTitle,
    compaignInfo,
    compaignStartDate,
    compaignStartHour,
    compaignStartMinute,
    compaignStartTime,
    compaignEndDate,
    compaignEndHour,
    compaignEndMinute,
    compaignEndTime
  ) {
    try {
      let obj = {
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
      };
      await fetch("/api/compaign/newCompaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(obj),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("getCompainInfo ======>", data.Response.Data);
          if (data.Response.Data) {
            setCompaignInfo(data.Response.Data);
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
          //     compaignQuantity: 1,
          //     compaignCostDiscount: 0,
          //     compaignDiccount: 0,
          //   });
          // });
          // setCompaignInfo(allProducts);
          // console.log("allProducts ====>", allProducts);
          getCompainInfo(ele.selection);
          setResourceState(false);
        }}
      />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextField
              label="Title"
              type="text"
              value={compaignTitle}
              onChange={handleCompaignTitleTextChange}
              helpText="Only You will See This Name or Title"
              autoComplete="text"
            />
          </Card>
        </Layout.Section>

        <TimeSection
          heading="Start Date"
          paragraph="Secduled when your campaign Start"
          inputTitle="Start Date"
          dateValue={compaignStartDate}
          hourSortOptions={hourSortOptions}
          minuteSortOptions={minuteSortOptions}
          timeSortOptions={timeSortOptions}
          hourValue={compaignStartHour}
          minuteValue={compaignStartMinute}
          timeValue={compaignStartTime}
          Date={handleStartDateChange}
          Hour={handleStartHourChange}
          Minute={handleStartMinuteChange}
          Time={handleStartTimeChange}
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
              Select Compaign Products
            </Button>
            {isLoading ? (
              <div style={{ padding: "5% 50%" }}>
                <Spinner accessibilityLabel="Spinner example" size="small" />
              </div>
            ) : compaignInfo.length == 0 ? null : (
              <IndexTable
                resourceName={resourceName}
                itemCount={resourcePickerInitialSelection.length}
                // loading={isLoading}
                headings={[
                  { title: "" },
                  { title: "Quantity" },
                  { title: "Cost" },
                  { title: "Discount" },
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
          dateValue={compaignEndDate}
          hourSortOptions={hourSortOptions}
          minuteSortOptions={minuteSortOptions}
          timeSortOptions={timeSortOptions}
          hourValue={compaignEndHour}
          minuteValue={compaignEndMinute}
          timeValue={compaignEndTime}
          Date={handleEndDateChange}
          Hour={handleEndHourChange}
          Minute={handleEndMinuteChange}
          Time={handleEndTimeChange}
        />
      </Layout>

      <PageActions
        primaryAction={{
          content: "Save",
          onAction: () => {
            createCompaign(
              compaignTitle,
              compaignInfo,
              compaignStartDate,
              compaignStartHour,
              compaignStartMinute,
              compaignStartTime,
              compaignEndDate,
              compaignEndHour,
              compaignEndMinute,
              compaignEndTime
            );
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            // destructive: true,
            onAction: () => {
              // navigate("/dashboard");
              updateVariantes(resourcePickerInitialSelection, compaignInfo);
            },
          },
        ]}
      />
      {toastActive ? renderToastComponent : null}
    </Page>
  );
}
