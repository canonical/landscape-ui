import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import UbuntuProHeader from "./UbuntuProHeader";
import { screen } from "@testing-library/react";
import moment from "moment";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import NoData from "@/components/layout/NoData";

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
          value: data.account?.name ?? <NoData />,
        },
        {
          label: "Subscription",
          value: data.contract?.name ?? <NoData />,
        },
        {
          label: "Valid Until",
          value:
            data.expires && moment(data.expires).isValid() ? (
              moment(data.expires).format(DISPLAY_DATE_TIME_FORMAT)
            ) : (
              <NoData />
            ),
        },
        {
          label: "Technical Support Level",
          value: data.contract?.tech_support_level ?? <NoData />,
        },
      ];
      ubuntuProHeaderFields.forEach((field) => {
        expect(container).toHaveInfoItem(field.label, field.value);
      });
    },
  );
});
