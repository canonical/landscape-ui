import { expectLoadingState } from "@/tests/helpers";
import { availableSnapInfo } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";
import AvailableSnapDetails from "./AvailableSnapDetails";

const chosenSnap = availableSnapInfo[0];

const props = {
  instanceId: 1,
  name: chosenSnap.name,
  handleDeleteToBeConfirmedItem: vi.fn(),
  handleAddToSelectedItems: vi.fn(),
};

describe("AvailableSnap", () => {
  beforeEach(async () => {
    renderWithProviders(<AvailableSnapDetails {...props} />);
    await expectLoadingState();
  });

  it("renders correct snap information", () => {
    const snapName = screen.getByText(chosenSnap.name);
    expect(snapName).toBeInTheDocument();
    expect(screen.getByText("Release")).toBeVisible();
    expect(
      screen.getByText(chosenSnap.snap.publisher["display-name"] ?? ""),
    ).toBeVisible();
  });

  describe("Channel selection", () => {
    it("selects strict confinement channel", async () => {
      const selectRelease = screen.getByRole("combobox");
      const options: HTMLOptionElement[] = screen.getAllByRole("option");
      const strictConfinement =
        chosenSnap["channel-map"].find(
          (channel) => channel.confinement === "strict",
        ) ?? chosenSnap["channel-map"][0];
      const strictOption: HTMLOptionElement =
        options.find((option) =>
          option.textContent?.includes(
            `${strictConfinement.channel.name} - ${strictConfinement.channel.architecture}`,
          ),
        ) ?? options[0];
      await userEvent.selectOptions(selectRelease, strictOption);

      expect(strictOption.selected).toBeTruthy();
    });

    it("selects classic confinement channel", async () => {
      const selectRelease = screen.getByRole("combobox");
      const options: HTMLOptionElement[] = screen.getAllByRole("option");
      const classicConfinement =
        chosenSnap["channel-map"].find(
          (channel) => channel.confinement === "classic",
        ) ?? chosenSnap["channel-map"][0];
      const classicOption =
        options.find((option) =>
          option.textContent?.includes(
            `${classicConfinement.channel.name} - ${classicConfinement.channel.architecture}`,
          ),
        ) ?? options[0];

      await userEvent.selectOptions(selectRelease, classicOption);
      expect(classicOption.selected).toBeTruthy();

      const helpText = await screen.findByText(
        /This release requires classic permission/i,
      );
      const link = screen.getByRole("link", { name: /Learn more/i });

      expect(link).toBeVisible();
      expect(helpText).toBeVisible();
    });
  });

  describe("Button interactions", () => {
    it("should add snap to selected items", async () => {
      const button = screen.getByRole("button", { name: /Add/i });
      const options = screen.getAllByRole("option");
      const selectedChannel = options[0].textContent;
      await userEvent.click(button);
      expect(props.handleAddToSelectedItems).toHaveBeenCalledWith({
        "snap-id": chosenSnap["snap-id"],
        name: chosenSnap.name,
        snap: chosenSnap.snap,
        revision:
          chosenSnap["channel-map"]
            .find(
              (channel) =>
                `${channel.channel.name} - ${channel.channel.architecture}` ===
                selectedChannel,
            )
            ?.revision.toString() ?? "Unknown revision",
        channel:
          chosenSnap["channel-map"].find(
            (channel) =>
              `${channel.channel.name} - ${channel.channel.architecture}` ===
              selectedChannel,
          )?.channel.name ?? "Unknown channel",
      });
    });

    it("should delete snap from to be confirmed items", async () => {
      const button = screen.getByRole("button", { name: /cancel/i });
      await userEvent.click(button);
      expect(props.handleDeleteToBeConfirmedItem).toHaveBeenCalledWith();
    });
  });
});
