import { useState, useCallback, useEffect } from "react";

import { Layout, Card, TextField, Select, Stack } from "@shopify/polaris";

export function TimeSection({
  heading,
  paragraph,
  inputTitle,
  hourSortOptions,
  minuteSortOptions,
  timeSortOptions,
  hourValue,
  minuteValue,
  timeValue,
  dateValue,
  Date,
  Hour,
  Minute,
  Time,
}) {
  return (
    <Layout.Section>
      <Card title={heading} sectioned>
        <p>{paragraph}</p>

        <br />
        <Stack alignment="trailing">
          <TextField
            label={inputTitle}
            type="date"
            value={dateValue}
            onChange={Date}
            autoComplete="date"
          />
          <Stack>
            <Select
              options={hourSortOptions}
              value={hourValue}
              onChange={Hour}
            />
            <Select
              // label="hh"
              options={minuteSortOptions}
              value={minuteValue}
              onChange={Minute}
            />
            <Select
              // label="hh"
              options={timeSortOptions}
              value={timeValue}
              onChange={Time}
            />
          </Stack>
        </Stack>
      </Card>
    </Layout.Section>
  );
}
