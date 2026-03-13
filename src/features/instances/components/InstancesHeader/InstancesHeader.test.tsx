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
  onChangeFilter: vi.fn(),
};

describe("InstancesHeader", async () => {
  const user = userEvent.setup();

  it("should render without crashing", () => {
    renderWithProviders(<InstancesHeader {...props} />);

    const searchBox = screen.getByRole("searchbox", { name: /search/i });
    expect(searchBox).toBeInTheDocument();
  });

  it("should display all filter options", async () => {
    renderWithProviders(<InstancesHeader {...props} />);

    await user.click(screen.getByRole("button", { name: /filters/i }));

    const statusFilter = screen.getByRole("button", { name: /status/i });
    expect(statusFilter).toBeInTheDocument();

    const helpButton = screen.getByRole("button", { name: /search help/i });
    expect(helpButton).toBeInTheDocument();

    const osFilter = screen.getByRole("button", { name: /OS/ });
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

    const wslFilter = screen.getByRole("button", { name: /wsl/i });
    expect(wslFilter).toBeInTheDocument();

    const columnFilter = screen.getByRole("button", { name: /columns/i });
    expect(columnFilter).toBeInTheDocument();
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
