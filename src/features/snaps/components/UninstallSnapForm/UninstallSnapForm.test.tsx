import { PATHS } from "@/libs/routes";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";
import type { InstalledSnap } from "../../types";
import UninstallSnapForm from "./UninstallSnapForm";

const defaultInstalledSnaps: InstalledSnap[] = [installedSnaps[0]];
const multipleInstalledSnaps: InstalledSnap[] = [...installedSnaps];

const renderUninstallSnapForm = (
  snaps: InstalledSnap[] = defaultInstalledSnaps,
) =>
  renderWithProviders(
    <UninstallSnapForm installedSnaps={snaps} />,
    {},
    "/instances/1",
    `/${PATHS.instances.root}/${PATHS.instances.single}`,
  );

describe("UninstallSnapForm", () => {
  describe("rendering", () => {
    it("renders the snap message and uninstall button", () => {
      renderUninstallSnapForm();

      expect(
        screen.getByText(/this will remove Snap 1 from your system/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /uninstall/i }),
      ).toBeInTheDocument();
    });

    it("renders the submit button with negative appearance", () => {
      renderUninstallSnapForm();

      const button = screen.getByRole("button", { name: /uninstall/i });
      expect(button).toBeInTheDocument();
    });

    it("renders the correct message for multiple snaps", () => {
      renderUninstallSnapForm(multipleInstalledSnaps);

      expect(
        screen.getByText(
          new RegExp(
            `this will remove ${multipleInstalledSnaps.length} snaps from your system`,
            "i",
          ),
        ),
      ).toBeInTheDocument();
    });

    it("renders delivery scheduling blocks", () => {
      renderUninstallSnapForm();

      expect(screen.getByLabelText("As soon as possible")).toBeInTheDocument();
      expect(screen.getByLabelText("No")).toBeInTheDocument();
    });
  });

  describe("delivery scheduling", () => {
    beforeEach(() => {
      renderUninstallSnapForm();
    });

    it("shows the as soon as possible option checked by default", () => {
      expect(screen.getByLabelText("As soon as possible")).toBeChecked();
    });

    it("reveals a delay window input when randomize is enabled", async () => {
      await userEvent.click(screen.getByLabelText("Yes"));
      expect(screen.getByText(/time in minutes/i)).toBeVisible();
    });
  });

  describe("form submission", () => {
    it("submits successfully and shows success notification", async () => {
      renderUninstallSnapForm();

      await userEvent.click(screen.getByRole("button", { name: /uninstall/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
      expect(await screen.findByText(/to be uninstalled/i)).toBeInTheDocument();
    });

    it("shows an error notification on API failure", async () => {
      setEndpointStatus("error");
      renderUninstallSnapForm();

      await userEvent.click(screen.getByRole("button", { name: /uninstall/i }));

      expect(await screen.findByText(/error response/i)).toBeInTheDocument();
    });
  });
});
