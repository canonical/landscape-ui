import { renderWithProviders } from "@/tests/render";
import RoleList from "./RoleList";
import type { ComponentProps } from "react";
import { roles } from "@/tests/mocks/roles";
import { screen } from "@testing-library/react";

const props: ComponentProps<typeof RoleList> = {
  roleList: roles,
};

describe("RoleList", () => {
  it("renders RoleList correctly", () => {
    renderWithProviders(<RoleList {...props} />);

    expect(screen.getByRole("table")).toBeInTheDocument();

    const columnHeaders = [
      /name/i,
      /administrators/i,
      /view/i,
      /manage/i,
      /actions/i,
    ];

    columnHeaders.forEach((header) => {
      expect(
        screen.getByRole("columnheader", { name: header }),
      ).toBeInTheDocument();
    });
  });

  it("renders the roles in the table", () => {
    renderWithProviders(<RoleList {...props} />);

    roles.forEach((role) => {
      expect(
        screen.getByRole("rowheader", { name: role.name }),
      ).toBeInTheDocument();
    });
  });
});
