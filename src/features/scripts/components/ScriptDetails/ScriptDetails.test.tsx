import { expectLoadingState } from "@/tests/helpers";
import { detailedScriptsData } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import ScriptDetails from "./ScriptDetails";

const archivedScriptId = detailedScriptsData.find(
  (script) => script.status === "ARCHIVED",
)?.id;

const activeScriptId = detailedScriptsData.find(
  (script) => script.status === "ACTIVE",
)?.id;

const redactedScriptId = detailedScriptsData.find(
  (script) => script.status === "REDACTED",
)?.id;

describe("ScriptDetails", () => {
  const user = userEvent.setup();

  assert(archivedScriptId);
  assert(activeScriptId);
  assert(redactedScriptId);

  it("should display details for an active script", async () => {
    const { container } = renderWithProviders(
      <ScriptDetails scriptId={activeScriptId} />,
    );

    await expectLoadingState();

    const buttons = ["Edit", "Archive"];
    expect(container).toHaveTexts(buttons);
  });

  it("should display details for an archived script", async () => {
    renderWithProviders(<ScriptDetails scriptId={archivedScriptId} />);

    await expectLoadingState();

    const editButton = screen.queryByRole("button", {
      name: /edit/i,
    });

    expect(editButton).not.toBeInTheDocument();

    const archiveNotification = screen.getByText(/the script was archived by/i);
    expect(archiveNotification).toBeInTheDocument();
  });

  it("should display details for a redacted script", async () => {
    renderWithProviders(<ScriptDetails scriptId={redactedScriptId} />);

    await expectLoadingState();

    const editButton = screen.queryByRole("button", {
      name: /edit/i,
    });

    expect(editButton).not.toBeInTheDocument();

    const redactedNotification = screen.getByText(/the script was deleted by/i);
    expect(redactedNotification).toBeInTheDocument();

    const tabs = screen.queryAllByRole("tab");
    expect(tabs).toHaveLength(0);
  });

  it("opens modal when clicking on Archive button", async () => {
    renderWithProviders(<ScriptDetails scriptId={activeScriptId} />);

    await expectLoadingState();

    const archiveButton = screen.getByRole("button", {
      name: /archive/i,
    });

    await user.click(archiveButton);

    const modalTitle = screen.getByText(
      /archiving the script will prevent it from running in the future./i,
    );
    expect(modalTitle).toBeInTheDocument();
  });
});
