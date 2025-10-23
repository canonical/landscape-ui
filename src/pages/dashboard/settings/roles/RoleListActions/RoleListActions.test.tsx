import { renderWithProviders } from "@/tests/render";
import RoleListActions from "./RoleListActions";
import type { ComponentProps } from "react";
import { roles } from "@/tests/mocks/roles";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const props: ComponentProps<typeof RoleListActions> = {
  role: roles[0],
};

describe("RoleListActions", () => {
  const user = userEvent.setup();

  it("renders actions correctly", () => {
    renderWithProviders(<RoleListActions {...props} />);

    expect(
      screen.getByRole("button", { name: `${props.role.name} role actions` }),
    ).toBeInTheDocument();
  });

  it("opens the actions of the role", async () => {
    renderWithProviders(<RoleListActions {...props} />);

    const contextualMenuButton = screen.getByRole("button", {
      name: `${props.role.name} role actions`,
    });
    expect(contextualMenuButton).toBeInTheDocument();

    await user.click(contextualMenuButton);

    const editButton = await screen.findByRole("button", {
      name: `Edit "${props.role.name}" role`,
    });
    expect(editButton).toBeInTheDocument();

    const removeButton = await screen.findByRole("button", {
      name: `Remove "${props.role.name}" role`,
    });
    expect(removeButton).toBeInTheDocument();
  });

  it("opens modal on remove button click", async () => {
    renderWithProviders(<RoleListActions {...props} />);

    const contextualMenuButton = screen.getByRole("button", {
      name: `${props.role.name} role actions`,
    });
    expect(contextualMenuButton).toBeInTheDocument();

    await user.click(contextualMenuButton);

    const removeButton = await screen.findByRole("button", {
      name: `Remove "${props.role.name}" role`,
    });
    expect(removeButton).toBeInTheDocument();

    await user.click(removeButton);

    const confirmationModal = await screen.findByRole("dialog");
    expect(confirmationModal).toBeInTheDocument();

    expect(screen.getByText(/this will remove/i)).toBeInTheDocument();
  });
});
