import { renderWithProviders } from "@/tests/render";
import { ComponentProps } from "react";
import KernelTableHeader from "./KernelTableHeader";

const props: ComponentProps<typeof KernelTableHeader> = {
  hasTableData: false,
  instanceName: "test-instance",
  kernelStatuses: {
    message: "Kernel upgrade available",
    installed: {
      id: 1,
      version: "test-version",
      name: "test-name",
      version_rounded: "test-version-rounded",
    },
    downgrades: [],
    upgrades: [],
    smart_status: "Kernel upgrade available",
  },
};

describe("KernelTableHeader", () => {
  it("renders KernelTableHeader", () => {
    const { container } = renderWithProviders(<KernelTableHeader {...props} />);
    expect(container).toHaveTexts([
      "Patches discovered since last restart",
      "Restart instance",
      "Downgrade kernel",
      "Upgrade kernel",
    ]);
  });
});
