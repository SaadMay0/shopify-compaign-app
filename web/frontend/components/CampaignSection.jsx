import { useState, useCallback, useEffect } from "react";

import {
  Page,
  Layout,
  Card,
  TextField,
  Select,
  Stack,
  Button,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";

import { TimeSection } from "./TimeSection";

export function CampaignSection() {
  const [ResourcePickerState, setResourceState] = useState(false);
  const [title, setTitle] = useState("");
  const [sortValue, setSortValue] = useState(0);
  const handleTitleTextChange = useCallback((value) => setTitle(value), []);

  const handleHourSortChange = useCallback((value) => setSortValue(value), []);

  const hourSortOptions = [
    { value: 0, label: "hh" },
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
  ];
  const mintSortOptions = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
  ];
  return (
    <Page>
      <ResourcePicker
        resourceType="Collection"
        showVariants={true}
        open={ResourcePickerState}
        // initialSelectionIds={selectedProducts}
        onCancel={() => {
          setResourceState(false);
        }}
        onSelection={(ele) => {
          setResourceState(false);
          setIsLoading(true);

          console.log("====>", ele.selection);
          //   postFragile(ele.selection);
        }}
      />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextField
              label="Title"
              type="text"
              value={title}
              onChange={handleTitleTextChange}
              helpText="Only You will See This Name or Title"
              autoComplete="text"
            />
          </Card>
        </Layout.Section>

        <TimeSection
          heading="Start Date"
          paragraph="Secduled when your campaign Start"
          inputTitle="Start Date"
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
              }}
            >
              Select Compaign Products
            </Button>
          </Card>
        </Layout.Section>

        <TimeSection
          heading="End Date"
          paragraph="Secduled when your campaign End"
          inputTitle="End Date"
        />
      </Layout>
    </Page>
  );
}
