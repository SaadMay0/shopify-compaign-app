import { useState, useCallback, useEffect } from "react";
import {
  IndexTable,
  TextStyle,
  useIndexResourceState,
  Button,
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
    
    const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopUp, setShowPopUp] = useState();
  const [sortValue, setSortValue] = useState("shopifyOrderNbr");
  const [orders, setOrders] = useState([]);
  const [preferences, setpreferences] = useState();
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
      useIndexResourceState(orders);
    
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
    { key: "campaignOrders", title: "Orders" },
    { key: "campaignSales", title: "Sales" },
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
//       orders={orders}
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

  const rowMarkup = orders.map((ele, index) => {
    return (
      <>
        <IndexTable.Row
          id={ele.id}
          key={ele.id}
          onClick={(e) => {}}
          selected={selectedResources.includes(ele.id)}
          position={index}
        >
          {tableHeaderTitles.map((col) => {
            return (
              <IndexTable.Cell>
                <TextStyle variation="strong">
                  {ele[col.key] ? `${ele[col.key]}` : "-"}
                </TextStyle>
              </IndexTable.Cell>
            );
          })}
        </IndexTable.Row>
      </>
    );
  });
  return (
    <>        
        <IndexTable
          resourceName={resourceName}
          itemCount={orders.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={
            handleSelectionChange
          }
          
          loading={isLoading}
          headings={tableHeaderTitles}
          selectable={false}
        >
          {rowMarkup}
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
