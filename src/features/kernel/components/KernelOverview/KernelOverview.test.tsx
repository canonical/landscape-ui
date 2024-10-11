import { renderWithProviders } from "@/tests/render";
import KernelOverview from "./KernelOverview";
import { ComponentProps } from "react";
import NoData from "@/components/layout/NoData";
import {
  getLivepatchCoverageDisplayValue,
  getStatusTooltipMessage,
} from "./helpers";
import { Icon, Tooltip } from "@canonical/react-components";

const props: ComponentProps<typeof KernelOverview> = {
  kernelOverview: {
    currentVersion: "5.4.0-101-generic",
    status: "Fully patched",
    expirationDate: "1723252324989",
  },
};

describe("KernelHeader", () => {
  it("should render info items", () => {
    const { container } = renderWithProviders(<KernelOverview {...props} />);
    const livepatchEnabled =
      props.kernelOverview.status !== "Livepatch disabled";
    const fields = [
      {
        label: "current kernel version",
        value: props.kernelOverview.currentVersion ?? <NoData />,
      },
      {
        label: "status",
        value: (
          <>
            <span>
              {props.kernelOverview.status === "Livepatch disabled"
                ? "Not covered by Livepatch"
                : (props.kernelOverview.status ?? <NoData />)}
            </span>
            <Tooltip
              message={getStatusTooltipMessage(
                props.kernelOverview.status,
                props.kernelOverview.expirationDate,
              )}
            >
              <Icon name="help" aria-hidden />
              <span className="u-off-screen">Help</span>
            </Tooltip>
          </>
        ),
      },
      {
        label: "livepatch coverage",
        value: getLivepatchCoverageDisplayValue(
          livepatchEnabled,
          props.kernelOverview.expirationDate,
        ),
      },
    ];

    for (const field of fields) {
      expect(container).toHaveInfoItem(field.label, field.value);
    }
  });
});
