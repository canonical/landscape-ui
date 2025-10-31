import { ROUTES } from "@/libs/routes";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import { STATUS_OPTIONS } from "./constants";
import PackagesPanelHeader from "./PackagesPanelHeader";

const handleClearSelection = vi.fn();

const props: ComponentProps<typeof PackagesPanelHeader> = {
  selectedPackages: [],
  handleClearSelection,
};

describe("PackagesPanelHeader", () => {
  const user = userEvent.setup();

  it("allows typing in search box", async () => {
    renderWithProviders(<PackagesPanelHeader {...props} />);

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test-package");

    expect(searchBox).toHaveValue("test-package");
  });

  it("calls handleClearSelection after search", async () => {
    renderWithProviders(<PackagesPanelHeader {...props} />);

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test{enter}");

    expect(handleClearSelection).toHaveBeenCalled();
  });

  it("clears search box when clear button is clicked", async () => {
    renderWithProviders(<PackagesPanelHeader {...props} />);

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test");

    const clearButton = screen.getByRole("button", {
      name: /clear search field/i,
    });
    await user.click(clearButton);

    expect(searchBox).toHaveValue("");
  });

  it("allows selecting a status filter option", async () => {
    renderWithProviders(<PackagesPanelHeader {...props} />);

    const statusFilter = screen.getByRole("button", { name: /status/i });
    await user.click(statusFilter);

    const upgradesOption = screen.getByText(STATUS_OPTIONS[1].label);
    await user.click(upgradesOption);

    expect(
      screen.getByText(`Status: ${STATUS_OPTIONS[1].label}`),
    ).toBeInTheDocument();
  });

  it("displays status filter chip when status filter is active", async () => {
    renderWithProviders(
      <PackagesPanelHeader {...props} />,
      {},
      ROUTES.instances.details.single(1, {
        tab: "packages",
        status: STATUS_OPTIONS[1].value,
      }),
    );

    expect(
      screen.getByText(`Status: ${STATUS_OPTIONS[1].label}`),
    ).toBeInTheDocument();
  });
});
