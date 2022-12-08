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
    // {
    //   id: "draft",
    //   content: "Draft",
    //   panelID: "draft-campaign",
    // },
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
      />
      <Page>
        {renderBanner}
        <br />
        <Layout>
          <Layout.Section>
            <Card>
              <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
                <Card.Section>
                  <CampaignTable
                    tab={tabs[selected]}
                    setBannerTitle={setBannerTitle}
                    setBannerStatus={setBannerStatus}
                    bannerToggleActive={bannerToggleActive}
                    setBannerDescription={setBannerDescription}
                  />
                </Card.Section>
              </Tabs>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
}
