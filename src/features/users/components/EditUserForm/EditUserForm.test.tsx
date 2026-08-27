import { API_URL } from "@/constants";
import { PATHS, ROUTES } from "@/libs/routes";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { users } from "@/tests/mocks/user";
import { userGroups } from "@/tests/mocks/userGroup";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import type { User } from "@/types/User";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { Route, Routes, useLocation } from "react-router";
import EditUserForm from "./EditUserForm";

const routePattern = `/${PATHS.instances.root}/${PATHS.instances.single}`;

const renderEditUserForm = (user: User = users[0]) =>
  renderWithProviders(
    <EditUserForm user={user} />,
    undefined,
    ROUTES.instances.details.single(1),
    routePattern,
  );

const ActivitiesDestination = () => {
  const { pathname, search, state } = useLocation();

  return (
    <>
      <output data-testid="activity-destination">
        {pathname}
        {search}
      </output>
      <output data-testid="selected-activity">{JSON.stringify(state)}</output>
    </>
  );
};

const renderEditUserFormWithActivitiesDestination = () =>
  renderWithProviders(
    <Routes>
      <Route path={routePattern} element={<EditUserForm user={users[0]} />} />
      <Route path={PATHS.activities.root} element={<ActivitiesDestination />} />
    </Routes>,
    undefined,
    ROUTES.instances.details.single(1),
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

  it("shows a pending deletion activity notification", () => {
    renderEditUserForm({
      ...users[0],
      pending_activity: {
        activity_id: 123,
        activity_status: "undelivered",
        summary: "Delete user user1",
        operation: "delete",
      },
    });

    expect(screen.getByText("User activity pending:")).toBeInTheDocument();
    expect(
      screen.getByText("This user has a pending activity to be deleted."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View activity" })).toHaveAttribute(
      "href",
      ROUTES.activities.root({ query: "id:123" }),
    );
  });

  it.each(["lock", "unlock"] as const)(
    "does not show a pending %s activity notification",
    (operation) => {
      renderEditUserForm({
        ...users[0],
        pending_activity: {
          activity_id: 123,
          activity_status: "undelivered",
          summary: `${operation} user user1`,
          operation,
        },
      });

      expect(
        screen.queryByText("User activity pending:"),
      ).not.toBeInTheDocument();
    },
  );

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

    const additionalGroups = screen.getByRole("combobox", {
      name: "Additional Groups",
    });
    await userEvent.click(additionalGroups);
    await screen.findByRole("checkbox", { name: "daemon", checked: true });
    await userEvent.click(additionalGroups);

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

  it("submits and shows queued activity notification", async () => {
    const user = userEvent.setup();
    renderEditUserForm();

    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Updated user");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText("An activity is queued to edit user1."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("You queued user1 to be edited."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "View details" }),
    ).toBeInTheDocument();
  });

  it("shows the latest pending activity link for each requested field change", async () => {
    server.use(
      http.get(
        `${API_URL}computers/:computerId/users/:username/activities`,
        () =>
          HttpResponse.json({
            count: 3,
            results: [
              {
                activity_id: 103,
                summary: "Editing user(s)",
                activity_status: "undelivered",
                creation_time: "2026-08-17T10:00:00Z",
                completion_time: null,
                changes: [{ kind: "profile", field: "name" }],
              },
              {
                activity_id: 102,
                summary: "Editing user(s)",
                activity_status: "succeeded",
                creation_time: "2026-08-17T09:00:00Z",
                completion_time: "2026-08-17T09:01:00Z",
                changes: [{ kind: "profile", field: "name" }],
              },
              {
                activity_id: 101,
                summary: "Adding user(s) to group(s)",
                activity_status: "undelivered",
                creation_time: "2026-08-17T08:00:00Z",
                completion_time: null,
                changes: [
                  {
                    kind: "additional_group",
                    group_name: "developers",
                    operation: "add",
                  },
                ],
              },
            ],
          }),
      ),
    );

    renderEditUserForm();

    expect(
      await screen.findByRole("button", {
        name: "View activity 103: Queued",
      }),
    ).toHaveTextContent("Editing user(s): Queued");
    expect(
      screen.queryByRole("button", {
        name: "View activity 102: Succeeded",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "View activity 101: Queued",
      }),
    ).toHaveTextContent("Adding user(s) to group(s): Queued");
  });

  it("does not show cached activity helpers while activities are refetched", async () => {
    let returnPendingActivity = true;
    let requestCount = 0;
    server.use(
      http.get(
        `${API_URL}computers/:computerId/users/:username/activities`,
        () => {
          requestCount += 1;
          return HttpResponse.json(
            returnPendingActivity
              ? {
                  count: 1,
                  results: [
                    {
                      activity_id: 103,
                      summary: "Editing user(s)",
                      activity_status: "undelivered",
                      creation_time: "2026-08-17T10:00:00Z",
                      completion_time: null,
                      changes: [{ kind: "profile", field: "name" }],
                    },
                  ],
                }
              : {
                  count: 0,
                  results: [],
                },
          );
        },
      ),
    );

    let showForm = true;
    const renderForm = () => (
      <Routes>
        <Route
          path={routePattern}
          element={showForm ? <EditUserForm user={users[0]} /> : null}
        />
      </Routes>
    );
    const rendered = renderWithProviders(
      renderForm(),
      undefined,
      ROUTES.instances.details.single(1),
    );

    expect(
      await screen.findByRole("button", {
        name: "View activity 103: Queued",
      }),
    ).toBeInTheDocument();

    returnPendingActivity = false;
    const requestCountBeforeRemount = requestCount;
    showForm = false;
    rendered.rerender(renderForm());
    showForm = true;
    rendered.rerender(renderForm());

    expect(
      screen.queryByRole("button", {
        name: "View activity 103: Queued",
      }),
    ).not.toBeInTheDocument();
    await waitFor(() => {
      expect(requestCount).toBeGreaterThan(requestCountBeforeRemount);
    });
    expect(
      screen.queryByRole("button", {
        name: "View activity 103: Queued",
      }),
    ).not.toBeInTheDocument();
  });

  it("opens the selected activity on the activities page", async () => {
    server.use(
      http.get(
        `${API_URL}computers/:computerId/users/:username/activities`,
        () =>
          HttpResponse.json({
            count: 1,
            results: [
              {
                activity_id: 103,
                summary: "Editing user(s)",
                activity_status: "undelivered",
                creation_time: "2026-08-17T10:00:00Z",
                completion_time: null,
                changes: [{ kind: "profile", field: "name" }],
              },
            ],
          }),
      ),
    );
    const user = userEvent.setup();
    renderEditUserFormWithActivitiesDestination();

    await user.click(
      await screen.findByRole("button", {
        name: "View activity 103: Queued",
      }),
    );

    expect(screen.getByTestId("activity-destination")).toHaveTextContent(
      ROUTES.activities.root({ query: "id:103" }),
    );
    expect(screen.getByTestId("selected-activity")).toHaveTextContent(
      JSON.stringify({
        activity: { id: 103, summary: "Editing user(s)" },
      }),
    );
  });

  it("does not submit an unchanged blank profile", async () => {
    let requestBody: Record<string, unknown> | undefined;
    server.use(
      http.put(`${API_URL}users`, async ({ request }) => {
        requestBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({});
      }),
    );
    const user = userEvent.setup();
    renderEditUserForm({
      ...users[8],
      name: undefined,
      location: undefined,
      home_phone: undefined,
      work_phone: undefined,
    });

    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Save changes" }),
      ).toBeEnabled();
    });
    expect(requestBody).toBeUndefined();
  });

  it("only sends changed profile fields in the edit request", async () => {
    let requestBody: Record<string, unknown> | undefined;
    server.use(
      http.put(`${API_URL}users`, async ({ request }) => {
        requestBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({});
      }),
    );
    const user = userEvent.setup();
    renderEditUserForm();

    await screen.findByRole("option", { name: "daemon" });
    const locationInput = screen.getByLabelText("Location");
    await user.clear(locationInput);
    await user.type(locationInput, "new location");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(requestBody).toBeDefined();
    });
    expect(requestBody).toHaveProperty("location", "new location");
    expect(requestBody).not.toHaveProperty("name");
    expect(requestBody).not.toHaveProperty("primary_groupname");
  });

  it("includes a non-empty password in the edit request", async () => {
    let requestBody: Record<string, unknown> | undefined;
    server.use(
      http.put(`${API_URL}users`, async ({ request }) => {
        requestBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({});
      }),
    );
    const user = userEvent.setup();
    renderEditUserForm();

    await user.type(screen.getByLabelText("Password"), "new-password");
    await user.type(screen.getByLabelText("Confirm password"), "new-password");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(requestBody).toBeDefined();
    });
    expect(requestBody).toHaveProperty("password", "new-password");
  });

  it("sends the changed primary group name instead of its GID", async () => {
    let requestBody: Record<string, unknown> | undefined;
    server.use(
      http.put(`${API_URL}users`, async ({ request }) => {
        requestBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({});
      }),
    );
    const user = userEvent.setup();
    renderEditUserForm();

    await screen.findByRole("option", { name: "daemon" });
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Primary Group" }),
      "2",
    );
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(requestBody).toBeDefined();
    });
    expect(requestBody).toHaveProperty("primary_groupname", "bin");
  });

  it("shows endpoint error notification on submit failure", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "error", path: "users" });
    renderEditUserForm();

    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Updated user");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(
        screen.getByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
      ).toBeInTheDocument();
    });
  });

  it("adds a newly selected additional group", async () => {
    const user = userEvent.setup();
    const daemonGroup = userGroups.find((entry) => entry.name === "daemon");
    const binGroup = userGroups.find((entry) => entry.name === "bin");
    assert(daemonGroup);
    assert(binGroup);
    let profileUpdateRequests = 0;
    server.use(
      http.put(`${API_URL}users`, () => {
        profileUpdateRequests += 1;
        return HttpResponse.json({});
      }),
    );

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
      await screen.findByText("An activity is queued to edit user1."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "View details" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "View profile changes" }),
    ).not.toBeInTheDocument();
    expect(profileUpdateRequests).toBe(0);
    expect(
      screen.queryByRole("button", { name: "View activity 1" }),
    ).not.toBeInTheDocument();
  });

  it("removes an unselected additional group", async () => {
    const daemonGroup = userGroups.find((entry) => entry.name === "daemon");
    assert(daemonGroup);
    let removeRequest: Record<string, unknown> | undefined;
    server.use(
      http.post(
        `${API_URL}computers/:computerId/usergroups/update_bulk`,
        async ({ request }) => {
          removeRequest = (await request.json()) as Record<string, unknown>;
          return HttpResponse.json({});
        },
      ),
    );
    setEndpointStatus({
      status: "variant",
      path: "user-groups",
      response: [daemonGroup],
    });
    const user = userEvent.setup();
    renderEditUserForm();

    await user.click(
      screen.getByRole("combobox", { name: "Additional Groups" }),
    );
    await user.click(
      await screen.findByRole("checkbox", { name: daemonGroup.name }),
    );
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(removeRequest).toBeDefined();
    });
    expect(removeRequest).toMatchObject({
      action: "remove",
      groupnames: [daemonGroup.name],
      usernames: [users[0].username],
    });
  });

  it("submits when no additional groups are assigned", async () => {
    const user = userEvent.setup();

    setEndpointStatus({ status: "empty", path: "users/groups" });
    renderEditUserForm();

    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Updated user");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText("An activity is queued to edit user1."),
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
      await screen.findByText("An activity is queued to edit user1."),
    ).toBeInTheDocument();
  });
});
