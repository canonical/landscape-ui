import { PATHS } from "@/libs/routes";
import { availableSnapInfo, installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assert, describe, expect, it, beforeEach } from "vitest";
import SwitchSnapForm from "./SwitchSnapForm";

const snapWithChannels = installedSnaps.find((snap) => {
  const snapInfo = availableSnapInfo.find(
    (info) => info.name === snap.snap.name,
  );
  return snapInfo && snapInfo["channel-map"].length > 0;
});

const snapWithNoChannels = installedSnaps.find((snap) => {
  const snapInfo = availableSnapInfo.find(
    (info) => info.name === snap.snap.name,
  );
  return snapInfo && snapInfo["channel-map"].length === 0;
});

assert(
  snapWithChannels,
  "No installed snap has available channels to switch to.",
);
assert(snapWithNoChannels, "No installed snap has zero available channels.");

const snapInfoWithChannels =
  availableSnapInfo.find((info) => info.name === snapWithChannels.snap.name) ??
  null;

const snapInfoWithNoChannels =
  availableSnapInfo.find(
    (info) => info.name === snapWithNoChannels.snap.name,
  ) ?? null;

const renderSwitchSnapForm = (
  snap = snapWithChannels,
  snapInfo = snapInfoWithChannels,
) =>
  renderWithProviders(
    <SwitchSnapForm installedSnaps={[snap]} snapInfo={snapInfo} />,
    {},
    "/instances/1",
    `/${PATHS.instances.root}/${PATHS.instances.single}`,
  );

describe("SwitchSnapForm", () => {
  describe("rendering", () => {
    it("renders the channel select and submit button", () => {
      renderSwitchSnapForm();

      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /switch/i }),
      ).toBeInTheDocument();
    });

    it("renders delivery scheduling blocks", () => {
      renderSwitchSnapForm();

      expect(screen.getByLabelText("As soon as possible")).toBeInTheDocument();
      expect(screen.getByLabelText("No")).toBeInTheDocument();
    });

    it("populates channel options from snap info", () => {
      renderSwitchSnapForm();

      const options = screen.getAllByRole("option");
      expect(options.length).toBeGreaterThan(0);
    });

    it("pre-selects the first available channel", () => {
      renderSwitchSnapForm();

      const select = screen.getByRole("combobox");
      const options = screen.getAllByRole("option");

      expect(select).toHaveValue(options[0]?.getAttribute("value") ?? "");
    });
  });

  describe("no available channels", () => {
    it("disables the channel select when no channels are available", () => {
      renderSwitchSnapForm(snapWithNoChannels, snapInfoWithNoChannels);

      expect(screen.getByRole("combobox")).toBeDisabled();
    });

    it("shows the no available channels help text", () => {
      renderSwitchSnapForm(snapWithNoChannels, snapInfoWithNoChannels);

      expect(
        screen.getByText("No available channels to switch to."),
      ).toBeInTheDocument();
    });

    it("shows the release required error when submitting without a channel", async () => {
      renderSwitchSnapForm(snapWithNoChannels, snapInfoWithNoChannels);

      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(
        await screen.findByText("Release is required"),
      ).toBeInTheDocument();
    });
  });

  describe("channel selection", () => {
    beforeEach(() => {
      renderSwitchSnapForm();
    });

    it("allows switching between channel options", async () => {
      const releaseSelect = screen.getByRole("combobox");
      const options: HTMLOptionElement[] = screen.getAllByRole("option");

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

      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
      expect(await screen.findByText(/to be switched/i)).toBeInTheDocument();
    });

    it("submits with scheduled delivery and shows success notification", async () => {
      renderSwitchSnapForm();

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

      await userEvent.click(screen.getByLabelText("Yes"));
      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
    });

    it("shows an error notification on API failure", async () => {
      setEndpointStatus("error");
      renderSwitchSnapForm();

      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(await screen.findByText(/error response/i)).toBeInTheDocument();
    });
  });
});
