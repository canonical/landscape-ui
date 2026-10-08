import { API_URL, DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import type { StaffPersonResult } from "@/features/super-admin";
import date from "@/libs/date";
import { PATHS, ROUTES } from "@/libs/routes";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { Route, Routes } from "react-router";
import { beforeEach, describe, expect, it } from "vitest";
import PeoplePage from "./PeoplePage";

const PAGE_SIZE = 20;
const MANY_PEOPLE_COUNT = 45;
const SUPER_ADMIN = `/${PATHS.superAdmin.root}`;

/** The mock API's zone-less timestamps are UTC; shown in the local zone. */
const formatUtc = (iso: string) => date(iso).format(DISPLAY_DATE_TIME_FORMAT);

const manyPeople: StaffPersonResult[] = Array.from(
  { length: MANY_PEOPLE_COUNT },
  (_, index) => {
    const number = String(index + 1).padStart(2, "0");

    return {
      type: "person",
      id: index + 1,
      name: `Person ${number}`,
      email: `person-${number}@example.com`,
      identity: null,
      last_login_time: null,
      accounts: [],
      pending_invitations: [],
    };
  },
);

/** Records the query of every people search, then lets the mock API handle it. */
const recordSearches = (): URLSearchParams[] => {
  const queries: URLSearchParams[] = [];

  server.use(
    http.get(`${API_URL}people`, ({ request }) => {
      queries.push(new URL(request.url).searchParams);
    }),
  );

  return queries;
};

/** Serves `manyPeople` page by page and returns the queries it was asked. */
const serveManyPeople = (): URLSearchParams[] => {
  const queries: URLSearchParams[] = [];

  server.use(
    http.get(`${API_URL}people`, ({ request }) => {
      const { searchParams } = new URL(request.url);
      const limit = Number(searchParams.get("limit"));
      const offset = Number(searchParams.get("offset"));

      queries.push(searchParams);

      return HttpResponse.json({
        count: manyPeople.length,
        next: null,
        previous: null,
        results: manyPeople.slice(offset, offset + limit),
      });
    }),
  );

  return queries;
};

/** The people page among the super admin routes, with stand-ins for where it leads. */
const renderPeople = (initialPath = ROUTES.superAdmin.people()) =>
  renderWithProviders(
    <>
      <Routes>
        <Route path={SUPER_ADMIN}>
          <Route path={PATHS.superAdmin.people} element={<PeoplePage />} />
          <Route
            path={PATHS.superAdmin.account}
            element={<h1>Account detail page</h1>}
          />
          <Route
            path={`${PATHS.superAdmin.session}/*`}
            element={<h1>Support session</h1>}
          />
        </Route>
      </Routes>
      <LocationDisplay />
    </>,
    undefined,
    initialPath,
  );

const search = async (text: string) => {
  const user = userEvent.setup();

  await user.clear(screen.getByRole("searchbox"));
  await user.type(screen.getByRole("searchbox"), `${text}{Enter}`);
};

const getUserRows = () => screen.getAllByRole("row", { name: /user row$/ });

const getInvitationRows = () =>
  screen.getAllByRole("row", { name: /invitation row$/ });

/** Jane Doe's rows: the SSO one with accounts first, the duplicate one second. */
const findJaneRows = async () => {
  const [withAccounts, duplicate] = await screen.findAllByRole("row", {
    name: "Jane Doe user row",
  });

  assert(withAccounts);
  assert(duplicate);

  return { withAccounts: within(withAccounts), duplicate: within(duplicate) };
};

describe("PeoplePage (integration)", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setStaffGlobalRoles(["SupportProvider"]);
  });

  it("asks for a search instead of requesting anything under 3 characters", async () => {
    const queries = recordSearches();

    renderPeople();

    expect(
      screen.getByText("Search for a user or a pending invitation"),
    ).toBeInTheDocument();

    await search("ja");

    expect(
      screen.getByText("Search for a user or a pending invitation"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(queries).toHaveLength(0);
  });

  it("renders people and invitations that match in one list", async () => {
    renderPeople();

    await search("jane");

    const { withAccounts, duplicate } = await findJaneRows();

    expect(getUserRows()).toHaveLength(2);
    expect(getInvitationRows()).toHaveLength(2);

    expect(withAccounts.getByText("SSO")).toBeInTheDocument();
    expect(
      withAccounts.getByText(formatUtc("2026-09-01T08:12:44Z")),
    ).toBeInTheDocument();
    expect(withAccounts.getByRole("link", { name: "acme" })).toHaveAttribute(
      "href",
      ROUTES.superAdmin.account("acme"),
    );
    expect(
      withAccounts.getByRole("link", { name: "jane-free-1" }),
    ).toBeInTheDocument();
    expect(withAccounts.getByRole("link", { name: "globex" })).toHaveAttribute(
      "href",
      ROUTES.superAdmin.account("globex"),
    );
    expect(withAccounts.getByText("(invited)")).toBeInTheDocument();

    expect(duplicate.getByText("No SSO login yet")).toBeInTheDocument();
    expect(duplicate.getAllByRole("link")).toHaveLength(1);
    expect(duplicate.getByRole("link", { name: "globex" })).toBeInTheDocument();

    const [invitation] = getInvitationRows();

    assert(invitation);
    expect(within(invitation).getByLabelText("status")).toHaveTextContent(
      `Invited ${formatUtc("2026-08-30T15:00:00Z")}`,
    );
    expect(
      within(invitation).getByRole("link", { name: "acme" }),
    ).toHaveAttribute("href", ROUTES.superAdmin.account("acme"));
  });

  it("marks duplicate emails and people without accounts", async () => {
    renderPeople();

    await search("jane");

    const { withAccounts, duplicate } = await findJaneRows();

    expect(withAccounts.getByText("Duplicate")).toBeInTheDocument();
    expect(
      withAccounts.getByTitle("Another user on this page has the same email"),
    ).toBeInTheDocument();
    expect(withAccounts.queryByText("No accounts")).not.toBeInTheDocument();
    expect(duplicate.getByText("Duplicate")).toBeInTheDocument();
    expect(duplicate.getByText("No accounts")).toBeInTheDocument();

    await search("milton");

    const [milton] = await screen.findAllByRole("row", {
      name: "Milton Waddams user row",
    });

    assert(milton);
    expect(within(milton).getByText("No accounts")).toBeInTheDocument();
    expect(within(milton).queryByText("Duplicate")).not.toBeInTheDocument();
  });

  it("refetches with the type filter", async () => {
    const queries = recordSearches();

    renderPeople();

    await search("jane");
    await findJaneRows();

    await user.click(screen.getByRole("button", { name: "Type" }));
    await user.click(screen.getByRole("button", { name: "Invitations" }));

    await waitFor(() => {
      expect(screen.queryAllByRole("row", { name: /user row$/ })).toHaveLength(
        0,
      );
    });
    expect(getInvitationRows()).toHaveLength(2);
    expect(screen.getByText("Type: Invitations")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Type" }));
    await user.click(screen.getByRole("button", { name: "Users" }));

    await waitFor(() => {
      expect(
        screen.queryAllByRole("row", { name: /invitation row$/ }),
      ).toHaveLength(0);
    });
    expect(getUserRows()).toHaveLength(2);

    expect(queries.map((query) => query.get("type"))).toEqual([
      null,
      "invitation",
      "person",
    ]);
  });

  it("opens an account's detail page from its chip", async () => {
    renderPeople();

    await search("jane");

    const { withAccounts } = await findJaneRows();

    await user.click(withAccounts.getByRole("link", { name: "jane-free-1" }));

    expect(
      await screen.findByRole("heading", { name: "Account detail page" }),
    ).toBeInTheDocument();
  });

  it("opens one of a person's accounts in a support session from the row actions", async () => {
    renderPeople();

    await search("jane");

    const { withAccounts } = await findJaneRows();

    await user.click(
      withAccounts.getByRole("button", { name: "Jane Doe actions" }),
    );
    expect(
      screen.getAllByRole("menuitem").map((item) => item.textContent),
    ).toEqual(["Enter acme", "Enter jane-free-1", "Enter globex"]);

    await user.click(
      screen.getByRole("menuitem", { name: "Enter jane-free-1" }),
    );

    expect(
      await screen.findByRole("heading", { name: "Support session" }),
    ).toBeInTheDocument();
    expect(getLocationDisplay()).toHaveTextContent(
      ROUTES.superAdmin.session("jane-free-1"),
    );
  });

  it("offers the account that invited a person without accounts", async () => {
    renderPeople();

    await search("jane");

    const { duplicate } = await findJaneRows();

    await user.click(
      duplicate.getByRole("button", { name: "Jane Doe actions" }),
    );

    expect(
      screen.getAllByRole("menuitem").map((item) => item.textContent),
    ).toEqual(["Enter globex"]);
  });

  it("offers no actions for a person without accounts or invitations", async () => {
    renderPeople();

    await search("milton");

    const [milton] = await screen.findAllByRole("row", {
      name: "Milton Waddams user row",
    });

    assert(milton);
    expect(
      within(milton).queryByRole("button", { name: "Milton Waddams actions" }),
    ).not.toBeInTheDocument();
  });

  it("shows the empty message when nothing matches", async () => {
    renderPeople();

    await search("no-such-person");

    expect(
      await screen.findByText(
        "No users or invitations found according to your search parameters.",
      ),
    ).toBeInTheDocument();
  });

  it("requests the next page from the server", async () => {
    const queries = serveManyPeople();

    renderPeople(`${ROUTES.superAdmin.people()}?search=person`);

    expect(
      await screen.findByRole("row", { name: "Person 01 user row" }),
    ).toBeInTheDocument();
    expect(getUserRows()).toHaveLength(PAGE_SIZE);
    expect(
      screen.getByText(`Showing ${PAGE_SIZE} of`, { exact: false }),
    ).toHaveTextContent(`Showing ${PAGE_SIZE} of ${MANY_PEOPLE_COUNT} results`);

    await user.click(screen.getByRole("button", { name: "Next page" }));

    expect(
      await screen.findByRole("row", { name: "Person 21 user row" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("row", { name: "Person 01 user row" }),
    ).not.toBeInTheDocument();

    expect(
      queries.map((query) => [
        query.get("search"),
        query.get("limit"),
        query.get("offset"),
      ]),
    ).toEqual([
      ["person", String(PAGE_SIZE), "0"],
      ["person", String(PAGE_SIZE), String(PAGE_SIZE)],
    ]);
  });

  it("shows the error state when the request fails", async () => {
    server.use(
      http.get(`${API_URL}people`, () =>
        HttpResponse.json(
          { error: "InternalServerError", message: "Server error" },
          { status: 500 },
        ),
      ),
    );

    renderPeople(`${ROUTES.superAdmin.people()}?search=jane`);

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
  });
});
