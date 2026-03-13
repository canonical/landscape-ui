import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackagesActionSummaryItemVersion from "./PackagesActionSummaryItemVersion";
import { selectedPackages } from "@/tests/mocks/packages";
import userEvent from "@testing-library/user-event";

const [selectedPackage] = selectedPackages;

describe("PackagesActionSummaryItemVersion", () => {
  const user = userEvent.setup();

  it("should render instances button and version name", async () => {
    renderWithProviders(
      <PackagesActionSummaryItemVersion
        action="install"
        instanceIds={[1, 2, 3]}
        selectedPackage={selectedPackage}
        version={{ name: "0.1.9-1", num_computers: 3 }}
      />,
    );

    const text = screen.getByText("install", { exact: false });
    expect(text.textContent).toEqual("Will install libthai0 0.1.9-1");

    const button = screen.getByRole("button", { name: "3 instances" });
    await user.click(button);
    screen.getByRole("dialog");
  });

  it("should render downgrade specific text", async () => {
    renderWithProviders(
      <PackagesActionSummaryItemVersion
        action="downgrade"
        instanceIds={[1, 2, 3]}
        selectedPackage={selectedPackage}
        version={{ name: "0.1.9-1", num_computers: 3 }}
      />,
    );

    const text = screen.getByText("downgrade", { exact: false });
    expect(text.textContent).toEqual("Will downgrade to libthai0 0.1.9-1");
  });

  it("should render hold as not installed option", () => {
    renderWithProviders(
      <PackagesActionSummaryItemVersion
        action="hold"
        instanceIds={[1]}
        selectedPackage={selectedPackage}
        version={{ name: "", num_computers: 1 }}
      />,
    );

    const text = screen.getByText("hold", { exact: false });
    expect(text.textContent).toEqual("Will hold libthai0 as not installed");

    screen.getByRole("button", { name: "1 instance" });
  });
});
