import { administrators } from "@/tests/mocks/administrators";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import AdministratorList from "./AdministratorList";

const props: ComponentProps<typeof AdministratorList> = {
  administrators: administrators,
  roles: [],
};

describe("AdministratorList", () => {
  const user = userEvent.setup();

  it("renders correctly", () => {
    renderWithProviders(<AdministratorList {...props} />);

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    expect(table).toHaveTexts(["Name", "Email", "Roles", "Actions"]);
  });

  it("shows correct empty message when no administrators are in the organization", () => {
    renderWithProviders(<AdministratorList {...props} administrators={[]} />);

    const emptyMessage = screen.getByText(
      /you have no administrators on your landscape organization./i,
    );
    expect(emptyMessage).toBeInTheDocument();
  });

  it("shows correct empty message when no administrators are found from searching", () => {
    renderWithProviders(
      <AdministratorList {...props} administrators={[]} />,
      undefined,
      "/administrators?search=badSearch",
    );

    const emptyMessage = screen.getByText(
      /no administrators found with the search/i,
    );
    expect(emptyMessage).toBeInTheDocument();
  });

  it("shows actions when clicking the action button", async () => {
    renderWithProviders(<AdministratorList {...props} />);

    const actionButton = screen.getByRole("button", {
      name: `${administrators[0].name} administrator actions`,
    });

    expect(actionButton).toBeInTheDocument();

    await user.click(actionButton);

    const removeAdministratorAction = await screen.findByRole("button", {
      name: `Remove "${administrators[0].name}" administrator`,
    });
    expect(removeAdministratorAction).toBeInTheDocument();
  });

  it("should open sidepanel when clicking the administrator name", async () => {
    renderWithProviders(<AdministratorList {...props} />);

    const adminButton = screen.getByRole("button", {
      name: administrators[0].name,
    });

    expect(adminButton).toBeInTheDocument();

    await user.click(adminButton);

    const sidePanel = await screen.findByRole("complementary");
    expect(sidePanel).toBeInTheDocument();

    const sidePanelHeader = await screen.findByRole("heading", {
      name: administrators[0].name,
    });
    expect(sidePanelHeader).toBeInTheDocument();
  });
});
