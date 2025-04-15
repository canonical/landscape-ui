import { renderWithProviders } from "@/tests/render";
import SingleScript from "./SingleScript";
import { scripts } from "@/tests/mocks/script";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { useScripts } from "../../hooks";

describe("SingleScript", () => {
  const copyScript = vi.hoisted(() => vi.fn());
  const createScript = vi.hoisted(() => vi.fn());
  const createScriptAttachment = vi.hoisted(() => vi.fn());
  const editScript = vi.hoisted(() => vi.fn());
  const removeScriptAttachment = vi.hoisted(() => vi.fn());

  vi.mock("../../hooks", async (importOriginal) => {
    const original = await importOriginal<{ useScripts: typeof useScripts }>();

    return {
      useScripts: () => ({
        ...original.useScripts(),
        copyScriptQuery: { mutateAsync: copyScript },
        createScriptAttachmentQuery: { mutateAsync: createScriptAttachment },
        createScriptQuery: { mutateAsync: createScript },
        editScriptQuery: { mutateAsync: editScript },
        removeScriptAttachmentQuery: { mutateAsync: removeScriptAttachment },
      }),
    };
  });

  describe("copy script form", () => {
    it("should render copy script form", () => {
      renderWithProviders(<SingleScript action="copy" script={scripts[0]} />);

      expect(
        screen.getByRole("textbox", { name: /title/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("combobox", { name: /access group/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /copy script/i }),
      ).toBeInTheDocument();
    });

    it("should validate form", async () => {
      renderWithProviders(<SingleScript action="copy" script={scripts[0]} />);

      await userEvent.click(
        screen.getByRole("button", { name: /copy script/i }),
      );

      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    });

    it("should use proper values to copy script", async () => {
      renderWithProviders(<SingleScript action="copy" script={scripts[0]} />);

      await userEvent.type(
        screen.getByRole("textbox", { name: /title/i }),
        "New Title",
      );
      await userEvent.click(
        screen.getByRole("button", { name: /copy script/i }),
      );

      expect(copyScript).toHaveBeenCalledWith({
        access_group: scripts[0].access_group,
        destination_title: "New Title",
        script_id: scripts[0].id,
      });
    });
  });

  describe("add script form", () => {
    it("should render add script form", async () => {
      renderWithProviders(<SingleScript action="add" />);

      expect(
        screen.getByRole("textbox", { name: /title/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("spinbutton", { name: /time limit/i }),
      ).toHaveValue(300);
      expect(
        screen.getByRole("textbox", { name: /run as user/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("combobox", { name: /access group/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /list of attachments/i }),
      ).toBeInTheDocument();
      expect(screen.getAllByLabelText(/attachment/i)).toHaveLength(5);
      expect(
        screen.getByRole("button", { name: /add script/i }),
      ).toBeInTheDocument();
    });

    it("should validate form", async () => {
      renderWithProviders(<SingleScript action="add" />);

      await userEvent.click(
        screen.getByRole("button", { name: /add script/i }),
      );

      expect(screen.getAllByText(/this field is required/i)).toHaveLength(2);
    });
  });

  describe("edit script form", () => {
    it("should render edit script form", async () => {
      const [script] = scripts;

      renderWithProviders(<SingleScript action="edit" script={script} />);

      expect(screen.getByRole("textbox", { name: /title/i })).toHaveValue(
        script.title,
      );
      expect(
        screen.getByRole("spinbutton", { name: /time limit/i }),
      ).toHaveValue(script.time_limit);
      expect(screen.getByRole("textbox", { name: /run as user/i })).toHaveValue(
        script.username,
      );

      await waitFor(() => {
        expect(
          screen.getByRole("combobox", { name: /access group/i }),
        ).toHaveValue(script.access_group);
      });

      expect(
        screen.getByRole("heading", { name: /list of attachments/i }),
      ).toBeInTheDocument();
      expect(screen.getAllByLabelText(/attachment/i)).toHaveLength(5);
      expect(
        screen.getByRole("button", { name: /save changes/i }),
      ).toBeInTheDocument();
    });
  });
});
