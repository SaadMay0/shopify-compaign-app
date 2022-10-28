import { useState, useCallback } from "react";
import { Card, Page, Tabs, Layout } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import { BannerComponent, CampaignTable, CampaignSection } from "../components";
import { useAuthenticatedFetch } from "../hooks";

export default function Campaign() {

  return (
    <>
      <TitleBar
        title="Campaignes"
        primaryAction={{
          content: "New Campaign",
          onAction: () => console.log("Campaign Button Click"),
        }}
      />

      <CampaignSection
      // filterOrders={tabs[selected]}
      // setBannerTitle={setBannerTitle}
      // setBannerStatus={setBannerStatus}
      // bannerToggleActive={bannerToggleActive}
      // setBannerDescription={setBannerDescription}
      />
    </>
  );
}
