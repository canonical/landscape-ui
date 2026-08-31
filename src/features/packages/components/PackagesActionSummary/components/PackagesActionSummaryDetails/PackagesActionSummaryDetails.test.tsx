import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackagesActionSummaryDetails from "./PackagesActionSummaryDetails";
import { packageInstances } from "@/tests/mocks/packagesOld";
import userEvent from "@testing-library/user-event";
import {
  packageChangePlanSummaryItems,
  packages,
} from "@/tests/mocks/packages";
import type { ComponentProps } from "react";

const [selectedPackage] = packages;

const props = {
  packageChangePlanId: 1,
  packageChangePlanSummaryItem: packageChangePlanSummaryItems[0],
} as const satisfies ComponentProps<typeof PackagesActionSummaryDetails>;

describe("PackagesActionSummaryDetails", () => {
  const user = userEvent.setup();

  it("should render title, searchbox, table and pagination", async () => {
    renderWithProviders(<PackagesActionSummaryDetails {...props} />);

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

  it("should have the proper title when the summary version is empty", () => {
    renderWithProviders(<PackagesActionSummaryDetails {...props} />);

    screen.getByText(`Instances with ${selectedPackage.name} not installed`);
  });

  it("should have the proper title when there is no summary version", () => {
    renderWithProviders(<PackagesActionSummaryDetails {...props} />);

    screen.getByText(`Instances that won't unhold ${selectedPackage.name}`);
  });

  it("should search and clear the searchbox", async () => {
    renderWithProviders(<PackagesActionSummaryDetails {...props} />);

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
    renderWithProviders(<PackagesActionSummaryDetails {...props} />);

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "asdfghjhgfds{enter}");

    screen.getByRole("gridcell", { name: /No instances found/i });
  });
});
