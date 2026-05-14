import { PATHS, ROUTES } from "@/libs/routes";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { users } from "@/tests/mocks/user";
import { userGroups } from "@/tests/mocks/userGroup";
import { renderWithProviders } from "@/tests/render";
import type { User } from "@/types/User";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditUserForm from "./EditUserForm";

const routePattern = `/${PATHS.instances.root}/${PATHS.instances.single}`;

const renderEditUserForm = (user: User = users[0]) =>
  renderWithProviders(
    <EditUserForm user={user} />,
    undefined,
    ROUTES.instances.details.single(1),
    routePattern,
  );

describe("EditUserForm", () => {
  it("renders the form", () => {
    renderEditUserForm();

    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
  });

  it("renders form fields", () => {
    renderEditUserForm();

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
    renderEditUserForm();

    const form = screen.getByRole("form");
    expect(form).toHaveInputValues([
      users[0].username,
      users[0].name ?? "",
      users[0].location ?? "",
      users[0].home_phone ?? "",
      users[0].work_phone ?? "",
    ]);
  });

  it("renders empty optional profile fields when missing", () => {
    const userWithoutProfileDetails: User = {
      ...users[8],
      name: undefined,
      location: undefined,
      home_phone: undefined,
      work_phone: undefined,
    };

    renderEditUserForm(userWithoutProfileDetails);

    const form = screen.getByRole("form");
    expect(form).toHaveInputValues([
      userWithoutProfileDetails.username,
      "",
      "",
      "",
      "",
    ]);
  });

  it("can edit user data", async () => {
    renderEditUserForm();

    const form = screen.getByRole("form");
    let username;
    if (users[0].name === users[0].username) {
      const inputs = await within(form).findAllByDisplayValue(
        users[0].username,
      );
      [username] = inputs;
      assert(username !== undefined);
    } else {
      username = await within(form).findByDisplayValue(users[0].username);
    }

    await userEvent.clear(username);
    await userEvent.type(username, "newusername");

    expect(form).toHaveInputValues(["newusername"]);
  });

  it("shows validation error when confirm password does not match", async () => {
    const user = userEvent.setup();
    renderEditUserForm();

    await user.type(screen.getByLabelText("Password"), "new-password");
    await user.type(
      screen.getByLabelText("Confirm password"),
      "different-password",
    );
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Passwords must match")).toBeInTheDocument();
  });

  it("submits and shows success notification", async () => {
    const user = userEvent.setup();
    renderEditUserForm();

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText("User updated successfully"),
    ).toBeInTheDocument();
  });

  it("shows endpoint error notification on submit failure", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "error", path: "users" });
    renderEditUserForm();

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(
        screen.getByText('The endpoint status is set to "error".'),
      ).toBeInTheDocument();
    });
  });

  it("adds a newly selected additional group", async () => {
    const user = userEvent.setup();
    const daemonGroup = userGroups.find((entry) => entry.name === "daemon");
    const binGroup = userGroups.find((entry) => entry.name === "bin");
    assert(daemonGroup);
    assert(binGroup);

    setEndpointStatus({
      status: "variant",
      path: "user-groups",
      response: userGroups.filter((g) => g.name === "daemon"),
    });
    renderEditUserForm();

    await user.click(
      screen.getByRole("combobox", { name: "Additional Groups" }),
    );
    await user.click(
      await screen.findByRole("checkbox", { name: binGroup.name }),
    );
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText("User updated successfully"),
    ).toBeInTheDocument();
  });

  it("submits when no additional groups are assigned", async () => {
    const user = userEvent.setup();

    setEndpointStatus({ status: "empty", path: "users/groups" });
    renderEditUserForm();

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText("User updated successfully"),
    ).toBeInTheDocument();
  });

  it("allows changing additional groups selection", async () => {
    const user = userEvent.setup();
    const group = userGroups.find((entry) => entry.name === "daemon");
    assert(group);
    renderEditUserForm();

    await user.click(
      screen.getByRole("combobox", { name: "Additional Groups" }),
    );
    await user.click(await screen.findByRole("checkbox", { name: group.name }));
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText("User updated successfully"),
    ).toBeInTheDocument();
  });
});
