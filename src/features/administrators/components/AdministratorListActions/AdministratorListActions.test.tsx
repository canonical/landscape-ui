import { renderWithProviders } from "@/tests/render";
import AdministratorListActions from "./AdministratorListActions";
import type { ComponentProps } from "react";
import { administrators } from "@/tests/mocks/administrators";
import userEvent from "@testing-library/user-event";
import { screen, within } from "@testing-library/react";

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
    const removeMenuItem = screen.getByRole("menuitem", {
      name: `Remove "${administrators[0].name}" administrator`,
    });
    expect(removeMenuItem).toBeInTheDocument();
  });

  it("shows modal upon remove button click", async () => {
    const removeMenuItem = screen.getByRole("menuitem", {
      name: `Remove "${administrators[0].name}" administrator`,
    });
    await user.click(removeMenuItem);

    const modal = screen.getByRole("dialog");
    expect(modal).toBeInTheDocument();
  });

  it("removes administrator and shows success notification upon confirmation", async () => {
    const removeMenuItem = screen.getByRole("menuitem", {
      name: `Remove "${administrators[0].name}" administrator`,
    });
    await user.click(removeMenuItem);

    const dialog = screen.getByRole("dialog");
    const confirmButton = within(dialog).getByRole("button", {
      name: /remove/i,
    });
    await user.click(confirmButton);

    expect(
      await screen.findByText(
        new RegExp(
          `removed ${administrators[0].name} as an administrator`,
          "i",
        ),
      ),
    ).toBeInTheDocument();
  });

  it("closes the modal on cancel", async () => {
    const removeMenuItem = screen.getByRole("menuitem", {
      name: `Remove "${administrators[0].name}" administrator`,
    });
    await user.click(removeMenuItem);

    const dialog = screen.getByRole("dialog");
    const cancelButton = within(dialog).getByRole("button", {
      name: /cancel/i,
    });
    await user.click(cancelButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
