import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackagesActionSummaryDetails from "./PackagesActionSummaryDetails";
import { packageInstances, selectedPackages } from "@/tests/mocks/packages";
import userEvent from "@testing-library/user-event";

const [selectedPackage] = selectedPackages;

const props = {
  instanceIds: [1, 2, 3],
  close: vi.fn(),
};

describe("PackagesActionSummaryDetails", () => {
  const user = userEvent.setup();

  it("should render title, searchbox, table and pagination", async () => {
    renderWithProviders(
      <PackagesActionSummaryDetails
        {...props}
        selectedPackage={selectedPackage}
        action="install"
        summaryVersion="0.1.9-1"
      />,
    );

    screen.getByText(
      `Instances with ${selectedPackage.name} 0.1.9-1 available`,
    );
    screen.getByRole("searchbox");

    await screen.findByRole("table");
    screen.getByRole("columnheader", { name: "Instance Name" });
    screen.getByRole("columnheader", { name: "Installed Version" });
    screen.getByRole("columnheader", { name: "Latest Version Available" });

    screen.getByText(/Showing \d+ of \d+ results/i);
  });

  it("should close modal when close button is clicked", async () => {
    renderWithProviders(
      <PackagesActionSummaryDetails
        {...props}
        selectedPackage={selectedPackage}
        action="install"
      />,
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);
    expect(props.close).toHaveBeenCalled();
  });

  it("should have the proper title when the summary version is empty", () => {
    renderWithProviders(
      <PackagesActionSummaryDetails
        {...props}
        selectedPackage={selectedPackage}
        action="hold"
        summaryVersion=""
      />,
    );

    screen.getByText(`Instances with ${selectedPackage.name} not installed`);
  });

  it("should have the proper title when there is no summary version", () => {
    renderWithProviders(
      <PackagesActionSummaryDetails
        {...props}
        selectedPackage={selectedPackage}
        action="unhold"
      />,
    );

    screen.getByText(`Instances that won't unhold ${selectedPackage.name}`);
  });

  it("should search and clear the searchbox", async () => {
    renderWithProviders(
      <PackagesActionSummaryDetails
        {...props}
        selectedPackage={selectedPackage}
        action="uninstall"
      />,
    );

    const rows = await screen.findAllByRole("row");

    const searchBox = screen.getByRole("searchbox");
    const searchText = "instance 1";
    await user.type(searchBox, `${searchText}{enter}`);

    const filteredInstances = packageInstances.filter(({ name }) =>
      name.includes(searchText),
    );
    expect(screen.getAllByRole("row")).toHaveLength(
      filteredInstances.length + 1,
    );

    const clear = screen.getByRole("button", { name: "Clear search field" });
    await user.click(clear);
    expect(searchBox).toHaveValue("");
    expect(screen.getAllByRole("row")).toEqual(rows);
  });

  it("should show empty table message", async () => {
    renderWithProviders(
      <PackagesActionSummaryDetails
        {...props}
        selectedPackage={selectedPackage}
        action="install"
      />,
    );

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "asdfghjhgfds{enter}");

    screen.getByRole("gridcell", { name: /No instances found/i });
  });
});
