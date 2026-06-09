import { PATHS } from "@/libs/routes";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";
import type { InstalledSnap } from "../../types";
import RefreshSnapForm from "./RefreshSnapForm";

const defaultInstalledSnaps: InstalledSnap[] = [installedSnaps[0]];
const multipleInstalledSnaps: InstalledSnap[] = [...installedSnaps];

const renderRefreshSnapForm = (
  snaps: InstalledSnap[] = defaultInstalledSnaps,
) =>
  renderWithProviders(
    <RefreshSnapForm installedSnaps={snaps} />,
    {},
    "/instances/1",
    `/${PATHS.instances.root}/${PATHS.instances.single}`,
  );

describe("RefreshSnapForm", () => {
  describe("rendering", () => {
    it("renders the snap message and submit button", () => {
      renderRefreshSnapForm();

      expect(
        screen.getByText(/update Snap 1 to the latest version available/i),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /refresh/i }),
      ).toBeInTheDocument();
    });

    it("renders delivery scheduling blocks", () => {
      renderRefreshSnapForm();

      expect(screen.getByLabelText("As soon as possible")).toBeInTheDocument();
      expect(screen.getByLabelText("No")).toBeInTheDocument();
    });

    it("renders the correct message for multiple snaps", () => {
      renderRefreshSnapForm(multipleInstalledSnaps);

      expect(
        screen.getByText(/update 4 snaps to the latest version/i),
      ).toBeInTheDocument();
    });
  });

  describe("delivery scheduling", () => {
    beforeEach(() => {
      renderRefreshSnapForm();
    });

    it("shows the as soon as possible option checked by default", () => {
      expect(screen.getByLabelText("As soon as possible")).toBeChecked();
    });

    it("shows the randomize delivery No option checked by default", () => {
      expect(screen.getByLabelText("No")).toBeChecked();
    });

    it("reveals a delay window input when randomize is enabled", async () => {
      await userEvent.click(screen.getByLabelText("Yes"));
      expect(screen.getByText(/time in minutes/i)).toBeVisible();
    });
  });

  describe("form submission", () => {
    it("submits successfully and shows success notification", async () => {
      renderRefreshSnapForm();

      await userEvent.click(screen.getByRole("button", { name: /refresh/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
      expect(await screen.findByText(/to be refreshed/i)).toBeInTheDocument();
    });

    it("submits with scheduled delivery and shows success notification", async () => {
      renderRefreshSnapForm();

      const scheduledRadio = screen.getByLabelText("Scheduled");
      await userEvent.click(scheduledRadio);

      const deliverAfterInput = await screen.findByLabelText(/deliver after/i);
      fireEvent.change(deliverAfterInput, {
        target: { value: "2026-12-31T12:00" },
      });

      await userEvent.click(screen.getByRole("button", { name: /refresh/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
    });

    it("shows an error notification on API failure", async () => {
      setEndpointStatus("error");
      renderRefreshSnapForm();

      await userEvent.click(screen.getByRole("button", { name: /refresh/i }));

      expect(await screen.findByText(/error response/i)).toBeInTheDocument();
    });
  });
});
