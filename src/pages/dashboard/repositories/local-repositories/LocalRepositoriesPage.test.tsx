import { API_URL_DEB_ARCHIVE } from "@/constants";
import { expectLoadingState, setScreenSize } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen, within } from "@testing-library/react";
import { http } from "msw";
import { afterEach, describe, expect, it } from "vitest";
import LocalRepositoriesPage from "./LocalRepositoriesPage";
import userEvent from "@testing-library/user-event";
import { setEndpointStatus } from "@/tests/controllers/controller";

describe("LocalRepositoriesPage", () => {
  afterEach(() => {
    setEndpointStatus({ path: "locals", status: "default" });
  });

  describe("search filters", () => {
    let latestFilter: string | null | undefined;

    beforeEach(() => {
      latestFilter = undefined;
      setEndpointStatus({ path: "locals", status: "empty" });

      // Observe requests while leaving responses to the shared handler.
      server.use(
        http.get(`${API_URL_DEB_ARCHIVE}locals`, ({ request }) => {
          latestFilter = new URL(request.url).searchParams.get("filter");
        }),
      );
    });

    it.each([
      {
        search: 'Audit "quoted"',
        filter: String.raw`display_name="Audit \"quoted\"*"`,
      },
      {
        search: "Audit \\path\\",
        filter: String.raw`display_name="Audit \\path\\*"`,
      },
    ])("escapes search $search in the filter", async ({ search, filter }) => {
      renderWithProviders(
        <LocalRepositoriesPage />,
        undefined,
        `/?${new URLSearchParams({ search })}`,
      );

      expect(
        await screen.findByText(
          `No local repositories found with the search: "${search}"`,
        ),
      ).toBeInTheDocument();

      expect(latestFilter).toBe(filter);
    });

    it("keeps ordinary prefix matching and omits the filter after clearing search", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <LocalRepositoriesPage />,
        undefined,
        "/?search=Audit",
      );

      await screen.findByText(
        'No local repositories found with the search: "Audit"',
      );
      expect(latestFilter).toBe('display_name="Audit*"');

      await user.click(
        screen.getByRole("button", { name: /clear search field/i }),
      );

      expect(
        await screen.findByText("You don’t have any local repositories yet"),
      ).toBeInTheDocument();
      expect(latestFilter).toBeNull();
    });
  });

  it("renders the title and add button", async () => {
    renderWithProviders(<LocalRepositoriesPage />);

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: /local repositories/i }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("button", { name: /add local repository/i }),
    ).toBeInTheDocument();
  });

  it("renders the add form side panel when add button is clicked", async () => {
    renderWithProviders(<LocalRepositoriesPage />);

    await expectLoadingState();
    await userEvent.click(
      screen.getByRole("button", { name: "Add local repository" }),
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /add repository/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the edit form side panel when sidePath=edit is in the URL", async () => {
    renderWithProviders(
      <LocalRepositoriesPage />,
      undefined,
      "/?sidePath=edit&name=aaaa-bbbb-cccc",
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /save changes/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the view form side panel when sidePath=view is in the URL", async () => {
    setScreenSize("xxl");

    renderWithProviders(
      <LocalRepositoriesPage />,
      undefined,
      "/?sidePath=view&name=aaaa-bbbb-cccc",
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /remove/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the import packages form side panel when sidePath=import-packages is in the URL", async () => {
    renderWithProviders(
      <LocalRepositoriesPage />,
      undefined,
      "/?sidePath=import-packages&name=aaaa-bbbb-cccc",
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /import packages/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the publish form side panel when sidePath=publish is in the URL", async () => {
    renderWithProviders(
      <LocalRepositoriesPage />,
      undefined,
      "/?sidePath=publish&name=aaaa-bbbb-cccc",
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /publish repository/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the logs side panel when sidePath=logs is in the URL", async () => {
    setScreenSize("xxl");

    renderWithProviders(
      <LocalRepositoriesPage />,
      undefined,
      "/?sidePath=logs&name=cccc-dddd-eeee",
    );

    expect(
      await screen.findByRole("heading", {
        name: /Import logs for Failed import local/i,
      }),
    ).toBeInTheDocument();
    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /copy/i,
      }),
    ).toBeInTheDocument();
  });

  it("shows an error state when fetching local repository details fails", async () => {
    setEndpointStatus({ path: "locals", status: "error" });

    renderWithProviders(
      <LocalRepositoriesPage />,
      undefined,
      "/?sidePath=view&name=aaaa-bbbb-cccc",
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByText(
        "Something went wrong",
      ),
    ).toBeInTheDocument();
    expect(
      within(screen.getByLabelText("Side panel")).queryByRole("status"),
    ).not.toBeInTheDocument();
  });

  it("shows an error state when the local repository response is empty", async () => {
    renderWithProviders(
      <LocalRepositoriesPage />,
      undefined,
      "/?sidePath=view&name=badId",
    );

    const sidePanel = await screen.findByLabelText("Side panel");

    expect(
      await within(sidePanel).findByText("Something went wrong"),
    ).toBeInTheDocument();
    expect(within(sidePanel).queryByRole("status")).not.toBeInTheDocument();
  });
});
