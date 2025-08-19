import { setScreenSize } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe } from "vitest";
import InstancesHeader from "./InstancesHeader";

const props: ComponentProps<typeof InstancesHeader> = {
  columnFilterOptions: [
    {
      label: "Status",
      value: "status",
      canBeHidden: true,
    },
  ],
};

describe("InstancesHeader", async () => {
  const user = userEvent.setup();

  it("should render without crashing", () => {
    renderWithProviders(<InstancesHeader {...props} />);

    const searchBox = screen.getByRole("searchbox", { name: /search/i });
    expect(searchBox).toBeInTheDocument();
  });

  it("should display all filter options", () => {
    setScreenSize("xxl");

    renderWithProviders(<InstancesHeader {...props} />);

    const statusFilter = screen.getByRole("button", { name: /status/i });
    expect(statusFilter).toBeInTheDocument();

    const helpButton = screen.getByRole("button", { name: /search help/i });
    expect(helpButton).toBeInTheDocument();

    const osFilter = screen.getByRole("button", { name: /os/i });
    expect(osFilter).toBeInTheDocument();

    const accessGroupFilter = screen.getByRole("button", {
      name: /access groups/i,
    });
    expect(accessGroupFilter).toBeInTheDocument();

    const availabilityZoneFilter = screen.getByRole("button", {
      name: /availability zones/i,
    });
    expect(availabilityZoneFilter).toBeInTheDocument();

    const tagFilter = screen.getByRole("button", { name: /tags/i });
    expect(tagFilter).toBeInTheDocument();

    const columnFilter = screen.getByRole("button", { name: /columns/i });
    expect(columnFilter).toBeInTheDocument();
  });

  it("should display a filters button when screen size is small", async () => {
    setScreenSize("sm");

    renderWithProviders(<InstancesHeader {...props} />);

    const filtersButton = screen.getByRole("button", { name: /filters/i });
    expect(filtersButton).toBeInTheDocument();

    await user.click(filtersButton);

    const statusFilter = screen.getByRole("button", { name: /status/i });
    expect(statusFilter).toBeInTheDocument();
  });

  it("shows search help when help button is clicked", async () => {
    renderWithProviders(<InstancesHeader {...props} />);

    const helpButton = screen.getByRole("button", { name: /search help/i });
    expect(helpButton).toBeInTheDocument();

    await user.click(helpButton);

    const searchHelpDialog = screen.getByRole("dialog", {
      name: /search help/i,
    });
    expect(searchHelpDialog).toBeInTheDocument();
  });
});
