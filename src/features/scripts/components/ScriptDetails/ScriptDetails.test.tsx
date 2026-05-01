import { expectLoadingState } from "@/tests/helpers";
import { detailedScriptsData } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, it } from "vitest";
import { setEndpointStatus } from "@/tests/controllers/controller";
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

const notExecutableScriptId = detailedScriptsData.find(
  (script) => script.status === "ACTIVE" && !script.is_executable,
)?.id;

const notRedactableScriptId = detailedScriptsData.find(
  (script) => script.status === "ACTIVE" && !script.is_redactable,
)?.id;

describe("ScriptDetails", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setEndpointStatus("default");
  });

  assert(archivedScriptId);
  assert(activeScriptId);
  assert(redactedScriptId);
  assert(notExecutableScriptId);
  assert(notRedactableScriptId);

  it("should display details for an active script", async () => {
    const { container } = renderWithProviders(
      <ScriptDetails scriptId={activeScriptId} />,
    );

    await expectLoadingState();

    const buttons = ["Edit", "Run", "Archive", "Delete"];
    expect(container).toHaveTexts(buttons);
  });

  it("should disable the Run button when the script is not executable", async () => {
    renderWithProviders(<ScriptDetails scriptId={notExecutableScriptId} />);

    await expectLoadingState();

    const runButton = screen.getByRole("button", { name: /run/i });
    expect(runButton).toHaveAttribute("aria-disabled", "true");
  });

  it("should disable the Delete button when the script is not redactable", async () => {
    renderWithProviders(<ScriptDetails scriptId={notRedactableScriptId} />);

    await expectLoadingState();

    const deleteButton = screen.getByRole("button", {
      name: /delete new v2 script/i,
    });
    expect(deleteButton).toHaveAttribute("aria-disabled", "true");
  });

  it("opens delete confirmation modal when clicking Delete button", async () => {
    renderWithProviders(<ScriptDetails scriptId={activeScriptId} />);

    await expectLoadingState();

    const deleteButton = screen.getByRole("button", {
      name: /delete new v2 script/i,
    });
    await user.click(deleteButton);

    const modalBody = screen.getByText(
      /deleting the script will remove the contents from Landscape/i,
    );
    expect(modalBody).toBeInTheDocument();
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

  it("opens the edit script form when clicking Edit button", async () => {
    renderWithProviders(<ScriptDetails scriptId={activeScriptId} />);

    await expectLoadingState();

    const editButton = screen.getByRole("button", { name: /^edit$/i });
    await user.click(editButton);

    expect(await screen.findByLabelText(/^title$/i)).toBeInTheDocument();
  });

  it("opens the run script form when clicking Run button", async () => {
    renderWithProviders(<ScriptDetails scriptId={activeScriptId} />);

    await expectLoadingState();

    const runButton = screen.getByRole("button", { name: /^run$/i });
    await user.click(runButton);

    expect(
      await screen.findByText(/run as user/i, {}, { timeout: 3000 }),
    ).toBeInTheDocument();
  });

  it("should navigate back from edit form to script details", async () => {
    renderWithProviders(<ScriptDetails scriptId={activeScriptId} />);

    await expectLoadingState();

    const editButton = screen.getByRole("button", { name: /^edit$/i });
    await user.click(editButton);

    expect(await screen.findByLabelText(/^title$/i)).toBeInTheDocument();

    const backButton = screen.getByRole("button", { name: /^back$/i });
    await user.click(backButton);

    await waitFor(() => {
      expect(screen.queryByLabelText(/^title$/i)).not.toBeInTheDocument();
    });
  });

  it("should navigate back from version history details", async () => {
    renderWithProviders(
      <ScriptDetails
        scriptId={activeScriptId}
        initialTabId="version-history"
      />,
    );

    const versionButton = await screen.findByRole("button", { name: "1" });
    await user.click(versionButton);

    const useAsNewVersionButton = await screen.findByRole("button", {
      name: /use as new version/i,
    });
    expect(useAsNewVersionButton).toBeInTheDocument();

    const backButton = screen.getByRole("button", { name: /back/i });
    await user.click(backButton);

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /use as new version/i }),
      ).not.toBeInTheDocument();
    });
  });
});
