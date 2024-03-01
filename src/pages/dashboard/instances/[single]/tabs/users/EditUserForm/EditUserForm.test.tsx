import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import EditUserForm from "./EditUserForm";
import userEvent from "@testing-library/user-event";

const mockProps = {
  instanceId: 1,
  user: {
    uid: 1,
    username: "testuser",
    name: "Test User",
    primary_gid: 1,
    location: "Test Location",
    home_phone: "1234567890",
    work_phone: "0987654321",
    enabled: true,
  },
};

describe("EditUserForm", () => {
  it("renders the form", () => {
    renderWithProviders(<EditUserForm {...mockProps} />);
    const formElement = screen.getByRole("form");
    expect(formElement).toBeInTheDocument();
  });

  it("renders form fields", () => {
    const { container } = renderWithProviders(<EditUserForm {...mockProps} />);
    expect(container).toHaveTexts([
      "Username",
      "Name",
      "Passphrase",
      "Confirm passphrase",
      "Primary Group",
      "Additional Groups",
      "Location",
      "Home phone",
      "Work phone",
    ]);
  });

  it("renders form fields with user data", () => {
    const { container } = renderWithProviders(<EditUserForm {...mockProps} />);
    expect(container).toHaveInputValues([
      mockProps.user.username,
      mockProps.user.name,
      mockProps.user.location,
      mockProps.user.home_phone,
      mockProps.user.work_phone,
    ]);
  });

  it("can edit user data", async () => {
    const { container } = renderWithProviders(<EditUserForm {...mockProps} />);
    const username = container.querySelector('input[name="username"]');
    if (!username) throw new Error("username input not found");
    userEvent.clear(username);
    await userEvent.type(username, "newusername");
    expect(container).toHaveInputValues([
      "newusername",
      mockProps.user.name,
      mockProps.user.location,
      mockProps.user.home_phone,
      mockProps.user.work_phone,
    ]);
  });
});
