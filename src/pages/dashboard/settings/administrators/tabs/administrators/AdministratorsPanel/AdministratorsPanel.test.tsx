import { renderWithProviders } from "@/tests/render";
import AdministratorsPanel from "./AdministratorsPanel";
import { screen } from "@testing-library/react";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import userEvent from "@testing-library/user-event";

describe("AdministratorsPanel", () => {
  const user = userEvent.setup();

  it("renders without crashing", async () => {
    renderWithProviders(<AdministratorsPanel />);

    await expectLoadingState();

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });

  it("renders an empty state", async () => {
    setEndpointStatus({
      path: "GetAdministrators",
      status: "empty",
    });

    renderWithProviders(<AdministratorsPanel />);

    await expectLoadingState();

    const emptyState = screen.getByText(
      /there are no administrators in your landscape organization./i,
    );
    expect(emptyState).toBeInTheDocument();
  });

  it("opens invitation sidepanel when clicking invite administrator on empty state", async () => {
    setEndpointStatus({
      path: "GetAdministrators",
      status: "empty",
    });

    renderWithProviders(<AdministratorsPanel />);

    await expectLoadingState();

    const emptyState = screen.getByText(
      /there are no administrators in your landscape organization./i,
    );
    expect(emptyState).toBeInTheDocument();

    const inviteButton = screen.getByRole("button", {
      name: /invite administrator/i,
    });
    expect(inviteButton).toBeInTheDocument();

    await user.click(inviteButton);

    const sidePanel = screen.getByRole("complementary");
    expect(sidePanel).toBeInTheDocument();

    const sidePanelTitle = screen.getByRole("heading", {
      name: /invite administrator/i,
    });
    expect(sidePanelTitle).toBeInTheDocument();
  });
});
