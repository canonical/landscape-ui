import { renderWithProviders } from "@/tests/render";
import RolesPage from "./RolesPage";
import { expectLoadingState } from "@/tests/helpers";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("RolesPage", () => {
  const user = userEvent.setup();

  it("renders the Roles Page correctly", async () => {
    renderWithProviders(<RolesPage />);

    await expectLoadingState();

    expect(screen.getByRole("heading", { name: /roles/i })).toBeInTheDocument();

    const addRoleButton = screen.getByRole("button", { name: /add role/i });
    expect(addRoleButton).toBeInTheDocument();

    await user.click(addRoleButton);

    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });
});
