import { API_URL } from "@/constants";
import { PATHS, ROUTES } from "@/libs/routes";
import { activities } from "@/tests/mocks/activity";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";
import { userGroups } from "@/tests/mocks/userGroup";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import NewUserForm from "./NewUserForm";

describe("NewUserForm", () => {
  it("renders the form", () => {
    renderWithProviders(<NewUserForm />);
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
  });

  it("renders form fields", () => {
    renderWithProviders(<NewUserForm />);
    const form = screen.getByRole("form");
    expect(form).toHaveTexts([
      "Username",
      "Name",
      "Password",
      "Confirm password",
      "Primary Group",
      "Location",
      "Home phone",
      "Work phone",
    ]);

    const addUserButton = screen.getByRole("button", { name: /add user/i });
    expect(addUserButton).toBeInTheDocument();
  });
  it("loads groups and creates a user on the child instance", async () => {
    let requestedComputerId: number | undefined;
    let requestBody: Record<string, unknown> | undefined;
    server.use(
      http.get(`${API_URL}computers/:computerId/groups`, ({ params }) => {
        requestedComputerId = Number(params.computerId);
        return HttpResponse.json({ groups: userGroups });
      }),
      http.post(`${API_URL}users`, async ({ request }) => {
        requestBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json(activities[0]);
      }),
    );
    renderWithProviders(
      <NewUserForm />,
      undefined,
      ROUTES.instances.details.child(1, 2),
      `/${PATHS.instances.root}/${PATHS.instances.single}/${PATHS.instances.child}`,
    );
    const user = userEvent.setup();
    await screen.findByRole("option", { name: "daemon" });
    await user.type(screen.getByLabelText("Username"), "newuser");
    await user.type(screen.getByLabelText("Name"), "New User");
    await user.type(screen.getByLabelText("Password"), "synthetic-password");
    await user.type(
      screen.getByLabelText("Confirm password"),
      "synthetic-password",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Primary Group" }),
      "daemon",
    );
    await user.click(screen.getByRole("button", { name: "Add user" }));

    await waitFor(() => {
      expect(requestBody).toMatchObject({
        computer_ids: [2],
        username: "newuser",
        primary_groupname: "daemon",
      });
    });
    expect(requestedComputerId).toBe(2);
  });
});
