import { API_URL } from "@/constants";
import { PATHS, ROUTES } from "@/libs/routes";
import { authResponse } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AccountDetailPage from "./AccountDetailPage";

// Super admin mode only exists on SaaS; the deployment mode is not under
// test here.
vi.mock("@/hooks/useEnv", () => import("@/tests/mocks/env"));

const KB = 1024;
const MB = KB * KB;

// What the mock "acme" account starts with, and what the tests change it to.
const ACME_ADMINISTRATOR_LIMIT = 10;
const ACME_ATTACHMENT_SIZE_MB = 1;
const NEW_ADMINISTRATOR_LIMIT = 25;
const NEW_ATTACHMENT_SIZE_MB = 2;
const NEW_ATTACHMENT_SIZE_KB = 512;

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

const renderAccount = (name: string) =>
  renderWithProviders(
    <AccountDetailPage />,
    undefined,
    ROUTES.superAdmin.account(name),
    ROUTE_PATTERN,
  );

/** Records the body of every account PATCH, then lets the mock API handle it. */
const recordPatches = (name: string): unknown[] => {
  const bodies: unknown[] = [];

  server.use(
    http.patch(`${API_URL}accounts/${name}`, async ({ request }) => {
      bodies.push(await request.clone().json());
    }),
  );

  return bodies;
};

const findSection = async (title: string) => {
  const heading = await screen.findByRole("heading", { name: title });
  const section = heading.closest("section");

  assert(section);

  return within(section);
};

describe("AccountDetailPage: editing the account (integration)", () => {
  const user = userEvent.setup();

  const openEditForm = async () => {
    await user.click(await screen.findByRole("button", { name: "Edit" }));

    await screen.findByLabelText("Subdomain");
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
      expect(screen.queryByLabelText("Subdomain")).not.toBeInTheDocument();
    });
  };

  beforeEach(() => {
    signInAs(["AccountManager"]);
  });

  it("shows the limits and the Salesforce key on the Info tab", async () => {
    renderAccount("acme");

    const limits = await findSection("Limits");

    expect(limits.getByText("10")).toBeInTheDocument();
    expect(limits.getByText("1 MB")).toBeInTheDocument();

    const details = await findSection("Account details");

    expect(details.getByText("1-001A1B2C3D4E5F0")).toBeInTheDocument();
  });

  it("hides Edit from read-tier staff", async () => {
    signInAs(["SupportProvider"]);

    renderAccount("acme");

    await findSection("Limits");

    expect(
      screen.queryByRole("button", { name: "Edit" }),
    ).not.toBeInTheDocument();
  });

  it("opens the form with the account's values", async () => {
    renderAccount("acme");

    await openEditForm();

    expect(
      screen.getByRole("heading", { name: "Edit ACME Corp" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Subdomain")).toHaveValue("acme");
    expect(screen.getByLabelText("Salesforce account key")).toHaveValue(
      "1-001A1B2C3D4E5F0",
    );
    expect(screen.getByLabelText("Administrator limit")).toHaveValue(
      ACME_ADMINISTRATOR_LIMIT,
    );
    expect(screen.getByLabelText("Attachment size limit")).toHaveValue(
      ACME_ATTACHMENT_SIZE_MB,
    );
    expect(screen.getByLabelText("Attachment size unit")).toHaveValue("MB");
  });

  it.each(["0", "101"])(
    "rejects an administrator limit of %s before sending anything",
    async (value) => {
      const patches = recordPatches("acme");

      renderAccount("acme");

      await openEditForm();
      await fillField("Administrator limit", value);
      await submitForm();

      expect(
        await screen.findByText("Enter a number from 1 to 100."),
      ).toBeInTheDocument();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(patches).toEqual([]);
    },
  );

  it("sends the attachment size limit in bytes for the chosen unit", async () => {
    const patches = recordPatches("acme");

    renderAccount("acme");

    await openEditForm();
    await user.selectOptions(
      screen.getByLabelText("Attachment size unit"),
      "KB",
    );
    await fillField("Attachment size limit", String(NEW_ATTACHMENT_SIZE_KB));
    await saveChanges();

    await waitFor(() => {
      expect(patches).toEqual([
        { max_attachment_size: NEW_ATTACHMENT_SIZE_KB * KB },
      ]);
    });

    const limits = await findSection("Limits");

    expect(await limits.findByText("512 KB")).toBeInTheDocument();
  });

  it("rejects an attachment size limit that is not a whole number of bytes", async () => {
    const patches = recordPatches("acme");

    renderAccount("acme");

    await openEditForm();
    await user.selectOptions(
      screen.getByLabelText("Attachment size unit"),
      "KB",
    );
    await fillField("Attachment size limit", "0.3");
    await submitForm();

    expect(
      await screen.findByText("Enter a size that is a whole number of bytes."),
    ).toBeInTheDocument();
    expect(patches).toEqual([]);
  });

  it("rejects a negative attachment size limit before sending anything", async () => {
    const patches = recordPatches("acme");

    renderAccount("acme");

    await openEditForm();
    await fillField("Attachment size limit", "-1");
    await submitForm();

    expect(await screen.findByText("Enter 0 or more.")).toBeInTheDocument();
    expect(patches).toEqual([]);
  });

  it.each([
    ["a", /must be 2 to 63 characters long/],
    ["a".repeat(64), /must be 2 to 63 characters long/],
    ["Acme", /Use lowercase letters, digits and hyphens/],
    ["-acme", /Use lowercase letters, digits and hyphens/],
    ["acme-", /Use lowercase letters, digits and hyphens/],
    ["1acme", /Use lowercase letters, digits and hyphens/],
    ["acme..saas", /Use lowercase letters, digits and hyphens/],
    ["saas", /The subdomain cannot be "landscape" or "saas"/],
  ])(
    "rejects the subdomain %s before sending anything",
    async (subdomain, message) => {
      const patches = recordPatches("acme");

      renderAccount("acme");

      await openEditForm();
      await fillField("Subdomain", subdomain);
      await submitForm();

      expect(await screen.findByText(message)).toBeInTheDocument();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(patches).toEqual([]);
    },
  );

  it("accepts a dot-separated subdomain", async () => {
    const patches = recordPatches("acme");

    renderAccount("acme");

    await openEditForm();
    await fillField("Subdomain", "tenant.acme-1");
    await saveChanges();

    await waitFor(() => {
      expect(patches).toEqual([{ subdomain: "tenant.acme-1" }]);
    });
  });

  it("asks for confirmation, then sends only the fields that changed", async () => {
    const patches = recordPatches("acme");

    renderAccount("acme");

    await openEditForm();
    await fillField("Administrator limit", String(NEW_ADMINISTRATOR_LIMIT));
    await fillField("Attachment size limit", String(NEW_ATTACHMENT_SIZE_MB));
    await submitForm();

    const dialog = within(await screen.findByRole("dialog"));

    expect(
      dialog.getByRole("heading", { name: "Change ACME Corp" }),
    ).toBeInTheDocument();
    expect(dialog.getByText(/Administrator limit: 10/)).toHaveTextContent(
      "Administrator limit: 10 → 25",
    );
    expect(dialog.getByText(/Attachment size limit:/)).toHaveTextContent(
      "Attachment size limit: 1 MB → 2 MB",
    );
    expect(patches).toEqual([]);

    await user.click(dialog.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(patches).toEqual([
        {
          max_people_count: NEW_ADMINISTRATOR_LIMIT,
          max_attachment_size: NEW_ATTACHMENT_SIZE_MB * MB,
        },
      ]);
    });
    await expectFormClosed();

    const limits = await findSection("Limits");

    expect(await limits.findByText("25")).toBeInTheDocument();
    expect(limits.getByText("2 MB")).toBeInTheDocument();
  });

  it("sends nothing when the confirmation is cancelled", async () => {
    const patches = recordPatches("acme");

    renderAccount("acme");

    await openEditForm();
    await fillField("Administrator limit", String(NEW_ADMINISTRATOR_LIMIT));
    await submitForm();

    const dialog = within(await screen.findByRole("dialog"));

    await user.click(dialog.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(patches).toEqual([]);
    expect(screen.getByLabelText("Administrator limit")).toHaveValue(
      NEW_ADMINISTRATOR_LIMIT,
    );
  });

  it("closes without sending anything when nothing changed", async () => {
    const patches = recordPatches("acme");

    renderAccount("acme");

    await openEditForm();
    await submitForm();

    await expectFormClosed();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(patches).toEqual([]);
  });

  it("clears the subdomain and the Salesforce key with null", async () => {
    const patches = recordPatches("acme");

    renderAccount("acme");

    await openEditForm();
    await fillField("Subdomain", "");
    await fillField("Salesforce account key", "");
    await saveChanges();

    await waitFor(() => {
      expect(patches).toEqual([
        { subdomain: null, salesforce_account_key: null },
      ]);
    });
    await expectFormClosed();
  });

  it("shows a rejected Salesforce key next to its field", async () => {
    renderAccount("acme");

    await openEditForm();
    await fillField("Salesforce account key", "not-a-key");
    await saveChanges();

    expect(
      await screen.findByText(/Salesforce account keys must be 17 or 20/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Salesforce account key")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText("Salesforce account key")).toHaveValue(
      "not-a-key",
    );
  });

  it("shows a subdomain that is already taken next to its field", async () => {
    renderAccount("globex");

    await openEditForm();
    await fillField("Subdomain", "acme");
    await saveChanges();

    expect(
      await screen.findByText(
        "Subdomains must be unique across accounts; 'acme' already set on 'acme'",
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Subdomain")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("shows a server validation error next to the field it names", async () => {
    server.use(
      http.patch(`${API_URL}accounts/acme`, () =>
        HttpResponse.json(
          {
            error: "PydanticValidationError",
            message: "invalid query/body arguments",
            detail: [
              {
                type: "less_than_equal",
                loc: ["max_people_count"],
                msg: "Input should be less than or equal to 50",
              },
            ],
          },
          { status: 400 },
        ),
      ),
    );

    renderAccount("acme");

    await openEditForm();
    await fillField("Administrator limit", "60");
    await saveChanges();

    expect(
      await screen.findByText("Input should be less than or equal to 50"),
    ).toBeInTheDocument();
  });
});
