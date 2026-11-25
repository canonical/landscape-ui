import AppErrorBoundary from "@/components/layout/AppErrorBoundary/AppErrorBoundary";
import { API_URL } from "@/constants";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ubuntuInstance } from "@/tests/mocks/instance";
import { usnPackages, usns } from "@/tests/mocks/usn";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SupportInstanceSecurityIssues from "./SupportInstanceSecurityIssues";

const ACME = "acme";
const [firstUsn, secondUsn] = usns;
const API_PATH = new URL(API_URL, "http://localhost").pathname;

const renderTab = (routePath = "/security-issues") =>
  renderWithProviders(
    <SupportInstanceSecurityIssues name={ACME} instance={ubuntuInstance} />,
    undefined,
    routePath,
    "/security-issues",
  );

const renderTabInErrorBoundary = () =>
  renderWithProviders(
    <AppErrorBoundary>
      <SupportInstanceSecurityIssues name={ACME} instance={ubuntuInstance} />
    </AppErrorBoundary>,
    undefined,
    "/security-issues",
    "/security-issues",
  );

/** Records every request the tab sends while `run` is awaited. */
const captureRequests = async (run: () => Promise<void>) => {
  const requests: Request[] = [];
  const capture = ({ request }: { request: Request }) => {
    requests.push(request.clone());
  };

  server.events.on("request:start", capture);

  try {
    await run();
  } finally {
    server.events.removeListener("request:start", capture);
  }

  return requests;
};

// Axios may send an array as `computer_ids` or `computer_ids[]`.
const getComputerIds = (url: URL) =>
  [...url.searchParams]
    .filter(([key]) => key.startsWith("computer_ids"))
    .map(([, value]) => value);

describe("SupportInstanceSecurityIssues (integration)", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setStaffGlobalRoles(["SupportProvider"]);
  });

  afterEach(() => {
    setEndpointStatus("default");
  });

  it("shows the same security issues the account's tab shows for the instance", async () => {
    renderTab();

    for (const column of [
      "USN",
      "CVE(s)",
      "Date published",
      "Affected packages",
    ]) {
      expect(
        await screen.findByRole("columnheader", { name: column }),
      ).toBeInTheDocument();
    }

    for (const { usn } of usns.slice(0, DEFAULT_PAGE_SIZE)) {
      expect(screen.getByRole("link", { name: usn })).toHaveAttribute(
        "href",
        expect.stringContaining(usn),
      );
    }

    expect(
      screen.getByText(`Showing ${DEFAULT_PAGE_SIZE} of ${usns.length}`, {
        exact: false,
      }),
    ).toBeInTheDocument();
  });

  it("reads the instance's security issues from the account in the address", async () => {
    const requests = await captureRequests(async () => {
      renderTab();
      await screen.findByRole("link", { name: firstUsn.usn });
    });

    const urls = requests.map(({ url }) => new URL(url));
    const listUrl = urls.find(
      ({ pathname }) => pathname === `${API_PATH}accounts/${ACME}/usns`,
    );

    assert(listUrl);
    expect(getComputerIds(listUrl)).toEqual([String(ubuntuInstance.id)]);
    expect(listUrl.searchParams.get("limit")).toBe(String(DEFAULT_PAGE_SIZE));
    expect(listUrl.searchParams.get("offset")).toBe("0");
    expect(listUrl.searchParams.get("show_packages")).toBe("false");
    expect(urls.map(({ pathname }) => pathname)).not.toContain(
      `${API_PATH}usns`,
    );
  });

  it("narrows the list by the search term", async () => {
    renderTab();

    await screen.findByRole("link", { name: secondUsn.usn });

    await user.type(screen.getByRole("searchbox"), `${firstUsn.usn}{enter}`);

    expect(
      await screen.findByRole("link", { name: firstUsn.usn }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: secondUsn.usn }),
    ).not.toBeInTheDocument();
  });

  it("shows the empty message for a search that matches nothing", async () => {
    renderTab("/security-issues?search=no-such-usn");

    expect(
      await screen.findByText(
        'No security issues found with the search "no-such-usn"',
      ),
    ).toBeInTheDocument();
  });

  it("requests the next page when pagination advances", async () => {
    const nextUsn = usns[DEFAULT_PAGE_SIZE];
    assert(nextUsn);

    renderTab();

    await screen.findByRole("link", { name: firstUsn.usn });

    const requests = await captureRequests(async () => {
      await user.click(screen.getByRole("button", { name: "Next page" }));
      await screen.findByRole("link", { name: nextUsn.usn });
    });

    expect(
      requests.map(({ url }) => new URL(url).searchParams.get("offset")),
    ).toContain(String(DEFAULT_PAGE_SIZE));
    expect(
      screen.queryByRole("link", { name: firstUsn.usn }),
    ).not.toBeInTheDocument();
  });

  it("shows the packages a security issue affects on the instance", async () => {
    const [firstPackage, secondPackage] = usnPackages;
    assert(firstPackage && secondPackage);

    renderTab();

    await screen.findByRole("link", { name: firstUsn.usn });

    const requests = await captureRequests(async () => {
      const [showPackages] = screen.getAllByRole("button", {
        name: "Show packages",
      });
      assert(showPackages);
      await user.click(showPackages);
      await screen.findByText(firstPackage.name);
    });

    expect(screen.getByText(secondPackage.name)).toBeInTheDocument();
    expect(
      screen.getByText(firstUsn.usn, { selector: "b" }),
    ).toBeInTheDocument();

    const packagesUrl = requests
      .map(({ url }) => new URL(url))
      .find(
        ({ pathname }) =>
          pathname === `${API_PATH}accounts/${ACME}/usns/${firstUsn.usn}`,
      );
    assert(packagesUrl);
    expect(getComputerIds(packagesUrl)).toEqual([String(ubuntuInstance.id)]);

    await user.click(screen.getByRole("button", { name: "Hide packages" }));

    expect(screen.queryByText(firstPackage.name)).not.toBeInTheDocument();
  });

  it("shows a failed packages request in the row and keeps the list", async () => {
    setEndpointStatus({ status: "error", path: "usns/:usnName" });

    renderTabInErrorBoundary();

    await screen.findByRole("link", { name: firstUsn.usn });

    const [showPackages] = screen.getAllByRole("button", {
      name: "Show packages",
    });
    assert(showPackages);
    await user.click(showPackages);

    const title = await screen.findByText(
      "Could not load the affected packages",
    );
    const notification = title.closest(".p-notification--negative");
    assert(notification instanceof HTMLElement);

    expect(
      within(notification).getByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: secondUsn.usn }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
  });

  it("offers no upgrade, removal or selection and reaches no mutation", async () => {
    const requests = await captureRequests(async () => {
      renderTab();

      await screen.findByRole("link", { name: firstUsn.usn });

      const [showPackages] = screen.getAllByRole("button", {
        name: "Show packages",
      });
      assert(showPackages);
      await user.click(showPackages);
      await screen.findByText(usnPackages[0]?.name ?? "");
    });

    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    for (const action of [/upgrade/i, /remove/i, /uninstall/i, /select all/i]) {
      expect(
        screen.queryByRole("button", { name: action }),
      ).not.toBeInTheDocument();
    }
    expect(requests.filter(({ method }) => method !== "GET")).toEqual([]);
  });

  it("shows the empty state, without actions, when the instance has no security issues", async () => {
    setEndpointStatus({ status: "empty", path: "usns" });

    renderTab();

    const title = await screen.findByText("No security issues found");
    const emptyState = title.parentElement;
    assert(emptyState);

    expect(within(emptyState).queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });

  it("keeps the search while the security issues load", async () => {
    setEndpointStatus({ status: "loading", path: "usns" });

    renderTab();

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("fails into the error boundary when the security issues fail to load", async () => {
    vi.spyOn(console, "error").mockReturnValue(undefined);
    setEndpointStatus({ status: "error", path: "usns" });

    renderTabInErrorBoundary();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Something went wrong",
    );
  });

  it("fails into the error boundary when the caller lacks staff read access", async () => {
    vi.spyOn(console, "error").mockReturnValue(undefined);
    setStaffGlobalRoles([]);

    renderTabInErrorBoundary();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Something went wrong",
    );
    expect(
      screen.queryByText("No security issues found"),
    ).not.toBeInTheDocument();
  });
});
