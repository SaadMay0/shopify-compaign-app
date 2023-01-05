import { useState, useCallback } from "react";
import {
  Card,
  Page,
  Tabs,
  Layout,
  Spinner,
  Frame,
  Loading,
} from "@shopify/polaris";
// import { TitleBar } from "@shopify/app-bridge-react";
import {ToastComponent, BannerComponent, CampaignTable } from "../components";

import { useAuthenticatedFetch } from "../hooks";
import { useNavigate } from "@shopify/app-bridge-react";
export default function HomePage() {
  const navigate = useNavigate();

  const fetch = useAuthenticatedFetch();
  const [selected, setSelected] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
   const [defaultButton, setDefaultButton] = useState(false);

  // Banner component States
  const [bannerActive, setBannerActive] = useState(false);
  const [bannerTitle, setBannerTitle] = useState("Orde Placed");
  const [bannerStatus, setBannerStatus] = useState("success");
  const [bannerDescription, setBannerDescription] = useState("success");
  // Toast Component State
  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState("");
  const [toastIsError, setToastIsError] = useState(false);
  const bannerToggleActive = useCallback(
    () => setBannerActive((active) => !active),
    []
  );

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );
  // Banner End

  // Toast Callback
  const toastToggleActive = useCallback(
    () => setToastActive((active) => !active),
    []
  );

  const tabs = [
    {
      id: "",
      content: "All",
      // accessibilityLabel: "All Campaign",
      panelID: "all-campaign",
    },

    {
      id: "scheduled",
      content: "Scheduled",
      // accessibilityLabel: "Scheduled Campaign",
      panelID: "scheduled-campaign",
    },
    {
      id: "active",
      content: "Active",
      panelID: "active-campaign",
    },
    {
      id: "expired",
      content: "Expired",
      panelID: "expired-campaign",
    },
    {
      id: "failed",
      content: "Failed",
      panelID: "failed-campaign",
    },
  ];

  const renderBanner = (
    <BannerComponent
      active={bannerActive}
      title={bannerTitle}
      status={bannerStatus}
      Description={bannerDescription}
      toggleActive={bannerToggleActive}
    />
  );

  let renderToastComponent = (
    <ToastComponent
      toggleActive={toastToggleActive}
      active={toastActive}
      content={toastContent}
      error={toastIsError}
    />
  );

  //  async function searchCampainByStatus(tab) {
  //    try {
  //      await fetch(`api/campaign/getCampaignsByStatus?tab=${tab.content}`, {
  //        method: "GET",
  //        headers: {
  //          "Content-Type": "application/json;charset=UTF-8",
  //        },
  //      })
  //        .then((response) => response.json())
  //        .then((data) => {
  //          console.log("****searchCampainByStatus Index Page ****");
  //          if (data.Response.Status == 200) {
  //           //  setCampaigns(data.Response.Data);
  //          } else {
  //            console.log("else part run");
  //          }
  //          setIsLoading(false);
  //        });
  //    } catch (error) {
  //      console.log(`${error}`);
  //    }
  //  }

  // async function setDefaultPrices() {
  //   try {
  //     await fetch(`api/campaign/setAllDefaultPrices`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json;charset=UTF-8",
  //       },
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log(data, "stopCampaign ==>");
  //         if (data.Status == 200) {
  //           //  setCampaigns(data.Response.Data);
  //           setToastContent(data.Message);
  //           setToastIsError(false);
  //           setToastActive(true);
  //           setIsLoading(true);
  //           setDefaultButton(true);
  //           // searchCampainByStatus(tabs[selected]);
  //         } else {
  //           console.log("else part run");
  //           setToastContent(data.Message);
  //           setToastIsError(false);
  //           setToastActive(true);
  //           setIsLoading(true);
  //           setDefaultButton(true);
  //         }
  //         setIsLoading(false);
  //         // navigate("/");
  //         // setSelected(0);
  //       });
  //   } catch (error) {
  //     console.log(`${error}`);
  //   }
  //   setIsLoading(false);
  // }

  return (
    <>
      {/* <TitleBar
        title="Campaigns"
        primaryAction={{
          content: "New Campaign",
          onAction: () => {
            navigate("/campaign");
            console.log("Campaign Button Click");
          },
        }}
        secondaryActions={[
          {
            content: "Set Default Prices",

            onAction: () => {
              setIsLoading(true);
              
              setDefaultPrices();
              console.log("setDefaultPrices Button Click");
            },
          },
        ]}
      /> */}

      <Page>
        {isLoading ? (
          <div style={{ height: "1px" }}>
            <Frame>
              <Loading />
            </Frame>
          </div>
        ) : null}
        {renderBanner}
        <br />
        <Layout>
          <Layout.Section>
            <Card>
              <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                {/* <Card.Section> */}
                <CampaignTable
                  tab={tabs[selected]}
                  defaultButton={defaultButton}
                  // setBannerTitle={setBannerTitle}
                  // setBannerStatus={setBannerStatus}
                  // bannerToggleActive={bannerToggleActive}
                  // setBannerDescription={setBannerDescription}
                />
                {/* </Card.Section> */}
              </Tabs>
            </Card>
          </Layout.Section>
        </Layout>
        {toastActive ? renderToastComponent : null}
      </Page>
    </>
  );
}
