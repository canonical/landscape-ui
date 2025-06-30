import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import type { ComponentProps } from "react";
import RoleList from "./RoleList";
import { roles } from "@/tests/mocks/roles";
import { userEvent } from "@testing-library/user-event";

const props: ComponentProps<typeof RoleList> = {
  roleList: roles,
};

describe("RoleList", () => {
  it("should render role list with correct headers and data", () => {
    renderWithProviders(<RoleList {...props} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Administrators")).toBeInTheDocument();
    expect(screen.getByText("View")).toBeInTheDocument();
    expect(screen.getByText("Manage")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    const rows = screen.getAllByRole("row");

    for (const role of roles) {
      const row = rows.find((r) => within(r).queryByText(role.name));
      assert(row);

      expect(within(row).getByText(role.name)).toBeInTheDocument();
      expect(
        within(row).getByText(role.persons.length.toString()),
      ).toBeInTheDocument();

      if (role.name !== "GlobalAdmin") {
        expect(screen.getByText(`${role.name}`)).toBeInTheDocument();
      }
    }
  });

  it("expands a permission cell and collapses it on outside click", async () => {
    renderWithProviders(<RoleList roleList={roles} />);
    const user = userEvent.setup();

    const preExpandButtons = screen.getAllByRole("button");
    const [firstExpandableButton] = preExpandButtons;

    await user.click(firstExpandableButton);

    const postExpandButtons = screen.getAllByRole("button");
    expect(postExpandButtons.length).toBeGreaterThan(preExpandButtons.length);

    await user.click(document.body);

    const postCollapseButtons = screen.getAllByRole("button");
    expect(postCollapseButtons.length).toBe(preExpandButtons.length);
  });

  it("does not render RoleListActions for GlobalAdmin role", () => {
    const globalAdminOnly = [{ ...roles[0], name: "GlobalAdmin" }];
    renderWithProviders(<RoleList roleList={globalAdminOnly} />);

    const row = screen.getByText("GlobalAdmin").closest("tr");
    expect(row).toBeInTheDocument();

    const buttons = within(row as HTMLElement).queryAllByRole("button");
    expect(buttons.length).toBe(0);
  });

  it("renders RoleListActions for non-GlobalAdmin roles", () => {
    const roleWithActions = [{ ...roles[0], name: "Editor" }];
    renderWithProviders(<RoleList roleList={roleWithActions} />);

    const row = screen.getByText("Editor").closest("tr");
    expect(row).toBeInTheDocument();

    const buttons = within(row as HTMLElement).queryAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });
});
