import { renderWithProviders } from "@/tests/render";
import type { ComponentProps } from "react";
import KernelHeader from "./KernelHeader";

const props: ComponentProps<typeof KernelHeader> = {
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

describe("KernelHeader", () => {
  it("renders KernelHeader", () => {
    const { container } = renderWithProviders(<KernelHeader {...props} />);
    expect(container).toHaveTexts([
      "Restart instance",
      "Downgrade kernel",
      "Upgrade kernel",
    ]);
  });
});
