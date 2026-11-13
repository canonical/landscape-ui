import { API_URL_DEB_ARCHIVE } from "@/constants";
import { expectLoadingState, setScreenSize } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen, within } from "@testing-library/react";
import { http } from "msw";
import { describe, expect, it } from "vitest";
import PublicationTargetsPage from "./PublicationTargetsPage";
import userEvent from "@testing-library/user-event";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { DEBARCHIVE_DOCUMENTATION_URL } from "@/features/repositories";

describe("PublicationTargetsPage", () => {
  afterEach(() => {
    setEndpointStatus([
      { status: "default", path: "publicationTargets" },
      { status: "default", path: "publicationTargets/get" },
    ]);
  });

  describe("search filters", () => {
    let latestFilter: string | null | undefined;

    beforeEach(() => {
      latestFilter = undefined;
      setEndpointStatus({ path: "publicationTargets", status: "empty" });

      // Observe requests while leaving responses to the shared handler.
      server.use(
        http.get(`${API_URL_DEB_ARCHIVE}publicationTargets`, ({ request }) => {
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
        <PublicationTargetsPage />,
        undefined,
        `/?${new URLSearchParams({ search })}`,
      );

      expect(
        await screen.findByText(
          `No publication targets found with the search: "${search}"`,
        ),
      ).toBeInTheDocument();

      expect(latestFilter).toBe(filter);
    });

    it("keeps ordinary prefix matching and omits the filter after clearing search", async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <PublicationTargetsPage />,
        undefined,
        "/?search=Audit",
      );

      await screen.findByText(
        'No publication targets found with the search: "Audit"',
      );
      expect(latestFilter).toBe('display_name="Audit*"');

      await user.click(
        screen.getByRole("button", { name: /clear search field/i }),
      );

      expect(
        await screen.findByText("You don’t have any publication targets yet"),
      ).toBeInTheDocument();
      expect(latestFilter).toBeNull();
    });
  });

  it("renders the page title", () => {
    renderWithProviders(<PublicationTargetsPage />);

    expect(
      screen.getByRole("heading", { name: /publication targets/i }),
    ).toBeInTheDocument();
  });

  it("renders the Add publication target button", async () => {
    renderWithProviders(<PublicationTargetsPage />);

    expect(
      await screen.findByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
  });

  it("renders empty state when there are no publication targets", async () => {
    setEndpointStatus({ status: "empty", path: "publicationTargets" });

    renderWithProviders(<PublicationTargetsPage />);

    expect(
      await screen.findByText("You don’t have any publication targets yet"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /learn more about repository mirroring/i,
      }),
    ).toHaveAttribute("href", DEBARCHIVE_DOCUMENTATION_URL);

    expect(
      screen.getByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
  });

  it("renders the add form side panel when add button is clicked", async () => {
    renderWithProviders(<PublicationTargetsPage />);

    await expectLoadingState();
    await userEvent.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /add publication target/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the edit form side panel when sidePath=edit is in the URL", async () => {
    renderWithProviders(
      <PublicationTargetsPage />,
      undefined,
      "/?sidePath=edit&name=aaaaaaaa-0000-0000-0000-000000000001",
    );

    await expectLoadingState();

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /save changes/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the view form side panel when sidePath=view is in the URL", async () => {
    setScreenSize("xxl");

    renderWithProviders(
      <PublicationTargetsPage />,
      undefined,
      "/?sidePath=view&name=aaaaaaaa-0000-0000-0000-000000000001",
    );

    await expectLoadingState();

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /remove/i,
      }),
    ).toBeInTheDocument();
  });

  it("shows an error state when fetching a publication target fails", async () => {
    setEndpointStatus({ status: "error", path: "publicationTargets/get" });

    renderWithProviders(
      <PublicationTargetsPage />,
      undefined,
      "/?sidePath=view&name=aaaaaaaa-0000-0000-0000-000000000001",
    );

    await screen.findByRole("button", { name: /add publication target/i });

    const sidePanel = await screen.findByLabelText("Side panel");

    expect(
      await within(sidePanel).findByText("Something went wrong"),
    ).toBeInTheDocument();
    expect(within(sidePanel).queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows an error state when fetching a publication target for edit fails", async () => {
    setEndpointStatus({ status: "error", path: "publicationTargets/get" });

    renderWithProviders(
      <PublicationTargetsPage />,
      undefined,
      "/?sidePath=edit&name=aaaaaaaa-0000-0000-0000-000000000001",
    );

    await screen.findByRole("button", { name: /add publication target/i });

    const sidePanel = await screen.findByLabelText("Side panel");

    expect(
      await within(sidePanel).findByText("Something went wrong"),
    ).toBeInTheDocument();
    expect(within(sidePanel).queryByRole("status")).not.toBeInTheDocument();
  });
});
