import { renderWithProviders } from "@/tests/render";
import AdministratorRolesCell from "./AdministratorRolesCell";
import type { ComponentProps } from "react";
import { administrators } from "@/tests/mocks/administrators";
import { roles } from "@/tests/mocks/roles";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const roleOptions = roles.map((role) => ({
  label: role.name,
  value: role.name,
}));

const administratorIndexWithoutAllRoles = administrators.findIndex(
  (admin) => admin.roles.length < roles.length,
);

const props: ComponentProps<typeof AdministratorRolesCell> = {
  administrator: administrators[administratorIndexWithoutAllRoles],
  roleOptions: roleOptions,
};

describe("AdministratorRolesCell", () => {
  const user = userEvent.setup();

  it("renders correctly", () => {
    renderWithProviders(<AdministratorRolesCell {...props} />);
    expect(
      screen.getByRole("combobox", { name: /select roles/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(props.administrator.roles.join(", ")),
    ).toBeInTheDocument();
  });

  it("opens roles dropdown", async () => {
    renderWithProviders(<AdministratorRolesCell {...props} />);
    const combobox = screen.getByRole("combobox", { name: /select roles/i });
    expect(combobox).toBeInTheDocument();
    await user.click(combobox);
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("changes a role for the administrator", async () => {
    renderWithProviders(<AdministratorRolesCell {...props} />);
    const combobox = screen.getByRole("combobox", { name: /select roles/i });
    await user.click(combobox);
    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();

    const unappliedRole = roles.find(
      (role) => !props.administrator.roles.includes(role.name),
    );

    assert(unappliedRole);

    const option = screen.getByRole("checkbox", { name: unappliedRole.name });
    await user.click(option);

    const saveButton = screen.getByRole("button", { name: /save/i });

    await user.click(saveButton);

    const newRoles = [...props.administrator.roles, unappliedRole.name];

    expect(screen.getByText(newRoles.join(", "))).toBeInTheDocument();
  });

  it("reverts unsaved role checkbox changes", async () => {
    renderWithProviders(<AdministratorRolesCell {...props} />);
    const combobox = screen.getByRole("combobox", { name: /select roles/i });
    await user.click(combobox);
    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();

    const unappliedRole = roles.find(
      (role) => !props.administrator.roles.includes(role.name),
    );

    assert(unappliedRole);

    const option = screen.getByRole("checkbox", { name: unappliedRole.name });
    await user.click(option);

    const revertButton = screen.getByRole("button", { name: /revert/i });

    await user.click(revertButton);

    expect(
      screen.getByText(props.administrator.roles.join(", ")),
    ).toBeInTheDocument();
  });

  it("shows error when deselecting all roles", async () => {
    renderWithProviders(<AdministratorRolesCell {...props} />);
    const combobox = screen.getByRole("combobox", { name: /select roles/i });
    await user.click(combobox);
    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();

    const currentRoles = [...props.administrator.roles];

    for (const role of currentRoles) {
      const option = screen.getByRole("checkbox", { name: role });
      await user.click(option);
    }

    const saveButton = screen.getByRole("button", { name: /save/i });
    await user.click(saveButton);

    expect(screen.getAllByText(/at least one role is required/i)).toHaveLength(
      2,
    );
  });
});
