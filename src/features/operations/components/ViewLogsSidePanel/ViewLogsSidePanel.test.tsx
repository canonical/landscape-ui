import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ViewLogsSidePanel from "./ViewLogsSidePanel";
import userEvent from "@testing-library/user-event";
import { expectLoadingState } from "@/tests/helpers";
import Suspense from "@/components/layout/SidePanel/Suspense";
import LoadingState from "@/components/layout/SidePanel/LoadingState";
import { mirrors } from "@/tests/mocks/mirrors";
import type { Mirror } from "@canonical/landscape-openapi";

const COPIED_FEEDBACK_TIMEOUT = 2010;
const typedMirrors = mirrors as Mirror[];

const failedMirror = typedMirrors.find(
  (mirror) => mirror.lastOperation === "operations/ffff-llll-dddd",
);
assert(failedMirror, "Missing mock mirror with a failed operation");

const ComponentWrapper = ({
  isTestingCopy = false,
}: {
  readonly isTestingCopy?: boolean;
}) => (
  <Suspense fallback={<LoadingState />}>
    <ViewLogsSidePanel />
    {isTestingCopy && <input type="textbox" />}
  </Suspense>
);

describe("ViewLogsSidePanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state when fetching", () => {
    renderWithProviders(
      <ComponentWrapper />,
      undefined,
      `?sidePath=logs&name=${failedMirror.name}`,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders operation logs when available", async () => {
    renderWithProviders(
      <ComponentWrapper />,
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
    expect(screen.getByText(/0% \[Working\]/)).toBeInTheDocument();
  });

  it("displays actions when logs are available", async () => {
    renderWithProviders(
      <ComponentWrapper />,
      undefined,
      `?sidePath=logs&name=${failedMirror.name}`,
    );

    await expectLoadingState();

    expect(
      await screen.findByRole("button", { name: /copy/i }),
    ).toBeInTheDocument();

    const downloadLink = screen.getByRole("link", { name: /download/i });
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute(
      "download",
      `${failedMirror.name}.log`,
    );
  });

  it("Updates button content when copy button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ComponentWrapper isTestingCopy />,
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
      <ComponentWrapper />,
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

  it("shows error notification when operation has no error details", async () => {
    const noLogsMirror = typedMirrors.find(
      (mirror) => mirror.lastOperation === "operations/ssss-cccc-dddd",
    );
    assert(noLogsMirror, "Missing mock mirror with a successful operation");

    renderWithProviders(
      <ComponentWrapper />,
      undefined,
      `?sidePath=logs&name=${noLogsMirror.name}`,
    );

    await expectLoadingState();

    expect(
      await screen.findByRole("heading", {
        name: "The last update attempt for the selected mirror had no logs.",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /copy/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /download/i }),
    ).not.toBeInTheDocument();
  });

  it("handles mirrors with no lastOperation gracefully", async () => {
    const unsyncedMirror = typedMirrors.find((mirror) => !mirror.lastOperation);
    assert(unsyncedMirror, "Missing mock mirror with no lastOperation");

    renderWithProviders(
      <ComponentWrapper />,
      undefined,
      `?sidePath=logs&name=${unsyncedMirror.name}`,
    );

    await expectLoadingState();

    expect(
      await screen.findByRole("heading", {
        name: `Update logs for ${unsyncedMirror.displayName}`,
      }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", {
        name: "The selected mirror hasn't had any update attempts yet.",
      }),
    ).toBeInTheDocument();
  });
});
