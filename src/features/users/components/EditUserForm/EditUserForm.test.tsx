import { API_URL } from "@/constants";
import SidePanelProvider, { SidePanelContext } from "@/context/sidePanel";
import type { Activity } from "@/features/activities";
import { PATHS, ROUTES } from "@/libs/routes";
import ActivitiesPage from "@/pages/dashboard/activities/ActivitiesPage";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { activities } from "@/tests/mocks/activity";
import { ubuntuInstance } from "@/tests/mocks/instance";
import { users } from "@/tests/mocks/user";
import { userGroups } from "@/tests/mocks/userGroup";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import type { User } from "@/types/User";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { Route, Routes } from "react-router";
import type { UserActivityEvent } from "../../api";
import UserContainer from "../UserContainer";
import EditUserForm from "./EditUserForm";

const routePattern = `/${PATHS.instances.root}/${PATHS.instances.single}`;

const renderEditUserForm = (user: User = users[0]) =>
  renderWithProviders(
    <EditUserForm user={user} />,
    undefined,
    ROUTES.instances.details.single(1),
    routePattern,
  );

const renderEditUserFormWithActivitiesPage = () =>
  renderWithProviders(
    <Routes>
      <Route path={routePattern} element={<EditUserForm user={users[0]} />} />
      <Route path={PATHS.activities.root} element={<ActivitiesPage />} />
    </Routes>,
    undefined,
    ROUTES.instances.details.single(1),
  );

const renderEditUserSidePanel = () =>
  renderWithProviders(
    <UserContainer />,
    undefined,
    ROUTES.instances.details.single(1),
    routePattern,
  );

const openEditUserSidePanel = async (
  user: ReturnType<typeof userEvent.setup>,
) => {
  await user.click(
    await screen.findByRole("button", { name: '"user1" user actions' }),
  );
  await user.click(screen.getByRole("menuitem", { name: 'Edit "user1" user' }));
  await screen.findByRole("form");
};

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
    expect(form).toHaveInputValues(["", "", "", ""]);
  });

  it("shows the username as read-only", () => {
    renderEditUserForm();

    const form = screen.getByRole("form");
    expect(within(form).getByText(users[0].username)).toBeInTheDocument();
    expect(
      within(form).queryByRole("textbox", { name: "Username" }),
    ).not.toBeInTheDocument();
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
    setEndpointStatus({
      status: "variant",
      path: "computers/:computerId/users/:username/pending-activities",
      response: {
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
            activity_status: "unapproved",
            creation_time: "2026-08-17T09:00:00Z",
            completion_time: null,
            changes: [{ kind: "profile", field: "location" }],
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
        ] satisfies UserActivityEvent[],
      },
    });

    renderEditUserForm();

    expect(
      await screen.findByRole("button", {
        name: "View activity 103: Queued",
      }),
    ).toHaveTextContent("Editing user(s): Queued");
    expect(
      screen.getByRole("button", {
        name: "View activity 102: Unapproved",
      }),
    ).toHaveTextContent("Editing user(s): Unapproved");
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
        `${API_URL}computers/:computerId/users/:username/pending-activities`,
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

  it("opens the listed child activity with its instance and available actions", async () => {
    const childActivity: Activity = {
      ...activities[0],
      id: 103,
      parent_id: 102,
      type: "EditUserRequest",
      summary: "Edit user user1 (UID 1)",
      computer_id: ubuntuInstance.id,
      activity_status: "unapproved",
      completion_time: null,
      delivery_time: null,
      result_text: null,
      actions: { approvable: true, cancelable: true, reappliable: false },
    };
    setEndpointStatus([
      { status: "variant", path: "activities", response: [childActivity] },
      { status: "variant", path: "activities/:id", response: childActivity },
      {
        status: "variant",
        path: "computers/:computerId/users/:username/pending-activities",
        response: {
          count: 1,
          results: [
            {
              activity_id: childActivity.id,
              summary: childActivity.summary,
              activity_status: childActivity.activity_status,
              creation_time: childActivity.creation_time,
              completion_time: childActivity.completion_time,
              changes: [{ kind: "profile", field: "name" }],
            },
          ],
        },
      },
    ]);
    const user = userEvent.setup();
    renderEditUserFormWithActivitiesPage();

    await user.click(
      await screen.findByRole("button", {
        name: `View activity ${childActivity.id}: Unapproved`,
      }),
    );

    const panel = screen
      .getByRole("heading", { level: 3, name: childActivity.summary })
      .closest("aside");
    assert(panel);
    expect(
      await within(panel).findByRole("link", { name: ubuntuInstance.title }),
    ).toHaveAttribute(
      "href",
      ROUTES.instances.details.fromInstance(ubuntuInstance),
    );
    expect(panel).toHaveInfoItem("Description", childActivity.summary);
    expect(
      within(panel).getByRole("button", { name: "Approve" }),
    ).toBeEnabled();
    expect(within(panel).getByRole("button", { name: "Cancel" })).toBeEnabled();
    expect(
      within(panel).queryByRole("button", { name: "Redo" }),
    ).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toHaveValue(
      `id:${childActivity.id}`,
    );
    const table = await screen.findByRole("table");
    expect(
      within(table).getByRole("button", { name: childActivity.summary }),
    ).toBeInTheDocument();
  });

  it.each([
    { profile: "populated", userToEdit: users[0] },
    {
      profile: "blank",
      userToEdit: {
        ...users[8],
        name: undefined,
        location: undefined,
        home_phone: undefined,
        work_phone: undefined,
      },
    },
  ])(
    "closes the side panel without submitting or reporting an activity for an unchanged $profile profile",
    async ({ userToEdit }) => {
      let requestBody: Record<string, unknown> | undefined;
      server.use(
        http.put(`${API_URL}users`, async ({ request }) => {
          requestBody = (await request.json()) as Record<string, unknown>;
          return HttpResponse.json({});
        }),
      );
      setEndpointStatus({
        status: "variant",
        path: "user-groups",
        response: [],
      });
      const user = userEvent.setup();
      renderWithProviders(
        <SidePanelProvider>
          <SidePanelContext.Consumer>
            {({ setSidePanelContent }) => (
              <button
                onClick={() => {
                  setSidePanelContent(
                    "Edit user",
                    <EditUserForm user={userToEdit} />,
                  );
                }}
              >
                Edit user
              </button>
            )}
          </SidePanelContext.Consumer>
        </SidePanelProvider>,
        undefined,
        ROUTES.instances.details.single(1),
        routePattern,
      );

      await user.click(screen.getByRole("button", { name: "Edit user" }));
      await screen.findByRole("option", { name: "daemon" });
      await user.click(screen.getByRole("button", { name: "Save changes" }));

      await waitFor(() => {
        expect(screen.queryByRole("form")).not.toBeInTheDocument();
      });
      expect(requestBody).toBeUndefined();
      expect(
        screen.queryByText(
          `An activity is queued to edit ${userToEdit.username}.`,
        ),
      ).not.toBeInTheDocument();
    },
  );

  it("loads user data and queues profile and group changes for the child instance", async () => {
    const requestedComputerIds: number[] = [];
    let profileRequest: Record<string, unknown> | undefined;
    let groupRequest: Record<string, unknown> | undefined;
    const binGroup = userGroups.find((group) => group.name === "bin");
    assert(binGroup);
    server.use(
      http.get(`${API_URL}computers/:computerId/groups`, ({ params }) => {
        requestedComputerIds.push(Number(params.computerId));
        return HttpResponse.json({ groups: userGroups });
      }),
      http.get(
        `${API_URL}computers/:computerId/users/:username/groups`,
        ({ params }) => {
          requestedComputerIds.push(Number(params.computerId));
          return HttpResponse.json({ groups: [] });
        },
      ),
      http.get(
        `${API_URL}computers/:computerId/users/:username/pending-activities`,
        ({ params }) => {
          requestedComputerIds.push(Number(params.computerId));
          return HttpResponse.json({ count: 0, results: [] });
        },
      ),
      http.put(`${API_URL}users`, async ({ request }) => {
        profileRequest = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json(activities[0]);
      }),
      http.post(
        `${API_URL}computers/:computerId/usergroups/update_bulk`,
        async ({ params, request }) => {
          requestedComputerIds.push(Number(params.computerId));
          groupRequest = (await request.json()) as Record<string, unknown>;
          return HttpResponse.json(activities[1]);
        },
      ),
    );
    const user = userEvent.setup();
    renderWithProviders(
      <EditUserForm user={users[0]} />,
      undefined,
      ROUTES.instances.details.child(1, 2),
      `${routePattern}/${PATHS.instances.child}`,
    );

    await screen.findByRole("option", { name: "daemon" });
    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Updated user");
    await user.click(
      screen.getByRole("combobox", { name: "Additional Groups" }),
    );
    await user.click(
      await screen.findByRole("checkbox", { name: binGroup.name }),
    );
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await screen.findByText("An activity is queued to edit user1.");
    expect(profileRequest).toEqual({
      computer_ids: [2],
      username: users[0].username,
      name: "Updated user",
    });
    expect(groupRequest).toEqual({
      computer_id: 2,
      usernames: [users[0].username],
      groupnames: [binGroup.name],
      action: "add",
    });
    expect(new Set(requestedComputerIds)).toEqual(new Set([2]));
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
    expect(requestBody).toHaveProperty("username", users[0].username);
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

  it("reports failed changes to user details when only the details request fails", async () => {
    const user = userEvent.setup();
    renderEditUserSidePanel();
    await openEditUserSidePanel(user);
    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Updated user");
    setEndpointStatus({ status: "error", path: "users" });
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    const notification = await screen.findByText(
      "Changes to user details for user1 could not be queued. Please try again.",
    );
    expect(notification.closest("aside")).toBeNull();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(
      screen.queryByText("An activity is queued to edit user1."),
    ).not.toBeInTheDocument();
  });

  it("closes the panel and shows only failed changes on the page when every request fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ status: "empty", path: "users/groups" });
    renderEditUserSidePanel();
    await openEditUserSidePanel(user);
    const panel = screen
      .getByRole("heading", { name: "Edit user", level: 3 })
      .closest("aside");
    assert(panel);

    await user.click(
      screen.getByRole("combobox", { name: "Additional Groups" }),
    );
    await user.click(await screen.findByRole("checkbox", { name: "bin" }));

    await user.clear(screen.getByLabelText("Name"));
    await user.type(screen.getByLabelText("Name"), "Updated user");
    setEndpointStatus([
      { status: "error", path: "users" },
      { status: "error", path: "userGroups" },
    ]);
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      await screen.findByText(
        "Group and user detail changes for user1 could not be queued. Please try again.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Edit user", level: 3 }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
    expect(panel).not.toHaveTextContent("Could not queue");
    expect(
      screen.queryByText("An activity is queued to edit user1."),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "View details" }),
    ).not.toBeInTheDocument();
  });

  it.each(["add", "remove"] as const)(
    "closes the panel with a page error and preserves the pending group caution when %s succeeds in a mixed save",
    async (successfulAction) => {
      const user = userEvent.setup();
      const groupRequests: string[] = [];
      const profileRequests: string[] = [];
      server.use(
        http.put(`${API_URL}users`, async ({ request }) => {
          const body = (await request.json()) as { name: string };
          profileRequests.push(body.name);
          return HttpResponse.json(
            { message: "Profile changes failed" },
            { status: 500 },
          );
        }),
        http.post(
          `${API_URL}computers/:computerId/usergroups/update_bulk`,
          async ({ request }) => {
            const body = (await request.json()) as { action: string };
            groupRequests.push(body.action);
            if (body.action === successfulAction) {
              await delay(100);
            } else {
              return HttpResponse.json(
                { message: "Removing groups failed" },
                { status: 500 },
              );
            }
            return HttpResponse.json(activities[0]);
          },
        ),
      );
      setEndpointStatus({
        status: "variant",
        path: "user-groups",
        response: userGroups.filter(({ name }) => name === "daemon"),
      });
      renderEditUserSidePanel();
      await openEditUserSidePanel(user);
      const panel = screen
        .getByRole("heading", { name: "Edit user", level: 3 })
        .closest("aside");
      assert(panel);
      await user.click(
        screen.getByRole("combobox", { name: "Additional Groups" }),
      );
      const daemon = await screen.findByRole("checkbox", { name: "daemon" });
      await waitFor(() => {
        expect(daemon).toBeChecked();
      });
      await user.click(daemon);
      await user.click(screen.getByRole("checkbox", { name: "bin" }));
      await user.clear(screen.getByLabelText("Name"));
      await user.type(screen.getByLabelText("Name"), "Updated user");
      setEndpointStatus({
        status: "variant",
        path: "computers/:computerId/users/:username/pending-activities",
        response: {
          count: 1,
          results: [
            {
              activity_id: 103,
              summary: "Update user group membership",
              activity_status: "undelivered",
              creation_time: activities[0].creation_time,
              completion_time: null,
              changes: [
                {
                  kind: "additional_group",
                  group_name: successfulAction === "add" ? "bin" : "daemon",
                  operation: successfulAction,
                },
              ],
            } satisfies UserActivityEvent,
          ],
        },
      });
      await user.click(screen.getByRole("button", { name: "Save changes" }));

      const failure = await screen.findByText(
        "Group and user detail changes for user1 could not be queued. Please try again.",
      );
      expect(failure).toBeInTheDocument();
      expect(
        screen.getByText("Some group changes for user user1 were queued."),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "View details" }),
      ).toBeInTheDocument();
      expect(
        within(panel).queryByRole("button", { name: "View added groups" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: "Edit user", level: 3 }),
      ).not.toBeInTheDocument();
      expect(screen.queryByRole("form")).not.toBeInTheDocument();
      expect(panel).not.toHaveTextContent("Some group changes were queued");
      expect(failure).not.toHaveTextContent("were queued");
      expect(
        screen.queryByText("An activity is queued to edit user1."),
      ).not.toBeInTheDocument();

      await openEditUserSidePanel(user);
      expect(
        await within(panel).findByRole("button", {
          name: "View activity 103: Queued",
        }),
      ).toHaveTextContent("Update user group membership: Queued");

      expect(groupRequests).toEqual(["add", "remove"]);
      expect(profileRequests).toEqual(["Updated user"]);
    },
  );

  it.each([false, true])(
    "closes the panel and clearly reports queued user details and failed groups (removals: %s)",
    async (removeGroup) => {
      const user = userEvent.setup();
      let groupRequests = 0;
      const profileRequests: string[] = [];
      server.use(
        http.put(`${API_URL}users`, async ({ request }) => {
          const body = (await request.json()) as Record<string, unknown>;
          profileRequests.push(String(body.name));
          return HttpResponse.json(activities[0]);
        }),
        http.post(
          `${API_URL}computers/:computerId/usergroups/update_bulk`,
          () => {
            groupRequests += 1;
            return HttpResponse.json(
              { message: "Adding groups failed" },
              { status: 500 },
            );
          },
        ),
      );
      setEndpointStatus({
        status: "variant",
        path: "user-groups",
        response: removeGroup
          ? userGroups.filter(({ name }) => name === "daemon")
          : [],
      });
      renderEditUserSidePanel();
      await openEditUserSidePanel(user);
      const panel = screen
        .getByRole("heading", { name: "Edit user", level: 3 })
        .closest("aside");
      assert(panel);
      await user.click(
        screen.getByRole("combobox", { name: "Additional Groups" }),
      );
      if (removeGroup) {
        const daemon = await screen.findByRole("checkbox", { name: "daemon" });
        await waitFor(() => {
          expect(daemon).toBeChecked();
        });
        await user.click(daemon);
      }
      await user.click(await screen.findByRole("checkbox", { name: "bin" }));
      await user.clear(screen.getByLabelText("Name"));
      await user.type(screen.getByLabelText("Name"), "Updated user");
      setEndpointStatus({
        status: "variant",
        path: "computers/:computerId/users/:username/pending-activities",
        response: {
          count: 1,
          results: [
            {
              activity_id: 103,
              summary: "Edit user user1",
              activity_status: "undelivered",
              creation_time: activities[0].creation_time,
              completion_time: null,
              changes: [{ kind: "profile", field: "name" }],
            } satisfies UserActivityEvent,
          ],
        },
      });
      await user.click(screen.getByRole("button", { name: "Save changes" }));

      expect(
        await screen.findByText(
          "Group changes for user user1 could not be queued. Please try again.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { name: "Edit user", level: 3 }),
      ).not.toBeInTheDocument();
      expect(screen.queryByRole("form")).not.toBeInTheDocument();
      expect(panel).not.toHaveTextContent(
        "User details were queued for update",
      );
      expect(
        screen.queryByText("An activity is queued to edit user1."),
      ).not.toBeInTheDocument();
      expect(
        screen.getByText("User details for user user1 were queued for update."),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "View details" }),
      ).toBeInTheDocument();

      await openEditUserSidePanel(user);
      expect(
        await within(panel).findByRole("button", {
          name: "View activity 103: Queued",
        }),
      ).toHaveTextContent("Edit user user1: Queued");
      expect(groupRequests).toBe(removeGroup ? 2 : 1);
      expect(profileRequests).toEqual(["Updated user"]);
    },
  );

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
