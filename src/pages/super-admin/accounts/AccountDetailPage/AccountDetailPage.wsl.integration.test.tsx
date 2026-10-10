import { API_URL } from "@/constants";
import type { WslFeatureLimits } from "@/features/super-admin";
import { PATHS, ROUTES } from "@/libs/routes";
import { authResponse } from "@/tests/mocks/auth";
import { defaultWslFeatureLimits } from "@/tests/mocks/staffAccounts";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import AccountDetailPage from "./AccountDetailPage";

const NEW_HOST_LIMIT = 250;

const HOSTS_LABEL = "Windows host machines";
const INSTANCES_LABEL = "WSL instances per host";
const PROFILES_LABEL = "WSL instance profiles";

const ROUTE_PATTERN = `/${PATHS.superAdmin.root}/${PATHS.superAdmin.account}`;

/** Signs in a staff member with `globalRoles`, for the app and for the mock API. */
const signInAs = (globalRoles: string[]) => {
  setStaffGlobalRoles(globalRoles);
  server.use(
    http.get(`${API_URL}me`, () =>
      HttpResponse.json({ ...authResponse, global_roles: globalRoles }),
    ),
  );
};

const renderWslLimits = (name: string) =>
  renderWithProviders(
    <AccountDetailPage />,
    undefined,
    ROUTES.superAdmin.account(name, { tab: "wsl" }),
    ROUTE_PATTERN,
  );

/** Records the body of every WSL limits POST, then lets the mock API handle it. */
const recordPosts = (name: string): unknown[] => {
  const bodies: unknown[] = [];

  server.use(
    http.post(
      `${API_URL}accounts/${name}/wsl-feature-limits`,
      async ({ request }) => {
        bodies.push(await request.clone().json());
      },
    ),
  );

  return bodies;
};

/** The value shown for the limit labelled `label` on the tab. */
const findLimit = async (label: string) => {
  const item = (await screen.findByText(label)).parentElement;

  assert(item);

  return within(item);
};

describe("AccountDetailPage: WSL limits (integration)", () => {
  const user = userEvent.setup();

  const openEditForm = async () => {
    await user.click(await screen.findByRole("button", { name: "Edit" }));

    await screen.findByLabelText(HOSTS_LABEL);
  };

  const fillField = async (label: string, value: string) => {
    const field = screen.getByLabelText(label);

    await user.clear(field);

    if (value) {
      await user.type(field, value);
    }
  };

  /** Submits the form; does not confirm. */
  const submitForm = async () => {
    await user.click(screen.getByRole("button", { name: "Save changes" }));
  };

  /** Submits the form and confirms the changes in the dialog. */
  const saveChanges = async () => {
    await submitForm();

    const dialog = within(await screen.findByRole("dialog"));

    await user.click(dialog.getByRole("button", { name: "Save changes" }));
  };

  const expectFormClosed = async () => {
    await waitFor(() => {
      expect(screen.queryByLabelText(HOSTS_LABEL)).not.toBeInTheDocument();
    });
  };

  beforeEach(() => {
    signInAs(["AccountManager"]);
  });

  it("shows the defaults for an account without limits of its own", async () => {
    renderWslLimits("acme");

    expect(await screen.findByRole("tab", { name: "WSL" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    const hosts = await findLimit(HOSTS_LABEL);
    const instances = await findLimit(INSTANCES_LABEL);
    const profiles = await findLimit(PROFILES_LABEL);

    expect(hosts.getByText("1,000")).toBeInTheDocument();
    expect(instances.getByText("10")).toBeInTheDocument();
    expect(profiles.getByText("100")).toBeInTheDocument();
  });

  it("shows the limits of an account that has its own", async () => {
    const limits: WslFeatureLimits = {
      max_windows_host_machines: 4,
      max_wsl_child_instances_per_host: 3,
      max_wsl_child_instance_profiles: 2,
    };

    server.use(
      http.get(`${API_URL}accounts/acme/wsl-feature-limits`, () =>
        HttpResponse.json(limits),
      ),
    );

    renderWslLimits("acme");

    const hosts = await findLimit(HOSTS_LABEL);
    const instances = await findLimit(INSTANCES_LABEL);
    const profiles = await findLimit(PROFILES_LABEL);

    expect(hosts.getByText("4")).toBeInTheDocument();
    expect(instances.getByText("3")).toBeInTheDocument();
    expect(profiles.getByText("2")).toBeInTheDocument();
  });

  it("reports a failed request", async () => {
    server.use(
      http.get(`${API_URL}accounts/acme/wsl-feature-limits`, () =>
        HttpResponse.json(
          { error: "InternalServerError", message: "Server error" },
          { status: 500 },
        ),
      ),
    );

    renderWslLimits("acme");

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });

  it("hides Edit from read-tier staff", async () => {
    signInAs(["SupportProvider"]);

    renderWslLimits("acme");

    await findLimit(HOSTS_LABEL);

    expect(
      screen.queryByRole("button", { name: "Edit" }),
    ).not.toBeInTheDocument();
  });

  it("opens the form with the current limits", async () => {
    renderWslLimits("acme");

    await openEditForm();

    expect(
      screen.getByRole("heading", { name: "Edit the WSL limits of ACME Corp" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(HOSTS_LABEL)).toHaveValue(
      defaultWslFeatureLimits.max_windows_host_machines,
    );
    expect(screen.getByLabelText(INSTANCES_LABEL)).toHaveValue(
      defaultWslFeatureLimits.max_wsl_child_instances_per_host,
    );
    expect(screen.getByLabelText(PROFILES_LABEL)).toHaveValue(
      defaultWslFeatureLimits.max_wsl_child_instance_profiles,
    );
  });

  it("requires every limit to be a whole number of 0 or more", async () => {
    const posts = recordPosts("acme");

    renderWslLimits("acme");

    await openEditForm();
    await fillField(HOSTS_LABEL, "");
    await fillField(INSTANCES_LABEL, "1.5");
    await fillField(PROFILES_LABEL, "-1");
    await submitForm();

    expect(
      await screen.findByText("This field is required."),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter a whole number.")).toBeInTheDocument();
    expect(screen.getByText("Enter 0 or more.")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(posts).toEqual([]);
  });

  it("closes without saving when nothing changed", async () => {
    const posts = recordPosts("acme");

    renderWslLimits("acme");

    await openEditForm();
    await submitForm();

    await expectFormClosed();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(posts).toEqual([]);
  });

  it("asks for confirmation, listing only the changed limits", async () => {
    const posts = recordPosts("acme");

    renderWslLimits("acme");

    await openEditForm();
    await fillField(HOSTS_LABEL, String(NEW_HOST_LIMIT));
    await submitForm();

    const dialog = within(await screen.findByRole("dialog"));

    expect(
      dialog.getByRole("heading", {
        name: "Change the WSL limits of ACME Corp",
      }),
    ).toBeInTheDocument();
    expect(
      dialog.getByText(`${HOSTS_LABEL}: 1,000 →`, { exact: false }),
    ).toBeInTheDocument();
    expect(dialog.getByText(String(NEW_HOST_LIMIT))).toBeInTheDocument();
    expect(dialog.queryByText(INSTANCES_LABEL, { exact: false })).toBeNull();
    expect(dialog.queryByText(PROFILES_LABEL, { exact: false })).toBeNull();
    expect(posts).toEqual([]);
  });

  it("changes nothing when the confirmation is cancelled", async () => {
    const posts = recordPosts("acme");

    renderWslLimits("acme");

    await openEditForm();
    await fillField(HOSTS_LABEL, String(NEW_HOST_LIMIT));
    await submitForm();

    const dialog = within(await screen.findByRole("dialog"));

    await user.click(dialog.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText(HOSTS_LABEL)).toHaveValue(NEW_HOST_LIMIT);
    expect(posts).toEqual([]);
  });

  it("posts all three limits and shows the saved ones", async () => {
    const posts = recordPosts("acme");

    renderWslLimits("acme");

    await openEditForm();
    await fillField(HOSTS_LABEL, String(NEW_HOST_LIMIT));
    await saveChanges();

    await waitFor(() => {
      expect(posts).toEqual([
        {
          ...defaultWslFeatureLimits,
          max_windows_host_machines: NEW_HOST_LIMIT,
        },
      ]);
    });
    await expectFormClosed();

    const hosts = await findLimit(HOSTS_LABEL);

    expect(await hosts.findByText(String(NEW_HOST_LIMIT))).toBeInTheDocument();
    expect(
      await screen.findByText("WSL limits have been saved"),
    ).toBeInTheDocument();
  });

  it("shows the saved limits without trusting a refetch", async () => {
    // A GET straight after the first write has returned the old defaults
    // on the real server; the POST response is what the view must show.
    let gets = 0;

    server.use(
      http.get(`${API_URL}accounts/acme/wsl-feature-limits`, () => {
        gets += 1;

        return HttpResponse.json(defaultWslFeatureLimits);
      }),
    );

    renderWslLimits("acme");

    await openEditForm();
    await fillField(HOSTS_LABEL, String(NEW_HOST_LIMIT));
    await saveChanges();
    await expectFormClosed();

    const hosts = await findLimit(HOSTS_LABEL);

    expect(await hosts.findByText(String(NEW_HOST_LIMIT))).toBeInTheDocument();
    expect(gets).toBe(1);
  });

  it("shows a validation error from the server on its field", async () => {
    server.use(
      http.post(`${API_URL}accounts/acme/wsl-feature-limits`, () =>
        HttpResponse.json(
          {
            error: "PydanticValidationError",
            message: "invalid query/body arguments",
            detail: [
              {
                type: "int_type",
                loc: ["body", "max_windows_host_machines"],
                msg: "Input should be a valid integer",
              },
            ],
          },
          { status: 400 },
        ),
      ),
    );

    renderWslLimits("acme");

    await openEditForm();
    await fillField(HOSTS_LABEL, String(NEW_HOST_LIMIT));
    await saveChanges();

    expect(
      await screen.findByText("Input should be a valid integer"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(HOSTS_LABEL)).toBeInTheDocument();
  });
});
