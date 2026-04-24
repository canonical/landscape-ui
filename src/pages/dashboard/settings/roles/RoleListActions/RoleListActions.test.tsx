import { renderWithProviders } from "@/tests/render";
import RoleListActions from "./RoleListActions";
import type { ComponentProps } from "react";
import { roles } from "@/tests/mocks/roles";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const nonGlobalAdminRole = roles.find((r) => r.name !== "GlobalAdmin");
assert(nonGlobalAdminRole);

const props: ComponentProps<typeof RoleListActions> = {
  role: nonGlobalAdminRole,
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
    const editMenuItem = await screen.findByRole("menuitem", {
      name: `Edit "${props.role.name}" role`,
    });
    expect(editMenuItem).toBeInTheDocument();

    const removeMenuItem = await screen.findByRole("menuitem", {
      name: `Remove "${props.role.name}" role`,
    });
    expect(removeMenuItem).toBeInTheDocument();
  });

  it("opens modal on remove button click", async () => {
    const removeMenuItem = await screen.findByRole("menuitem", {
      name: `Remove "${props.role.name}" role`,
    });
    expect(removeMenuItem).toBeInTheDocument();

    await user.click(removeMenuItem);

    const confirmationModal = await screen.findByRole("dialog");
    expect(confirmationModal).toBeInTheDocument();

    expect(screen.getByText(/this will remove/i)).toBeInTheDocument();
  });

  it("opens edit sidepanel on edit button click", async () => {
    const editMenuItem = await screen.findByRole("menuitem", {
      name: `Edit "${props.role.name}" role`,
    });
    expect(editMenuItem).toBeInTheDocument();

    await user.click(editMenuItem);

    const sidePanel = await screen.findByRole("complementary");
    expect(sidePanel).toBeInTheDocument();

    expect(
      within(sidePanel).getByRole("heading", {
        name: `Edit "${props.role.name}" role`,
      }),
    ).toBeInTheDocument();
  });

  it("confirms removal of a role", async () => {
    const removeMenuItem = await screen.findByRole("menuitem", {
      name: `Remove "${props.role.name}" role`,
    });
    await user.click(removeMenuItem);

    const dialog = await screen.findByRole("dialog");
    const confirmButton = within(dialog).getByRole("button", {
      name: /remove/i,
    });
    await user.click(confirmButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
