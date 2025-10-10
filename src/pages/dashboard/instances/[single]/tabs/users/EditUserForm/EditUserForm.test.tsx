import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import EditUserForm from "./EditUserForm";
import userEvent from "@testing-library/user-event";
import { users } from "@/tests/mocks/user";

const props = {
  instanceId: 1,
  user: users[0],
};

describe("EditUserForm", () => {
  beforeEach(() => {
    renderWithProviders(<EditUserForm {...props} />);
  });
  it("renders the form", () => {
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
  });

  it("renders form fields", () => {
    const form = screen.getByRole("form");
    expect(form).toHaveTexts([
      "Username",
      "Name",
      "Password",
      "Confirm password",
      "Primary Group",
      "Additional Groups",
      "Location",
      "Home phone",
      "Work phone",
    ]);
  });

  it("renders form fields with user data", () => {
    const form = screen.getByRole("form");
    expect(form).toHaveInputValues([
      props.user.username,
      props.user.name ?? "",
      props.user.location ?? "",
      props.user.home_phone ?? "",
      props.user.work_phone ?? "",
    ]);
  });

  it("can edit user data", async () => {
    const form = screen.getByRole("form");
    let username;
    if (props.user.name === props.user.username) {
      const inputs = await within(form).findAllByDisplayValue(
        props.user.username,
      );
      [username] = inputs;
    } else {
      username = await within(form).findByDisplayValue(props.user.username);
    }

    await userEvent.clear(username);
    await userEvent.type(username, "newusername");

    expect(form).toHaveInputValues(["newusername"]);
  });
});
