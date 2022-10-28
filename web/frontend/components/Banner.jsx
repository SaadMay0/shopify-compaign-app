import { Banner } from "@shopify/polaris";
export function BannerComponent({
  active,
  title,
  status,
  toggleActive,
  Description,
}) {
  console.log(
    active,
    title,
    status,
    toggleActive,
    Description,
    "****Banner Component Value****"
  );
  return active ? (
    <Banner
      title={title}
      status={status}
      action={{ content: "Print label" }}
      onDismiss={() => {
        toggleActive();
      }}
    >
      {Description}
    </Banner>
  ) : null;
}
