import { useState, useCallback, useEffect } from "react";
import {
  IndexTable,
  TextStyle,
  useIndexResourceState,
  Button,
  Spinner,
} from "@shopify/polaris";

import { ToastComponent } from "./Tost";

import { useAuthenticatedFetch } from "../hooks";

export function CampaignTable({
  filterOrders,
  setBannerTitle,
  setBannerStatus,
  bannerToggleActive,
  setBannerDescription,
}) {
  const fetch = useAuthenticatedFetch();

  // const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // const [showPopUp, setShowPopUp] = useState();
  // const [sortValue, setSortValue] = useState("shopifyOrderNbr");
  const [campaigns, setCampaigns] = useState([]);
  // const [preferences, setpreferences] = useState();
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(campaigns);

  // Toast Component Start

  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState("");
  const [isToastError, setIsToastError] = useState(false);

  //Callback
  const toggleToasrActive = useCallback(
    () => setToastActive((active) => !active),
    []
  );

  // Tost Component End
  // const [bannerActive, setBannerActive] = useState(true);
  // const [bannerTitle, setBannerTitle] = useState(false);
  // const [bannerStatus, setBannerStatus] = useState(false);
  // const bannerToggleActive = useCallback(
  //   () => setBannerActive((active) => !active),
  //   []
  // );

  // const [selectedResourcesState,setSelectedResourcesState] = useState("selectedResources");

  const [tableHeaderTitles, setTableHeaderTitles] = useState([
    { key: "campaignName", title: "Campaignes" },
    // { key: "campaignOrders", title: "Orders" },
    // { key: "campaignSales", title: "Sales" },
    { key: "campaignStatus", title: "Status" },
    { key: "campaignStart", title: "Start" },
    { key: "campaignEnd", title: "End" },
  ]);

  const resourceName = {
    singular: "campaign",
    plural: "campaigns",
  };

  //   const renderLightbox = (
  //     <Lightbox
  //       handleLightboxToggle={handle}
  //       active={active}
  //       orderId={showPopUp}
  //       preferences={preferences}
  //       orders={campaigns}
  //       getAllData={getAllData}
  //       setIsLoading={setIsLoading}
  //     />
  //   );

  let renderToast = (
    <ToastComponent
      toggleActive={toggleToasrActive}
      active={toastActive}
      content={toastContent}
      error={isToastError}
    />
  );

  // const renderBanner = (
  //   <BannerComponent
  //     active={bannerActive}
  //     title={bannerTitle}
  //     status={bannerStatus}
  //     toggleActive={bannerToggleActive}
  //   />
  // );

  const rowMarkup = campaigns.map((ele, index) => {
    return (
      <>
        <IndexTable.Row
          id={ele.id}
          key={ele.id}
          onClick={(e) => {}}
          selected={selectedResources.includes(ele.id)}
          position={index}
        >
          <IndexTable.Cell>
            <TextStyle variation="strong">{ele.campaignName}</TextStyle>
          </IndexTable.Cell>
          {/* <IndexTable.Cell>
            <TextStyle>{ele.campaignOrders}</TextStyle>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <TextStyle>{ele.campaignSales}</TextStyle>
          </IndexTable.Cell> */}
          <IndexTable.Cell>
            <TextStyle>{ele.campaignStatus}</TextStyle>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <TextStyle>
              {`${ele.campaignStart}`}
            
            </TextStyle>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <TextStyle>
              {`${ele.campaignEnd}`}
            </TextStyle>
          </IndexTable.Cell>
        </IndexTable.Row>
      </>
    );
  });

  // server Request

  useEffect(() => {
    getAllCampaigns();
  }, []);

  async function getAllCampaigns() {
    try {
      await fetch("api/campaign/getCampaigns", {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.Response.Data, "all Campaigns");

          if (data.Response.Data) {
            setCampaigns(data.Response.Data);
          } else {
            console.log("else part run");
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

      <IndexTable
        resourceName={resourceName}
        itemCount={campaigns.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        loading={isLoading}
        headings={tableHeaderTitles}
        selectable={false}
      > 
        { rowMarkup }
      </IndexTable>
      {toastActive ? renderToast : null}
      {/* 
      <Pagination
        hasPrevious
        onPrevious={() => {
          console.log("Previous");
        }}
        hasNext
        onNext={() => {
          console.log("Next");
        }}
      /> */}
    </>
  );
}
