import { API_URL } from "@/constants";
import type { StaffAccountListItem } from "@/features/super-admin";
import { createStaffAccounts } from "@/tests/mocks/staffAccounts";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import AccountsPage from "./AccountsPage";

const PAGE_SIZE = 20;
const MANY_ACCOUNTS_COUNT = 45;

const manyAccounts: StaffAccountListItem[] = Array.from(
  { length: MANY_ACCOUNTS_COUNT },
  (_, index) => {
    const number = String(index + 1).padStart(2, "0");

    return {
      account: `account-${number}`,
      company: `Account ${number}`,
      subdomain: null,
      disabled: false,
      computers: index,
      creation_time: "2025-01-01T00:00:00Z",
      salesforce_account_key: null,
      enabled_features: [],
      lds_enabled: false,
    };
  },
);

/** Serves `manyAccounts` page by page and returns the queries it was asked. */
const serveManyAccounts = (): URLSearchParams[] => {
  const queries: URLSearchParams[] = [];

  server.use(
    http.get(`${API_URL}accounts`, ({ request }) => {
      const { searchParams } = new URL(request.url);
      const limit = Number(searchParams.get("limit"));
      const offset = Number(searchParams.get("offset"));

      queries.push(searchParams);

      return HttpResponse.json({
        count: manyAccounts.length,
        next: null,
        previous: null,
        results: manyAccounts.slice(offset, offset + limit),
      });
    }),
  );

  return queries;
};

const getAccountRows = () =>
  screen.getAllByRole("row", { name: /account row/ });

describe("AccountsPage (integration)", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setStaffGlobalRoles(["SupportProvider"]);
  });

  it("renders a row for every account", async () => {
    const staffAccounts = createStaffAccounts();

    renderWithProviders(<AccountsPage />);

    expect(
      screen.getByRole("heading", { name: "Accounts" }),
    ).toBeInTheDocument();

    for (const { account } of staffAccounts) {
      expect(
        await screen.findByRole("row", { name: `${account} account row` }),
      ).toBeInTheDocument();
    }

    expect(
      screen.getByText(`Showing ${staffAccounts.length} of`, { exact: false }),
    ).toHaveTextContent(
      `Showing ${staffAccounts.length} of ${staffAccounts.length} results`,
    );
  });

  it("refetches with the search text", async () => {
    renderWithProviders(<AccountsPage />);

    await screen.findByRole("row", { name: "acme account row" });

    await user.type(screen.getByRole("searchbox"), "globex{Enter}");

    await waitFor(() => {
      expect(getAccountRows()).toHaveLength(1);
    });
    expect(
      screen.getByRole("row", { name: "globex account row" }),
    ).toBeInTheDocument();
  });

  it("matches what the server matches, not only the columns shown", async () => {
    renderWithProviders(<AccountsPage />);

    await screen.findByRole("row", { name: "acme account row" });

    // An administrator's name: not a column, so only the server can match it.
    await user.type(screen.getByRole("searchbox"), "Lumbergh{Enter}");

    await waitFor(() => {
      expect(getAccountRows()).toHaveLength(1);
    });
    expect(
      screen.getByRole("row", { name: "initech account row" }),
    ).toBeInTheDocument();
  });

  it("shows the empty message when nothing matches", async () => {
    renderWithProviders(<AccountsPage />);

    await screen.findByRole("row", { name: "acme account row" });

    await user.type(screen.getByRole("searchbox"), "no-such-account{Enter}");

    expect(
      await screen.findByText(
        "No accounts found according to your search parameters.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the error state, not an empty list, when the request fails", async () => {
    server.use(
      http.get(`${API_URL}accounts`, () =>
        HttpResponse.json(
          { error: "InternalServerError", message: "Server error" },
          { status: 500 },
        ),
      ),
    );

    renderWithProviders(<AccountsPage />);

    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.queryByText(
        "No accounts found according to your search parameters.",
      ),
    ).not.toBeInTheDocument();
  });

  it("requests the next page from the server", async () => {
    const queries = serveManyAccounts();

    renderWithProviders(<AccountsPage />);

    expect(
      await screen.findByRole("row", { name: "account-01 account row" }),
    ).toBeInTheDocument();
    expect(getAccountRows()).toHaveLength(PAGE_SIZE);
    expect(
      screen.getByText(`Showing ${PAGE_SIZE} of`, { exact: false }),
    ).toHaveTextContent(
      `Showing ${PAGE_SIZE} of ${MANY_ACCOUNTS_COUNT} results`,
    );

    await user.click(screen.getByRole("button", { name: "Next page" }));

    expect(
      await screen.findByRole("row", { name: "account-21 account row" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("row", { name: "account-01 account row" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next page" }));

    expect(
      await screen.findByRole("row", { name: "account-41 account row" }),
    ).toBeInTheDocument();
    expect(getAccountRows()).toHaveLength(MANY_ACCOUNTS_COUNT - 2 * PAGE_SIZE);
    expect(screen.getByRole("button", { name: "Next page" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    expect(
      queries.map((query) => [query.get("limit"), query.get("offset")]),
    ).toEqual([
      [String(PAGE_SIZE), "0"],
      [String(PAGE_SIZE), String(PAGE_SIZE)],
      [String(PAGE_SIZE), String(2 * PAGE_SIZE)],
    ]);
  });

  it("returns to the first page when searching", async () => {
    const queries = serveManyAccounts();

    renderWithProviders(<AccountsPage />);

    await screen.findByRole("row", { name: "account-01 account row" });
    await user.click(screen.getByRole("button", { name: "Next page" }));
    await screen.findByRole("row", { name: "account-21 account row" });

    await user.type(screen.getByRole("searchbox"), "account{Enter}");

    await waitFor(() => {
      expect(queries.at(-1)?.get("search")).toBe("account");
    });
    expect(queries.at(-1)?.get("offset")).toBe("0");
  });
});
