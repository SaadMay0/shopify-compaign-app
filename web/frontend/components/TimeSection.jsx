
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
  handleDate,
  handleHour,
  handleMinute,
  handleTime,
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
            onChange={handleDate}
            autoComplete="date"
          />
          <Stack>
            <Select
              options={hourSortOptions}
              value={hourValue}
              onChange={handleHour}
            />
            <Select
              options={minuteSortOptions}
              value={minuteValue}
              onChange={handleMinute}
            />
            <Select
              options={timeSortOptions}
              value={timeValue}
              onChange={handleTime}
            />
          </Stack>
        </Stack>
      </Card>
    </Layout.Section>
  );
}
