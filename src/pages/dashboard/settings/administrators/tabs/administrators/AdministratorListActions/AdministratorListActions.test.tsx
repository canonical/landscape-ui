import { renderWithProviders } from "@/tests/render";
import AdministratorListActions from "./AdministratorListActions";
import type { ComponentProps } from "react";
import { administrators } from "@/tests/mocks/administrators";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

const props: ComponentProps<typeof AdministratorListActions> = {
  administrator: administrators[0],
};

describe("AdministratorListActions", () => {
  const user = userEvent.setup();

  beforeEach(async () => {
    renderWithProviders(<AdministratorListActions {...props} />);
    const menuButton = screen.getByRole("button", {
      name: `${props.administrator.name} administrator actions`,
    });

    await user.click(menuButton);
  });

  it("renders correctly", () => {
    const removeButton = screen.getByRole("button", {
      name: `Remove "${administrators[0].name}" administrator`,
    });
    expect(removeButton).toBeInTheDocument();
  });

  it("shows modal upon remove button click", async () => {
    const removeButton = screen.getByRole("button", {
      name: `Remove "${administrators[0].name}" administrator`,
    });
    await user.click(removeButton);

    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();
  });
});
