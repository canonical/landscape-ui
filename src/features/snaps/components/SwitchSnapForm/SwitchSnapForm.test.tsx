import { PATHS } from "@/libs/routes";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";
import SwitchSnapForm from "./SwitchSnapForm";

const snapWithChannels =
  installedSnaps.find((snap) => snap.snap.name === "Snap 2") ??
  installedSnaps[0];

const snapWithNoChannels =
  installedSnaps.find((snap) => snap.snap.name === "Snap 1") ??
  installedSnaps[0];

const renderSwitchSnapForm = (
  snap: (typeof installedSnaps)[number] = snapWithChannels,
) =>
  renderWithProviders(
    <SwitchSnapForm installedSnaps={[snap]} />,
    {},
    "/instances/1",
    `/${PATHS.instances.root}/${PATHS.instances.single}`,
  );

describe("SwitchSnapForm", () => {
  describe("rendering", () => {
    it("renders the channel select and submit button", async () => {
      renderSwitchSnapForm();

      expect(
        await screen.findByRole("combobox"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /switch/i }),
      ).toBeInTheDocument();
    });

    it("renders delivery scheduling blocks", async () => {
      renderSwitchSnapForm();

      await screen.findByRole("combobox");

      expect(screen.getByLabelText("As soon as possible")).toBeInTheDocument();
      expect(screen.getByLabelText("No")).toBeInTheDocument();
    });

    it("populates channel options from the API", async () => {
      renderSwitchSnapForm();

      const options = await screen.findAllByRole("option");
      expect(options.length).toBeGreaterThan(0);
    });

    it("pre-selects the first available channel", async () => {
      renderSwitchSnapForm();

      const select = await screen.findByRole("combobox");
      const options = await screen.findAllByRole("option");

      expect(select).toHaveValue(options[0]?.getAttribute("value") ?? "");
    });
  });

  describe("no available channels", () => {
    it("disables the channel select when no channels are available", async () => {
      renderSwitchSnapForm(snapWithNoChannels);

      const select = await screen.findByRole("combobox");
      expect(select).toBeDisabled();
    });

    it("shows the no available channels help text", async () => {
      renderSwitchSnapForm(snapWithNoChannels);

      expect(
        await screen.findByText("No available channels to switch to."),
      ).toBeInTheDocument();
    });

    it("shows the release required error when submitting without a channel", async () => {
      renderSwitchSnapForm(snapWithNoChannels);

      await screen.findByRole("combobox");

      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(
        await screen.findByText("Release is required"),
      ).toBeInTheDocument();
    });
  });

  describe("channel selection", () => {
    beforeEach(async () => {
      renderSwitchSnapForm();
      await screen.findByRole("combobox");
    });

    it("allows switching between channel options", async () => {
      const releaseSelect = screen.getByRole("combobox");
      const options: HTMLOptionElement[] =
        await screen.findAllByRole("option");

      assert(options[0]);
      assert(options[1]);

      await userEvent.selectOptions(releaseSelect, options[1]);
      expect(options[0].selected).toBeFalsy();
      expect(options[1].selected).toBeTruthy();
    });
  });

  describe("form submission", () => {
    it("submits successfully and shows success notification", async () => {
      renderSwitchSnapForm();

      await screen.findByRole("combobox");

      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
      expect(await screen.findByText(/to be switched/i)).toBeInTheDocument();
    });

    it("submits with scheduled delivery and shows success notification", async () => {
      renderSwitchSnapForm();

      await screen.findByRole("combobox");

      await userEvent.click(screen.getByLabelText("Scheduled"));
      const deliverAfterInput = await screen.findByLabelText(/deliver after/i);
      fireEvent.change(deliverAfterInput, {
        target: { value: "2026-12-31T12:00" },
      });

      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
    });

    it("submits with randomize delivery enabled and shows success notification", async () => {
      renderSwitchSnapForm();

      await screen.findByRole("combobox");

      await userEvent.click(screen.getByLabelText("Yes"));
      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
    });

    it("shows an error notification on API failure", async () => {
      setEndpointStatus("error");
      renderSwitchSnapForm();

      await screen.findByRole("combobox");

      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(await screen.findByText(/error response/i)).toBeInTheDocument();
    });
  });
});
