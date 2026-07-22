import { API_URL_DEB_ARCHIVE } from "@/constants";
import server from "@/tests/server";
import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import { Suspense } from "react";
import SidePanel from "@/components/layout/SidePanel";
import ImportRepositoryPackagesSidePanel from "./ImportRepositoryPackagesSidePanel";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { repositories } from "@/tests/mocks/localRepositories";
import { expectLoadingState } from "@/tests/helpers";
import { http, HttpResponse } from "msw";

const renderComponent = () =>
  renderWithProviders(
    <Suspense fallback={<SidePanel.LoadingState />}>
      <ImportRepositoryPackagesSidePanel />
    </Suspense>,
    undefined,
    `/?name=${repositories[0].localId}`,
  );

describe("ImportRepositoryPackagesSidePanel", () => {
  const user = userEvent.setup();

  it("renders the header, input, and buttons", async () => {
    renderComponent();

    await expectLoadingState();

    expect(
      await screen.findByText(
        `Import packages to ${repositories[0].displayName}`,
      ),
    ).toBeInTheDocument();

    expect(await screen.findByLabelText(/source url/i)).toBeInTheDocument();

    const fetchButton = await screen.findByRole("button", {
      name: /fetch packages/i,
    });
    expect(fetchButton).toHaveAttribute("aria-disabled", "true");

    const importButton = await screen.findByRole("button", {
      name: /import packages/i,
    });
    expect(importButton).not.toHaveAttribute("aria-disabled", "true");
  });

  it("enables Fetch packages button when source URL is provided", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "https://example.com/packages");

    const button = screen.getByRole("button", { name: /fetch packages/i });
    expect(button).not.toHaveAttribute("aria-disabled", "true");
  });

  it("shows validation result with packages after successful fetch", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "https://example.com/succeeded");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    await waitFor(() => {
      expect(screen.getByText(/packages to import/i)).toBeInTheDocument();
    });

    const importButton = screen.getByRole("button", {
      name: /import 2 packages/i,
    });
    expect(importButton).not.toHaveAttribute("aria-disabled", "true");
  });

  it("shows caution notification when validation times out", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "https://example.com/timeout");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    await waitFor(() => {
      expect(
        screen.getByText(/fetching packages timed out/i),
      ).toBeInTheDocument();
    });

    const importButton = screen.getByRole("button", {
      name: /import packages/i,
    });
    expect(importButton).not.toHaveAttribute("aria-disabled", "true");
  });

  it("allows import after validation times out", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "https://example.com/timeout");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    await waitFor(() => {
      expect(
        screen.getByText(/fetching packages timed out/i),
      ).toBeInTheDocument();
    });

    const importButton = screen.getByRole("button", {
      name: /import packages/i,
    });
    expect(importButton).not.toHaveAttribute("aria-disabled", "true");

    await user.click(importButton);
    expect(
      await screen.findByText(/you have marked .* to import packages/i),
    ).toBeInTheDocument();
  });

  it("shows error notification when validation fails and blocks submission", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "https://example.com/failed");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    await waitFor(() => {
      expect(
        screen.getByText(/the operation failed unexpectedly/i),
      ).toBeInTheDocument();
    });

    const importButton = screen.getByRole("button", {
      name: /import packages/i,
    });
    expect(importButton).toHaveAttribute("aria-disabled", "true");
  });

  it("blocks submission when no packages are available", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "https://example.com/empty");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    const importButton = screen.getByRole("button", {
      name: /import packages/i,
    });
    await waitFor(() => {
      expect(importButton).toHaveAttribute("aria-disabled", "true");
    });

    // Verify clicking Import doesn't submit when no packages are available.
    await user.click(importButton);
    expect(
      screen.queryByText(/you have marked .* to import packages/i),
    ).not.toBeInTheDocument();
  });

  it("submits the form and shows success notification", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "https://example.com/succeeded");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    await waitFor(() => {
      expect(screen.getByText(/packages to import/i)).toBeInTheDocument();
    });

    const importButton = screen.getByRole("button", {
      name: /import 2 packages/i,
    });
    await user.click(importButton);

    await waitFor(() => {
      expect(
        screen.getByText(/you have marked .* to import packages/i),
      ).toBeInTheDocument();
    });
  });

  it("shows validation error when clicking Import with invalid URL without submitting form", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "not a url");

    const importButton = screen.getByRole("button", {
      name: /import packages/i,
    });
    await user.click(importButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument();
    });

    // Verify form was not submitted (no success notification)
    expect(
      screen.queryByText(/you have marked .* to import packages/i),
    ).not.toBeInTheDocument();
  });

  it("enables Import button when source URL becomes valid", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "not a url");

    let importButton = screen.getByRole("button", {
      name: /import packages/i,
    });
    expect(importButton).not.toHaveAttribute("aria-disabled", "true");

    // Clear and type valid URL
    await user.clear(input);
    await user.type(input, "https://example.com/packages");

    importButton = screen.getByRole("button", {
      name: /import packages/i,
    });
    expect(importButton).not.toHaveAttribute("aria-disabled", "true");
  });

  it("shows validation error when source URL is touched and left empty", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.click(input);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    });
  });

  it("accepts local file URLs as a valid source", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "file:///home/packages");

    const importButton = screen.getByRole("button", {
      name: /import packages/i,
    });
    await user.click(importButton);

    await waitFor(() => {
      expect(
        screen.getByText(/you have marked .* to import packages/i),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/please enter a valid url/i),
    ).not.toBeInTheDocument();
  });

  it("does not submit when Enter is pressed in Source URL input", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "https://example.com/succeeded");
    await user.keyboard("{Enter}");

    expect(screen.queryByText(/packages to import/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/you have marked .* to import packages/i),
    ).not.toBeInTheDocument();
  });

  it("shows debug notification when fetch validation request fails", async () => {
    server.use(
      http.post(
        `${API_URL_DEB_ARCHIVE}locals/:repository\\:importPackages`,
        async ({ request }) => {
          const body = (await request.json()) as { validateOnly?: boolean };
          if (body.validateOnly) {
            return HttpResponse.json(
              { message: "validate failed" },
              { status: 500 },
            );
          }
          return HttpResponse.json({ name: "operations/ssss-cccc-dddd" });
        },
      ),
    );

    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "https://example.com/succeeded");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    await waitFor(() => {
      expect(screen.getByText(/validate failed/i)).toBeInTheDocument();
    });
  });

  it("shows debug notification when import submit request fails", async () => {
    server.use(
      http.post(
        `${API_URL_DEB_ARCHIVE}locals/:repository\\:importPackages`,
        () => HttpResponse.json({ message: "import failed" }, { status: 500 }),
      ),
    );

    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "https://example.com/succeeded");

    const importButton = screen.getByRole("button", {
      name: /import packages/i,
    });
    await user.click(importButton);

    await waitFor(() => {
      expect(screen.getByText(/import failed/i)).toBeInTheDocument();
    });
  });

  it("allows import submission while validation is still in progress", async () => {
    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "https://example.com/in/progress");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    const importButton = screen.getByRole("button", {
      name: /import packages/i,
    });
    expect(importButton).not.toHaveAttribute("aria-disabled", "true");

    await user.click(importButton);

    await waitFor(() => {
      expect(
        screen.getByText(/you have marked .* to import packages/i),
      ).toBeInTheDocument();
    });
  });

  it("uses fallback values when operation omits done and status", async () => {
    server.use(
      http.post(
        `${API_URL_DEB_ARCHIVE}locals/:repository\\:importPackages`,
        async ({ request }) => {
          const body = (await request.json()) as { validateOnly?: boolean };
          if (body.validateOnly) {
            return HttpResponse.json({ name: "operations/fallback-state" });
          }
          return HttpResponse.json({ name: "operations/ssss-cccc-dddd" });
        },
      ),
      http.get(`${API_URL_DEB_ARCHIVE}operations/fallback-state`, () =>
        HttpResponse.json({
          metadata: {
            operationId: "fallback-state",
          },
          response: {
            output:
              "Would add: package1-0.2.1\nTotal packages that would be added: 1\n",
          },
        }),
      ),
    );

    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "https://example.com/succeeded");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /import 1 package/i }),
      ).not.toHaveAttribute("aria-disabled", "true");
    });

    expect(screen.queryByText(/packages to import/i)).not.toBeInTheDocument();
  });

  it("keeps fetch button in loading state when status falls back to idle", async () => {
    server.use(
      http.post(
        `${API_URL_DEB_ARCHIVE}locals/:repository\\:importPackages`,
        async ({ request }) => {
          const body = (await request.json()) as { validateOnly?: boolean };
          if (body.validateOnly) {
            return HttpResponse.json({ name: "operations/idle-fallback" });
          }
          return HttpResponse.json({ name: "operations/ssss-cccc-dddd" });
        },
      ),
      http.get(`${API_URL_DEB_ARCHIVE}operations/idle-fallback`, () =>
        HttpResponse.json({
          done: false,
          response: { output: "" },
        }),
      ),
    );

    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "https://example.com/succeeded");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /fetch packages/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("handles missing operation name from validate response", async () => {
    server.use(
      http.post(
        `${API_URL_DEB_ARCHIVE}locals/:repository\\:importPackages`,
        async ({ request }) => {
          const body = (await request.json()) as { validateOnly?: boolean };
          if (body.validateOnly) {
            return HttpResponse.json({});
          }

          return HttpResponse.json({ name: "operations/ssss-cccc-dddd" });
        },
      ),
    );

    renderComponent();

    const input = await screen.findByLabelText(/source url/i);
    await user.type(input, "https://example.com/succeeded");

    const fetchButton = screen.getByRole("button", { name: /fetch packages/i });
    await user.click(fetchButton);

    await waitFor(() => {
      expect(screen.queryByText(/packages to import/i)).not.toBeInTheDocument();
    });

    const importButton = screen.getByRole("button", {
      name: /import packages/i,
    });
    await user.click(importButton);

    await waitFor(() => {
      expect(
        screen.getByText(/you have marked .* to import packages/i),
      ).toBeInTheDocument();
    });
  });
});
