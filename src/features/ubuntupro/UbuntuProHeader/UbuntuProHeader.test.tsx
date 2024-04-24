import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import UbuntuProHeader from "./UbuntuProHeader";
import { screen } from "@testing-library/react";

const ubuntuProDataWithAccountInfo = instances.find(
  (instance) => instance.ubuntu_pro_info && instance.ubuntu_pro_info?.account,
)!.ubuntu_pro_info!;

const ubuntuProDataWithoutAccountInfo = instances.find(
  (instance) => instance.ubuntu_pro_info && !instance.ubuntu_pro_info?.account,
)!.ubuntu_pro_info!;

describe("renders Ubuntu Pro Panel", () => {
  it.each([ubuntuProDataWithAccountInfo, ubuntuProDataWithoutAccountInfo])(
    "renders Ubuntu Pro Panel with Ubuntu Pro entitlement",
    (data) => {
      const { container } = renderWithProviders(
        <UbuntuProHeader ubuntuProData={data} />,
      );
      expect(screen.getByText(/account information/i)).toBeInTheDocument();

      const ubuntuProHeaderFields = [
        {
          label: "Account",
          value: data.account?.name ?? "-",
        },
        {
          label: "Subscription",
          value: data.contract?.name ?? "-",
        },
        {
          label: "Valid Until",
          value:
            data.expires !== "n/a"
              ? new Date(data.expires).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  timeZoneName: "short",
                  timeZone: "UTC",
                })
              : "-",
        },
        {
          label: "Technical Support Level",
          value: data.contract?.tech_support_level ?? "-",
        },
      ];
      ubuntuProHeaderFields.forEach((field) => {
        expect(container).toHaveInfoItem(field.label, field.value);
      });
    },
  );
});
