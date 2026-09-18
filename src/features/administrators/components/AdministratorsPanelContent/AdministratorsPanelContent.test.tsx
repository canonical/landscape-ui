import { renderWithProviders } from "@/tests/render";
import AdministratorsPanelContent from "./AdministratorsPanelContent";
import type { ComponentProps } from "react";
import { administrators } from "@/tests/mocks/administrators";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const props: ComponentProps<typeof AdministratorsPanelContent> = {
  administrators: administrators,
};

describe("AdministratorsPanelContent", () => {
  const user = userEvent.setup();

  it("renders without crashing", () => {
    renderWithProviders(<AdministratorsPanelContent {...props} />);

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
  });

  it("filters administrators on search", async () => {
    renderWithProviders(<AdministratorsPanelContent {...props} />);

    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();

    await user.type(searchInput, administrators[0].name);
    await user.keyboard("{enter}");

    const administratorButton = screen.getByRole("button", {
      name: administrators[0].name,
    });

    expect(administratorButton).toBeInTheDocument();

    const removedAdministrator = screen.queryByRole("button", {
      name: administrators[1].name,
    });

    expect(removedAdministrator).not.toBeInTheDocument();
  });

  it("filters administrators on search parameters", async () => {
    renderWithProviders(
      <AdministratorsPanelContent {...props} />,
      undefined,
      `/settings/administrators?search=${administrators[0].name}`,
    );

    const administratorButton = screen.getByRole("button", {
      name: administrators[0].name,
    });

    expect(administratorButton).toBeInTheDocument();

    const removedAdministrator = screen.queryByRole("button", {
      name: administrators[1].name,
    });

    expect(removedAdministrator).not.toBeInTheDocument();
  });
});
