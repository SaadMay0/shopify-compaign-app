import { useState, useCallback } from "react";
import { Card, Page, Tabs, Layout, PageActions } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import { BannerComponent, CampaignTable, CampaignSection } from "../components";
import { useAuthenticatedFetch } from "../hooks";
import { useNavigate } from "@shopify/app-bridge-react";
export default function Campaign() {
const navigate = useNavigate();
  return (
    <>
      <TitleBar
        title="Campaignes"
        primaryAction={{
          content: "Save",
          onAction: () => {
            navigate("/campaign");
          },
        }}
        secondaryActions={[
          {
            content: "Cancel",
            // accessibilityLabel: "Secondary action label",
            onAction: () => {
              navigate("/dashboard");
              alert("Duplicate action")
            },
          },
        ]}
      />

      <CampaignSection />
    </>
  );
}
