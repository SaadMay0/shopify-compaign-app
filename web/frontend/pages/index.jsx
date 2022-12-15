import { useState, useCallback } from "react";
import { Card, Page, Tabs, Layout } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { BannerComponent, CampaignTable } from "../components";

import { useAuthenticatedFetch } from "../hooks";
import {  useNavigate } from "@shopify/app-bridge-react";
export default function HomePage() {
  const navigate = useNavigate();

  const fetch = useAuthenticatedFetch();
  const [selected, setSelected] = useState(1);

  // Banner component States
  const [bannerActive, setBannerActive] = useState(false);
  const [bannerTitle, setBannerTitle] = useState("Orde Placed");
  const [bannerStatus, setBannerStatus] = useState("success");
  const [bannerDescription, setBannerDescription] = useState("success");
  const bannerToggleActive = useCallback(
    () => setBannerActive((active) => !active),
    []
  );

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );
  // Banner End

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
              console.log(data, "stopCampaign ==>");
              if (data.Response.Status == 200) {
                //  setCampaigns(data.Response.Data);
                setToastContent(data.Response.Message);
                setToastIsError(false);
                setToastActive(true);
                setIsLoading(true);
                searchCampainByStatus();
              } else {
                console.log("else part run");
                setToastContent(data.Response.Message);
                setToastIsError(false);
                setToastActive(true);
                setIsLoading(true);
              }
              setIsLoading(false);
            });
        } catch (error) {
          console.log(`${error}`);
        }
      }

  return (
    <>
      <TitleBar
        title="Campaignes"
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
              setDefaultPrices();
              console.log("setDefaultPrices Button Click");
            },
          },
        ]}
      />
      <Page>
        {renderBanner}
        <br />
        <Layout>
          <Layout.Section>
            <Card>
              <Tabs
                tabs={tabs}
                selected={selected}
                onSelect={handleTabChange}
              >
                {/* <Card.Section> */}
                  <CampaignTable 
                    tab={tabs[selected]}
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
      </Page>
    </>
  );
}
