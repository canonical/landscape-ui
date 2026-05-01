import NoData from "@/components/layout/NoData";
import { administrators } from "@/tests/mocks/administrators";
import { roles } from "@/tests/mocks/roles";
import { renderWithProviders } from "@/tests/render";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import EditAdministratorForm from "./EditAdministratorForm";

const administratorWithoutAllRoles = administrators.find(
  (administrator) => administrator.roles.length < roles.length,
);
assert(administratorWithoutAllRoles);

const props: ComponentProps<typeof EditAdministratorForm> = {
  administrator: administratorWithoutAllRoles,
};

describe("EditAdministratorForm", () => {
  const user = userEvent.setup();

  it("renders without crashing", () => {
    const { container } = renderWithProviders(
      <EditAdministratorForm {...props} />,
    );
    const fieldsToCheck = [
      {
        label: "Name",
        value: props.administrator.name,
      },
      {
        label: "Email",
        value: props.administrator.email,
      },
      {
        label: "Timezone",
        value: <NoData />,
      },
      {
        label: "Identity URL",
        value: <NoData />,
      },
    ];

    for (const { label, value } of fieldsToCheck) {
      expect(container).toHaveInfoItem(label, value);
    }
  });

  it("opens remove confirmation modal", async () => {
    renderWithProviders(<EditAdministratorForm {...props} />);
    const removeButton = screen.getByRole("button", { name: /remove/i });
    await user.click(removeButton);
    expect(
      screen.getByText(/this will remove the administrator/i),
    ).toBeInTheDocument();
  });

  it("shows disabled save changes button unless a role is changed", () => {
    renderWithProviders(<EditAdministratorForm {...props} />);
    const saveButton = screen.getByRole("button", { name: /save changes/i });
    expect(saveButton).toHaveAttribute("aria-disabled", "true");
  });

  it("changes role of an admin", async () => {
    renderWithProviders(<EditAdministratorForm {...props} />);
    const combobox = screen.getByRole("combobox", { name: /roles/i });
    await user.click(combobox);

    const uncheckedRole = roles.find(
      (role) => !props.administrator.roles.includes(role.name),
    );

    assert(uncheckedRole);

    const roleCheckbox = screen.getByRole("checkbox", {
      name: uncheckedRole.name,
    });
    await user.click(roleCheckbox);

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    expect(saveButton).not.toHaveAttribute("aria-disabled");
    expect(saveButton).toBeEnabled();
  });

  it("confirms disable administrator", async () => {
    renderWithProviders(<EditAdministratorForm {...props} />);
    const removeButton = screen.getByRole("button", { name: /remove/i });
    await user.click(removeButton);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    expect(
      within(dialog).getByText(/this will remove the administrator/i),
    ).toBeInTheDocument();

    const buttons = within(dialog).getAllByRole("button");
    const confirmButton = buttons.find((btn) =>
      btn.textContent?.toLowerCase().includes("remove"),
    );
    expect(confirmButton).toBeDefined();
    assert(confirmButton);
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("submits the form successfully after changing roles", async () => {
    renderWithProviders(<EditAdministratorForm {...props} />);

    const combobox = screen.getByRole("combobox", { name: /roles/i });
    await user.click(combobox);

    const uncheckedRole = roles.find(
      (role) => !props.administrator.roles.includes(role.name),
    );
    assert(uncheckedRole);

    await user.click(
      screen.getByRole("checkbox", { name: uncheckedRole.name }),
    );

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText(/permission changes have been queued/i),
    ).toBeInTheDocument();
  });
});
