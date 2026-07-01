import { PATHS } from "@/libs/routes";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";
import type { InstalledSnap } from "../../types";
import HoldSnapForm from "./HoldSnapForm";

const unheldSnap =
  installedSnaps.find((snap) => snap.held_until === null) ?? installedSnaps[0];
const defaultInstalledSnaps: InstalledSnap[] = [unheldSnap];
const multipleInstalledSnaps: InstalledSnap[] = [...installedSnaps];

const renderHoldSnapForm = (snaps: InstalledSnap[] = defaultInstalledSnaps) =>
  renderWithProviders(
    <HoldSnapForm installedSnaps={snaps} />,
    {},
    "/instances/1",
    `/${PATHS.instances.root}/${PATHS.instances.single}`,
  );

describe("HoldSnapForm", () => {
  describe("rendering", () => {
    it("renders the snap message and submit button", () => {
      renderHoldSnapForm();

      expect(screen.getByText(/pause automatic updates/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /hold/i })).toBeInTheDocument();
    });

    it("renders the hold radio group", () => {
      renderHoldSnapForm();

      expect(screen.getByLabelText("Indefinitely")).toBeInTheDocument();
      expect(screen.getByLabelText("Select date")).toBeInTheDocument();
    });

    it("defaults to the indefinitely radio option", () => {
      renderHoldSnapForm();

      expect(screen.getByLabelText("Indefinitely")).toBeChecked();
      expect(screen.getByLabelText("Select date")).not.toBeChecked();
    });

    it("renders delivery scheduling blocks", () => {
      renderHoldSnapForm();

      expect(screen.getByLabelText("As soon as possible")).toBeInTheDocument();
    });

    it("renders hold/unhold summary for mixed snap selection", () => {
      renderHoldSnapForm(multipleInstalledSnaps);

      expect(
        screen.getByText(
          new RegExp(
            `you selected ${multipleInstalledSnaps.length} snaps`,
            "i",
          ),
        ),
      ).toBeInTheDocument();
    });
  });

  describe("hold date selection", () => {
    beforeEach(() => {
      renderHoldSnapForm();
    });

    it("shows datetime input when Select date radio is clicked", async () => {
      await userEvent.click(screen.getByLabelText("Select date"));

      expect(
        screen.getByDisplayValue(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/),
      ).toBeInTheDocument();
    });

    it("hides the datetime input when switching back to Indefinitely", async () => {
      await userEvent.click(screen.getByLabelText("Select date"));
      expect(
        screen.getByDisplayValue(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/),
      ).toBeInTheDocument();

      await userEvent.click(screen.getByLabelText("Indefinitely"));
      expect(
        screen.queryByDisplayValue(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/),
      ).not.toBeInTheDocument();
    });
  });

  describe("form submission", () => {
    it("submits with indefinite hold and shows success notification", async () => {
      renderHoldSnapForm();

      await userEvent.click(screen.getByRole("button", { name: /hold/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
      expect(await screen.findByText(/to be held/i)).toBeInTheDocument();
    });

    it("submits with a specific date hold and shows success notification", async () => {
      renderHoldSnapForm();

      await userEvent.click(screen.getByLabelText("Select date"));
      await userEvent.click(screen.getByRole("button", { name: /hold/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
    });

    it("shows an error notification on API failure", async () => {
      setEndpointStatus("error");
      renderHoldSnapForm();

      await userEvent.click(screen.getByRole("button", { name: /hold/i }));

      expect(await screen.findByText(/error response/i)).toBeInTheDocument();
    });
  });
});
