import { useState, useCallback, useEffect } from "react";
import {
  IndexTable,
  TextStyle,
  useIndexResourceState,
  Button,
  Spinner,
  ButtonGroup,
} from "@shopify/polaris";
import {
  // ResourcePicker,
  useNavigationHistory,
} from "@shopify/app-bridge-react";

import { ToastComponent } from "./Tost";
import { CampaignSection } from "./CampaignSection";
// import {PropCampaign} from "./PropCampaign"
import { useAuthenticatedFetch } from "../hooks";
import {useLocation, useNavigate } from "@shopify/app-bridge-react";
// import { useNavigate } from "react-router-dom";
export function CampaignTable({
  tab,
  setBannerTitle,
  setBannerStatus,
  bannerToggleActive,
  setBannerDescription,
}) {
  const { push, replace } = useNavigationHistory();
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();

  const [renderCampaign, setRenderCampaign] = useState(false);
  const [renderCampaignData, setRenderCampaignData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

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
    { key: "Actiones", title: "Actiones" },
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

  let renderCampaignSection = (
    <CampaignSection campaignData={renderCampaignData} />
  );

  const rowMarkup = campaigns.map((ele, index) => {
    const tableRowKey = `tbl-row-${index}`;
    return (
      <>
        <IndexTable.Row
          id={ele.id}
          key={tableRowKey}
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
            <TextStyle>{`${ele.campaignStart}`}</TextStyle>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <TextStyle>{`${ele.campaignEnd}`}</TextStyle>
          </IndexTable.Cell>

          <IndexTable.Cell>
            <ButtonGroup>
              <Button
                primary
                onClick={(e) => {
                  e.stopPropagation(e);
                  // setRenderCampaign(true);
                  // setRenderCampaignData(ele);
                  // setIsLoading(true);
               
                  navigate(`/campaign?id=${ele.id}`);

                  // console.log("its work", ele.id);
                  // updateCampaign(`${ele.id}`);
                }}
              >
                Update
              </Button>
              <Button
                primary
                onClick={(e) => {
                  e.stopPropagation(e);
                  setIsLoading(true);
                  deleteCampaign(`${ele.id}`);
                }}
              >
                Delete
              </Button>
            </ButtonGroup>
          </IndexTable.Cell>
        </IndexTable.Row>
      </>
    );
  });

  // server Request

  useEffect(() => {
    // getAllCampaigns();
    searchCampainByStatus();
  }, [isLoading]);

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

  async function searchCampainByStatus() {
    try {
      await fetch(`api/campaign/getCampaignsByStatus?tab=${tab.content}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data, "all search");
          if (data.Response.Status == 200) {
            setCampaigns(data.Response.Data);
          } else {
            console.log("else part run");
          }
          setIsLoading(false);
        });
    } catch (error) {
      console.log(`${error}`);
    }
  }

  async function updateCampaign(id) {
    try {
      await fetch(`api/campaign/updateCampaigns?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data, "all search");
          if (data.Response.Status == 200) {
            //  setCampaigns(data.Response.Data);
            searchCampainByStatus();
          } else {
            console.log("else part run");
          }
          setIsLoading(false);
        });
    } catch (error) {
      console.log(`${error}`);
    }
  }

  async function deleteCampaign(id) {
    try {
      await fetch(`api/campaign/deleteCampaignsById?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data, "all search");
          if (data.Response.Status == 200) {
            //  setCampaigns(data.Response.Data);
            searchCampainByStatus();
          } else {
            console.log("else part run");
          }
          setIsLoading(false);
        });
    } catch (error) {
      console.log(`${error}`);
    }
  }

  
  return (
    <>
      {renderCampaign ? (
        renderCampaignSection
      ) : (
        <>
          <IndexTable
            resourceName={resourceName}
            itemCount={campaigns.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            lastColumnSticky
            onSelectionChange={handleSelectionChange}
            loading={isLoading}
            headings={tableHeaderTitles}
            selectable={false}
          >
            {rowMarkup}
          </IndexTable>
          {toastActive ? renderToast : null}
        </>
      )}
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
