import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import date from "@/libs/date";
import { ROUTES } from "@/libs/routes";
import { createStaffAccounts } from "@/tests/mocks/staffAccounts";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import StaffAccountsList from "./StaffAccountsList";

const staffAccounts = createStaffAccounts();

const props: ComponentProps<typeof StaffAccountsList> = { staffAccounts };

const activeAccount = staffAccounts.find(
  ({ disabled, subdomain }) => !disabled && subdomain,
);
const disabledAccount = staffAccounts.find(({ disabled }) => disabled);
const accountWithoutSubdomain = staffAccounts.find(
  ({ subdomain }) => !subdomain,
);

const getRow = (name: string) =>
  screen.getByRole("row", { name: `${name} account row` });

const getStatusCell = (name: string) =>
  within(getRow(name)).getByRole("cell", { name: "status" });

describe("StaffAccountsList", () => {
  assert(activeAccount);
  assert(disabledAccount);
  assert(accountWithoutSubdomain);

  it("renders the columns", () => {
    const { container } = renderWithProviders(<StaffAccountsList {...props} />);

    expect(container).toHaveTexts([
      "Name",
      "Title",
      "Subdomain",
      "Instances",
      "Status",
      "Created",
      "Actions",
    ]);
  });

  it("renders a row per account", () => {
    renderWithProviders(<StaffAccountsList {...props} />);

    for (const { account } of staffAccounts) {
      expect(getRow(account)).toBeInTheDocument();
    }
  });

  it("renders the account's details", () => {
    renderWithProviders(<StaffAccountsList {...props} />);

    const row = within(getRow(activeAccount.account));

    expect(row.getByRole("rowheader")).toHaveTextContent(activeAccount.account);
    expect(row.getByRole("cell", { name: "title" })).toHaveTextContent(
      activeAccount.company,
    );
    expect(row.getByRole("cell", { name: "subdomain" })).toHaveTextContent(
      String(activeAccount.subdomain),
    );
    expect(row.getByRole("cell", { name: "instances" })).toHaveTextContent(
      String(activeAccount.computers),
    );
    expect(row.getByRole("cell", { name: "status" })).toHaveTextContent(
      "Active",
    );
    expect(row.getByRole("cell", { name: "created" })).toHaveTextContent(
      date(activeAccount.creation_time).format(DISPLAY_DATE_TIME_FORMAT),
    );
  });

  it("links the name to the account's detail page", () => {
    renderWithProviders(<StaffAccountsList {...props} />);

    expect(
      screen.getByRole("link", { name: activeAccount.account }),
    ).toHaveAttribute("href", ROUTES.superAdmin.account(activeAccount.account));
  });

  it("marks a disabled account", () => {
    renderWithProviders(<StaffAccountsList {...props} />);

    expect(getStatusCell(disabledAccount.account)).toHaveTextContent(
      "Disabled",
    );
  });

  it("tells the statuses apart by icon shape, not only by colour", () => {
    renderWithProviders(<StaffAccountsList {...props} />);

    expect(
      getStatusCell(activeAccount.account).querySelector("use"),
    ).toHaveAttribute("href", expect.stringContaining("success.svg#success"));
    expect(
      getStatusCell(disabledAccount.account).querySelector("use"),
    ).toHaveAttribute("href", expect.stringContaining("error.svg#error"));
  });

  it("renders a placeholder for an account without a subdomain", () => {
    renderWithProviders(<StaffAccountsList {...props} />);

    expect(
      within(getRow(accountWithoutSubdomain.account)).getByRole("cell", {
        name: "subdomain",
      }),
    ).toHaveTextContent(NO_DATA_TEXT);
  });

  it("renders the empty message when there are no accounts", () => {
    renderWithProviders(<StaffAccountsList staffAccounts={[]} />);

    expect(
      screen.getByText(
        "No accounts found according to your search parameters.",
      ),
    ).toBeInTheDocument();
  });
});
