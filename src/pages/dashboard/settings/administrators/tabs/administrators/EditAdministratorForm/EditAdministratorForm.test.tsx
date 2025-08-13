import { administrators } from "@/tests/mocks/administrators";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import EditAdministratorForm from "./EditAdministratorForm";
import userEvent from "@testing-library/user-event";
import NoData from "@/components/layout/NoData";
import { roles } from "@/tests/mocks/roles";

const indexOfAdministratorWithoutAllRoles = administrators.findIndex(
  (administrator) => administrator.roles.length < roles.length,
);

const props: ComponentProps<typeof EditAdministratorForm> = {
  administrator: administrators[indexOfAdministratorWithoutAllRoles],
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
    expect(saveButton).toBeDisabled();
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
    expect(saveButton).toBeEnabled();
  });
});
