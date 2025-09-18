import { roles } from "@/tests/mocks/roles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import EditRoleForm from "./EditRoleForm";

const props: ComponentProps<typeof EditRoleForm> = {
  role: roles[0],
};

describe("EditRoleForm", () => {
  it("renders EditRoleForm", () => {
    renderWithProviders(<EditRoleForm {...props} />);

    expect(screen.getByText("Global permissions")).toBeInTheDocument();
    expect(screen.getByText("Permissions")).toBeInTheDocument();
    expect(screen.getByText("Access Groups")).toBeInTheDocument();
    expect(screen.getByText(/save changes/i)).toBeInTheDocument();
  });
});
