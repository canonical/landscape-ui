import { scripts } from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ScriptListActions from "./ScriptListActions";

const activeScript = scripts.find((script) => script.status === "ACTIVE");
const archivedScript = scripts.find((script) => script.status === "ARCHIVED");
const redactedScript = scripts.find((script) => script.status === "REDACTED");

const nonExecutableActiveScript = scripts.find(
  (script) => script.status === "ACTIVE" && !script.is_executable,
);
const nonEditableActiveScript = scripts.find(
  (script) => script.status === "ACTIVE" && !script.is_editable,
);
const nonRedactableActiveScript = scripts.find(
  (script) => script.status === "ACTIVE" && !script.is_redactable,
);
const activeScriptWithProfiles = scripts.find(
  (script) =>
    script.status === "ACTIVE" &&
    script.script_profiles.length > 0 &&
    script.is_redactable,
);
const activeScriptWithNoProfiles = scripts.find(
  (script) =>
    script.status === "ACTIVE" &&
    script.script_profiles.length === 0 &&
    script.is_redactable,
);
const archivedScriptWithProfiles = scripts.find(
  (script) =>
    script.status === "ACTIVE" &&
    script.script_profiles.length > 0 &&
    script.is_editable,
);
const archivedScriptWithNoProfiles = scripts.find(
  (script) =>
    script.status === "ACTIVE" &&
    script.script_profiles.length === 0 &&
    script.is_editable,
);

describe("Scripts List Contextual Menu", () => {
  const user = userEvent.setup();

  assert(activeScript);
  assert(archivedScript);
  assert(redactedScript);
  assert(nonExecutableActiveScript);
  assert(nonEditableActiveScript);
  assert(nonRedactableActiveScript);
  assert(activeScriptWithProfiles);
  assert(activeScriptWithNoProfiles);
  assert(archivedScriptWithProfiles);
  assert(archivedScriptWithNoProfiles);

  describe("contextual menu buttons", async () => {
    it("should render the contextual menu for any script", async () => {
      renderWithProviders(<ScriptListActions script={activeScript} />);
      const contextualMenuButton = screen.getByRole("button", {
        name: `${activeScript.title} actions`,
      });

      expect(contextualMenuButton).toBeInTheDocument();
      expect(contextualMenuButton).toHaveAttribute("aria-expanded", "false");

      await user.click(contextualMenuButton);
      expect(contextualMenuButton).toHaveAttribute("aria-expanded", "true");

      expect(
        screen.getByRole("button", {
          name: `View details for ${activeScript.title} script`,
        }),
      ).toBeInTheDocument();
    });

    it("should render the contextual menu for an active script", async () => {
      renderWithProviders(<ScriptListActions script={activeScript} />);
      const contextualMenuButton = screen.getByRole("button", {
        name: `${activeScript.title} actions`,
      });

      await user.click(contextualMenuButton);

      expect(
        screen.getByRole("button", {
          name: `Edit ${activeScript.title} script`,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: `Archive ${activeScript.title} script`,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: `Delete ${activeScript.title} script`,
        }),
      ).toBeInTheDocument();
    });

    it("should render the contextual menu for an archived script", async () => {
      renderWithProviders(<ScriptListActions script={archivedScript} />);
      const contextualMenuButton = screen.getByRole("button", {
        name: `${archivedScript.title} actions`,
      });

      await user.click(contextualMenuButton);

      expect(
        screen.queryByRole("button", {
          name: `Edit ${archivedScript.title} script`,
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", {
          name: `Archive ${archivedScript.title} script`,
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", {
          name: `Delete ${archivedScript.title} script`,
        }),
      ).toBeInTheDocument();
    });

    it("should render the contextual menu for a redacted script", async () => {
      renderWithProviders(<ScriptListActions script={redactedScript} />);
      const contextualMenuButton = screen.getByRole("button", {
        name: `${redactedScript.title} actions`,
      });

      await user.click(contextualMenuButton);

      expect(
        screen.queryByRole("button", {
          name: `Edit ${redactedScript.title} script`,
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", {
          name: `Archive ${redactedScript.title} script`,
        }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", {
          name: `Delete ${redactedScript.title} script`,
        }),
      ).not.toBeInTheDocument();
    });

    it("should render the contextual menu for a non-executable script", async () => {
      renderWithProviders(
        <ScriptListActions script={nonExecutableActiveScript} />,
      );
      const contextualMenuButton = screen.getByRole("button", {
        name: `${nonExecutableActiveScript.title} actions`,
      });

      await user.click(contextualMenuButton);

      const runButton = screen.queryByRole("button", {
        name: `Run ${nonExecutableActiveScript.title} script`,
      });

      expect(runButton).toBeInTheDocument();
      expect(runButton).toHaveAttribute("aria-disabled", "true");
    });

    it("should render the contextual menu for a non-editable script", async () => {
      renderWithProviders(
        <ScriptListActions script={nonEditableActiveScript} />,
      );
      const contextualMenuButton = screen.getByRole("button", {
        name: `${nonEditableActiveScript.title} actions`,
      });

      await user.click(contextualMenuButton);

      const editButton = screen.queryByRole("button", {
        name: `Edit ${nonEditableActiveScript.title} script`,
      });

      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveAttribute("aria-disabled", "true");
    });

    it("should render the contextual menu for a non-redactable script", async () => {
      renderWithProviders(
        <ScriptListActions script={nonRedactableActiveScript} />,
      );
      const contextualMenuButton = screen.getByRole("button", {
        name: `${nonRedactableActiveScript.title} actions`,
      });

      await user.click(contextualMenuButton);

      const deleteButton = screen.queryByRole("button", {
        name: `Delete ${nonRedactableActiveScript.title} script`,
      });

      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("contextual menu modals", () => {
    it("should open the delete modal with script profiles when the delete button is clicked", async () => {
      renderWithProviders(
        <ScriptListActions script={activeScriptWithProfiles} />,
      );
      const contextualMenuButton = screen.getByRole("button", {
        name: `${activeScriptWithProfiles.title} actions`,
      });

      await user.click(contextualMenuButton);

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${activeScriptWithProfiles.title} script`,
      });

      await user.click(deleteButton);

      const deleteModal = screen.getByRole("dialog", {
        name: `Delete ${activeScriptWithProfiles.title}`,
      });
      expect(deleteModal).toBeInTheDocument();

      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
    });

    it("should open the delete modal with no script profiles when the delete button is clicked", async () => {
      renderWithProviders(
        <ScriptListActions script={activeScriptWithNoProfiles} />,
      );
      const contextualMenuButton = screen.getByRole("button", {
        name: `${activeScriptWithNoProfiles.title} actions`,
      });
      await user.click(contextualMenuButton);

      const deleteButton = screen.getByRole("button", {
        name: `Delete ${activeScriptWithNoProfiles.title} script`,
      });
      expect(deleteButton).toBeInTheDocument();

      await user.click(deleteButton);
      const deleteModal = screen.getByRole("dialog", {
        name: `Delete ${activeScriptWithNoProfiles.title}`,
      });
      expect(deleteModal).toBeInTheDocument();

      const list = screen.queryByRole("list");
      expect(list).not.toBeInTheDocument();

      expect(
        screen.getByText(
          /deleting the script will remove the contents from Landscape./i,
        ),
      ).toBeInTheDocument();
    });

    it("should open the archive modal with script profiles when the archive button is clicked", async () => {
      renderWithProviders(
        <ScriptListActions script={archivedScriptWithProfiles} />,
      );
      const contextualMenuButton = screen.getByRole("button", {
        name: `${archivedScriptWithProfiles.title} actions`,
      });

      await user.click(contextualMenuButton);

      const archiveButton = screen.getByRole("button", {
        name: `Archive ${archivedScriptWithProfiles.title} script`,
      });

      await user.click(archiveButton);

      const archiveModal = screen.getByRole("dialog", {
        name: `Archive ${archivedScriptWithProfiles.title}`,
      });
      expect(archiveModal).toBeInTheDocument();

      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
    });

    it("should open the archive modal with no script profiles when the archive button is clicked", async () => {
      renderWithProviders(
        <ScriptListActions script={archivedScriptWithNoProfiles} />,
      );
      const contextualMenuButton = screen.getByRole("button", {
        name: `${archivedScriptWithNoProfiles.title} actions`,
      });
      await user.click(contextualMenuButton);

      const archiveButton = screen.getByRole("button", {
        name: `Archive ${archivedScriptWithNoProfiles.title} script`,
      });
      expect(archiveButton).toBeInTheDocument();

      await user.click(archiveButton);
      const archiveModal = screen.getByRole("dialog", {
        name: `Archive ${archivedScriptWithNoProfiles.title}`,
      });
      expect(archiveModal).toBeInTheDocument();

      const list = screen.queryByRole("list");
      expect(list).not.toBeInTheDocument();

      expect(
        screen.getByText(
          /archiving the script will prevent it from running in the future./i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("contextual menu side panels", () => {
    it("should open the details side panel when the view details button is clicked", async () => {
      renderWithProviders(<ScriptListActions script={activeScript} />);
      const contextualMenuButton = screen.getByRole("button", {
        name: `${activeScript.title} actions`,
      });

      await user.click(contextualMenuButton);

      const viewDetailsButton = screen.getByRole("button", {
        name: `View details for ${activeScript.title} script`,
      });

      await user.click(viewDetailsButton);

      const sidePanel = screen.getByRole("complementary");
      const header = screen.getByRole("heading", {
        name: activeScript.title,
      });

      expect(header).toBeInTheDocument();
      expect(sidePanel).toBeInTheDocument();
    });

    it("should open the edit side panel when the edit button is clicked", async () => {
      renderWithProviders(<ScriptListActions script={activeScript} />);
      const contextualMenuButton = screen.getByRole("button", {
        name: `${activeScript.title} actions`,
      });

      await user.click(contextualMenuButton);

      const editButton = screen.getByRole("button", {
        name: `Edit ${activeScript.title} script`,
      });

      await user.click(editButton);

      const sidePanel = screen.getByRole("complementary");
      const header = screen.getByRole("heading", {
        name: `Edit "${activeScript.title}" script`,
      });

      expect(header).toBeInTheDocument();
      expect(sidePanel).toBeInTheDocument();
    });

    it("should open the run side panel when the run button is clicked", async () => {
      renderWithProviders(<ScriptListActions script={activeScript} />);
      const contextualMenuButton = screen.getByRole("button", {
        name: `${activeScript.title} actions`,
      });

      await user.click(contextualMenuButton);

      const runButton = screen.getByRole("button", {
        name: `Run ${activeScript.title} script`,
      });

      await user.click(runButton);

      const sidePanel = screen.getByRole("complementary");
      const header = screen.getByRole("heading", {
        name: `Run "${activeScript.title}" script`,
      });

      expect(sidePanel).toBeInTheDocument();
      expect(header).toBeInTheDocument();
    });
  });
});
