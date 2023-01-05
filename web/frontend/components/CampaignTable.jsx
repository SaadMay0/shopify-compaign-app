import { useState, useCallback, useEffect } from "react";
import {
  IndexTable,
  TextStyle,
  useIndexResourceState,
  Button,
  // Spinner,
  ButtonGroup,
  Loading,
  Frame,
  Card,
  Tooltip,
  Icon,
} from "@shopify/polaris";
import {
  DeleteMajor,
  EditMajor,
  PlayMajor,
  PauseMajor,
} from "@shopify/polaris-icons";
import { TitleBar } from "@shopify/app-bridge-react";
import { ToastComponent } from "./Tost";
// import {PropCampaign} from "./PropCampaign"
import { useAuthenticatedFetch } from "../hooks";
import { useNavigate } from "@shopify/app-bridge-react";
export function CampaignTable({
  tab,
  // defaultButton,
  // setBannerTitle,
  // setBannerStatus,
  // bannerToggleActive,
  // setBannerDescription,
}) {
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();

  const [isLoading, setIsLoading] = useState(true);

  // const [defaultBu, setdefaultBu] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  // const [preferences, setpreferences] = useState();
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(campaigns);

  // Toast Component Start

  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState("");
  const [toastIsError, setToastIsError] = useState(false);

  //Callback
  const toastToggleActive = useCallback(
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
    { key: "campaignName", title: "Campaigns" },
    // { key: "campaignOrders", title: "Orders" },
    // { key: "campaignSales", title: "Sales" },
    { key: "campaignStatus", title: "Status" },
    { key: "campaignStart", title: "Start" },
    { key: "campaignEnd", title: "End" },
    { key: "Action", title: "Action" },
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
      toggleActive={toastToggleActive}
      active={toastActive}
      content={toastContent}
      error={toastIsError}
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
          <IndexTable.Cell>
            <TextStyle>
              {ele.isCampaignStart ? "Under processing" : ele.campaignStatus}
            </TextStyle>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <TextStyle>
              {`${new Date(ele.campaignStart).toLocaleString()}`}
            </TextStyle>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <TextStyle>
              {ele.campaignEnd
                ? `${new Date(ele.campaignEnd).toLocaleString()}`
                : "Not Defined"}
            </TextStyle>
          </IndexTable.Cell>

          <IndexTable.Cell>
            {ele.campaignStatus == "Active" ? (
              <div style={{ width: "200px" }}>
                <ButtonGroup>
                  <Tooltip
                    content="Stop"
                    dismissOnMouseOut
                    preferredPosition="above"
                  >
                    <Button
                      destructive
                      disabled={ele.isCampaignStart}
                      loading={ele.isCampaignStart}
                      onClick={(e) => {
                        e.stopPropagation(e);
                        setIsLoading(true);
                        stopCampaign(`${ele.id}`);
                      }}
                    >
                      {/* End */}
                      <Icon source={PauseMajor} />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content="Delete"
                    dismissOnMouseOut
                    preferredPosition="above"
                  >
                    <Button
                      destructive
                      disabled={ele.isCampaignStart}
                      loading={ele.isCampaignStart}
                      onClick={(e) => {
                        e.stopPropagation(e);
                        setIsLoading(true);
                        deleteCampaign(`${ele.id}`);
                      }}
                    >
                      <Icon source={DeleteMajor} />
                      {/* Delete** */}
                    </Button>
                  </Tooltip>
                </ButtonGroup>
              </div>
            ) : (
              <div style={{ width: "200px" }}>
                <ButtonGroup>
                  <Tooltip
                    content="Start"
                    dismissOnMouseOut
                    preferredPosition="above"
                  >
                    <Button
                      primary
                      disabled={ele.isCampaignStart}
                      loading={ele.isCampaignStart}
                      onClick={(e) => {
                        e.stopPropagation(e);
                        setIsLoading(true);
                        startCampaign(`${ele.id}`);
                      }}
                    >
                      {/* Start */}
                      <Icon source={PlayMajor} />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content="Update"
                    dismissOnMouseOut
                    preferredPosition="above"
                  >
                    <Button
                      primary
                      disabled={ele.isCampaignStart}
                      loading={ele.isCampaignStart}
                      onClick={(e) => {
                        e.stopPropagation(e);
                        setIsLoading(true);
                        navigate(`/campaign?id=${ele.id}`);
                      }}
                    >
                      {/* Update */}
                      <Icon source={EditMajor} />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content="Delete"
                    dismissOnMouseOut
                    preferredPosition="above"
                  >
                    <Button
                      destructive
                      disabled={ele.isCampaignStart}
                      loading={ele.isCampaignStart}
                      onClick={(e) => {
                        e.stopPropagation(e);
                        setIsLoading(true);
                        deleteCampaign(`${ele.id}`);
                      }}
                    >
                      <Icon source={DeleteMajor} />
                    </Button>
                  </Tooltip>
                </ButtonGroup>
              </div>
            )}
          </IndexTable.Cell>
        </IndexTable.Row>
      </>
    );
  });

  // server Request

  // let count = 0;

  // console.log(defaultBu,"Table Page*****", defaultButton);

  // if (defaultBu && defaultButton) {
  //   console.log("Print on defaultButton true");
  //   // defaultButton = false;
  //   count = 1;
  // }
  // setdefaultBu(false);
  // defaultButton = false;

  useEffect(() => {
    searchCampainByStatus();
  }, [isLoading]);

  async function cheackStatus(id) {
    try {
      await fetch(`api/campaign/cheackStatus?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data, "=====cheackStatus>>>");
          if (data.Response.Status == 200) {
            // setCampaigns(data.Response.Data);
            searchCampainByStatus();
            setToastContent(data.Response.Message);
            setToastIsError(false);
            setToastActive(true);
            setIsLoading(true);
          } else {
            searchCampainByStatus();
            // console.log("else part run");
            setToastContent(data.Response.Message);
            setToastIsError(true);
            setToastActive(true);
            setIsLoading(true);
          }
          // setIsLoading(false);
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
          if (data.Response.Status == 200) {
            setCampaigns(data.Response.Data);
          } else {
            // console.log("else part run");
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
          // console.log(data, "all search");
          if (data.Response.Status == 200) {
            //  setCampaigns(data.Response.Data);
            // searchCampainByStatus();
            setToastContent(data.Response.Message);
            setToastIsError(false);
            setToastActive(true);
            setIsLoading(true);
          } else {
            // console.log("else part run");
            // searchCampainByStatus();
            setToastContent(data.Response.Message);
            setToastIsError(true);
            setToastActive(true);
            setIsLoading(true);
          }
          setIsLoading(false);
        });
    } catch (error) {
      console.log(`${error}`);
    }
  }

  async function startCampaign(id) {
    try {
      await fetch(`api/campaign/startCampaign?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data, "startCampaign ==>");
          if (data.Response.Status == 200) {
            //  setCampaigns(data.Response.Data);
            searchCampainByStatus();
            setToastContent(data.Response.Message);
            setToastIsError(false);
            setToastActive(true);
            setIsLoading(true);
            cheackStatus(id);
          } else {
            // console.log("else part run");
            searchCampainByStatus();
            setToastContent(data.Response.Message);
            setToastIsError(true);
            setToastActive(true);
            setIsLoading(true);
            cheackStatus(id);
          }
          setIsLoading(false);
        });
    } catch (error) {
      console.log(`${error}`);
    }
  }

  async function stopCampaign(id) {
    try {
      await fetch(`api/campaign/stopCampaign?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data, "stopCampaign ==>");
          if (data.Response.Status == 200) {
            //  setCampaigns(data.Response.Data);
            searchCampainByStatus();
            setToastContent(data.Response.Message);
            setToastIsError(false);
            setToastActive(true);
            setIsLoading(true);
            cheackStatus(id);
          } else {
            // console.log("else part run");
            searchCampainByStatus();
            setToastContent(data.Response.Message);
            setToastIsError(true);
            setToastActive(true);
            setIsLoading(true);
            cheackStatus(id);
          }
          setIsLoading(false);
        });
    } catch (error) {
      console.log(`${error}`);
    }
  }

  async function setDefaultPrices() {
    try {
      await fetch(`api/campaign/setAllDefaultPrices`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data, "setDefaultPrices ==>");
          if (data.Status == 200) {
            //  setCampaigns(data.Response.Data);
            searchCampainByStatus();
            setToastContent(data.Message);
            setToastIsError(false);
            setToastActive(true);
            setIsLoading(true);
            cheackStatus(data.Data);
            // setDefaultButton(true);
            // searchCampainByStatus(tabs[selected]);
          } else {
            // console.log("else part run");
            searchCampainByStatus();
            setToastContent(data.Message);
            setToastIsError(true);
            setToastActive(true);
            setIsLoading(true);
            cheackStatus(id);
            // setDefaultButton(true);
          }
          setIsLoading(false);
          // navigate("/");
          // setSelected(0);
        });
    } catch (error) {
      console.log(`${error}`);
    }
    setIsLoading(false);
  }

  return (
    <>
      <TitleBar
        title="Campaigns"
        primaryAction={{
          content: "New Campaign",
          onAction: () => {
            navigate("/campaign");
            // console.log("Campaign Button Click");
          },
        }}
        secondaryActions={[
          {
            content: "Set Default Prices",

            onAction: () => {
              setIsLoading(true);

              setDefaultPrices();
              // console.log("setDefaultPrices Button Click");
            },
          },
        ]}
      />
      {isLoading ? (
        <div style={{ height: "1px" }}>
          <Frame>
            <Loading />
          </Frame>
        </div>
      ) : null}

      <Card>
        <Card.Section>
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
        </Card.Section>
      </Card>

      {toastActive ? renderToast : null}
    </>
  );
}
