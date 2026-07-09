import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ViewLogsSidePanel from "./ViewLogsSidePanel";
import userEvent from "@testing-library/user-event";
import { expectLoadingState } from "@/tests/helpers";
import Suspense from "@/components/layout/SidePanel/Suspense";
import LoadingState from "@/components/layout/SidePanel/LoadingState";
import { mirrors } from "@/tests/mocks/mirrors";
import type { Local, Mirror, Publication } from "@canonical/landscape-openapi";
import { publications } from "@/tests/mocks/publications";
import { repositories } from "@/tests/mocks/localRepositories";

const COPIED_FEEDBACK_TIMEOUT = 2010;
const typedMirrors = mirrors as Mirror[];
const locals = repositories as Local[];

const failedMirror = typedMirrors.find(
  (mirror) => mirror.lastOperation === "operations/mirror-ffff-llll-dddd",
);
assert(failedMirror, "Missing mock mirror with a failed operation");

const failedLocal = locals.find(
  (local) => local.lastOperation === "operations/ffff-llll-dddd",
);
assert(failedLocal, "Missing mock local with a failed operation");

describe("ViewLogsSidePanel", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading state when fetching", () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewLogsSidePanel resourceType="mirrors" />
      </Suspense>,
      undefined,
      `?sidePath=logs&name=${failedMirror.name}`,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders operation logs when available", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewLogsSidePanel resourceType="locals" />
      </Suspense>,
      undefined,
      `?sidePath=logs&name=${failedLocal.localId}`,
    );

    await expectLoadingState();

    expect(
      await screen.findByRole("heading", {
        name: `Import logs for ${failedLocal.displayName}`,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "Output" })).toBeInTheDocument();
    expect(screen.getByText(/0% \[Working\]/)).toBeInTheDocument();
  });

  it("renders fallback if operation failed with no logs", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewLogsSidePanel resourceType="mirrors" />
      </Suspense>,
      undefined,
      `?sidePath=logs&name=${failedMirror.name}`,
    );

    await expectLoadingState();

    expect(
      await screen.findByRole("heading", {
        name: `Update logs for ${failedMirror.displayName}`,
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "Output" })).toBeInTheDocument();
    expect(screen.getByText("Task failed with no logs")).toBeInTheDocument();
  });

  it("displays actions when logs are available", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewLogsSidePanel resourceType="mirrors" />
      </Suspense>,
      undefined,
      `?sidePath=logs&name=${failedMirror.name}`,
    );

    await expectLoadingState();

    expect(
      await screen.findByRole("button", { name: /copy/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /download/i }),
    ).toBeInTheDocument();
  });

  it("downloads the logs file when download button is clicked", async () => {
    const user = userEvent.setup();

    const anchorClick = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => undefined);

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewLogsSidePanel resourceType="mirrors" />
      </Suspense>,
      undefined,
      `?sidePath=logs&name=${failedMirror.name}`,
    );

    await expectLoadingState();

    const createElementSpy = vi.spyOn(document, "createElement");

    await user.click(await screen.findByRole("button", { name: /download/i }));

    const anchor = createElementSpy.mock.results.find(
      (result) => result.value instanceof HTMLAnchorElement,
    )?.value as HTMLAnchorElement;

    expect(anchor).toBeDefined();
    expect(anchor.download).toBe(
      "Third-party-mirror_mirror-ffff-llll-dddd.log",
    );
    expect(anchorClick).toHaveBeenCalledOnce();
  });

  it("updates button content when copy button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewLogsSidePanel resourceType="mirrors" />
      </Suspense>,
      undefined,
      `?sidePath=logs&name=${failedMirror.name}`,
    );

    await expectLoadingState();

    const copyButton = await screen.findByRole("button", { name: /copy/i });
    await user.click(copyButton);
    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();

    await waitFor(
      () => {
        expect(
          screen.getByRole("button", { name: /copy/i }),
        ).toBeInTheDocument();
      },
      { timeout: COPIED_FEEDBACK_TIMEOUT },
    );
  });

  it("doesn't change copy button when clipboard write fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(
      new Error("Clipboard denied"),
    );

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewLogsSidePanel resourceType="mirrors" />
      </Suspense>,
      undefined,
      `?sidePath=logs&name=${failedMirror.name}`,
    );

    await expectLoadingState();

    const copyButton = await screen.findByRole("button", { name: /copy/i });
    await user.click(copyButton);
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /copied/i }),
    ).not.toBeInTheDocument();
  });

  it("shows empty state when operation has no error details", async () => {
    const noLogsPublication = (publications as Publication[]).find(
      (pub) => pub.lastOperation === "operations/ssss-cccc-dddd",
    );
    assert(
      noLogsPublication,
      "Missing mock publication with a successful operation",
    );

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewLogsSidePanel resourceType="publications" />
      </Suspense>,
      undefined,
      `?sidePath=logs&name=${noLogsPublication.publicationId}`,
    );

    await expectLoadingState();

    expect(
      await screen.findByRole("heading", {
        name: `Publication logs for ${noLogsPublication.displayName}`,
      }),
    ).toBeInTheDocument();

    expect(await screen.findByText("Logs not found")).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /copy/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /download/i }),
    ).not.toBeInTheDocument();
  });

  it("handles mirrors with no lastOperation gracefully", async () => {
    const unsyncedMirror = typedMirrors.find((mirror) => !mirror.lastOperation);
    assert(unsyncedMirror, "Missing mock mirror with no lastOperation");

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <ViewLogsSidePanel resourceType="mirrors" />
      </Suspense>,
      undefined,
      `?sidePath=logs&name=${unsyncedMirror.name}`,
    );

    expect(await screen.findByText("Logs not found")).toBeInTheDocument();
  });
});
