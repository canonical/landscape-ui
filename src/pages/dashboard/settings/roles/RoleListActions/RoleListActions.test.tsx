import { renderWithProviders } from "@/tests/render";
import RoleListActions from "./RoleListActions";
import type { ComponentProps } from "react";
import { roles } from "@/tests/mocks/roles";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const props: ComponentProps<typeof RoleListActions> = {
  role: roles[0],
};

describe("RoleListActions", () => {
  const user = userEvent.setup();

  beforeEach(async () => {
    renderWithProviders(<RoleListActions {...props} />);

    const contextualMenuButton = screen.getByRole("button", {
      name: `${props.role.name} role actions`,
    });
    expect(contextualMenuButton).toBeInTheDocument();

    await user.click(contextualMenuButton);
  });

  it("opens the actions of the role", async () => {
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
    const removeButton = await screen.findByRole("button", {
      name: `Remove "${props.role.name}" role`,
    });
    expect(removeButton).toBeInTheDocument();

    await user.click(removeButton);

    const confirmationModal = await screen.findByRole("dialog");
    expect(confirmationModal).toBeInTheDocument();

    expect(screen.getByText(/this will remove/i)).toBeInTheDocument();
  });

  it("opens edit sidepanel on edit button click", async () => {
    const editButton = await screen.findByRole("button", {
      name: `Edit "${props.role.name}" role`,
    });
    expect(editButton).toBeInTheDocument();

    await user.click(editButton);

    const sidePanel = await screen.findByRole("complementary");
    expect(sidePanel).toBeInTheDocument();

    expect(
      within(sidePanel).getByRole("heading", {
        name: `Edit "${props.role.name}" role`,
      }),
    ).toBeInTheDocument();
  });
});
