import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import { EditSnapType } from "../helpers";
import EditSnap from "./EditSnap";

const snapData = {
  snap2: installedSnaps.find((snap) => snap.snap.name === "Snap 2")!,
  single: {
    unheldSnap: installedSnaps.find((snap) => snap.held_until === null)!,
  },
  multiple: {
    unheldSnaps: installedSnaps.filter((snap) => snap.held_until === null),
    heldSnaps: installedSnaps.filter((snap) => snap.held_until !== null),
  },
};

const mixedSelectedSnapIds = [
  ...snapData.multiple.heldSnaps,
  ...snapData.multiple.unheldSnaps,
];

const baseProps = {
  instanceId: 1,
  installedSnaps: mixedSelectedSnapIds,
};

const SwitchSnapFormProps = {
  ...baseProps,
  type: EditSnapType.Switch,
};

const UninstallSnapFormProps = {
  ...baseProps,
  type: EditSnapType.Uninstall,
};

const RefreshSnapFormProps = {
  ...baseProps,
  type: EditSnapType.Refresh,
};

const HoldSnapFormProps = {
  ...baseProps,
  type: EditSnapType.Hold,
};

const unholdSnapFormProps = {
  ...baseProps,
  type: EditSnapType.Unhold,
};

const allProps = [
  SwitchSnapFormProps,
  UninstallSnapFormProps,
  RefreshSnapFormProps,
  HoldSnapFormProps,
  unholdSnapFormProps,
];

describe("EditSnap", () => {
  describe("renders with all different types", () => {
    it.each([allProps])("renders with types in props", (props) => {
      renderWithProviders(<EditSnap {...props} />);
    });
  });

  describe("common edit snap form functionalities", () => {
    beforeEach(async () => {
      renderWithProviders(
        <EditSnap {...SwitchSnapFormProps} installedSnaps={[snapData.snap2]} />,
      );
    });

    it("radio button functionalities", async () => {
      const instantDeliveryTimeRadioOption = screen.getByLabelText(
        "As soon as possible",
      );
      expect(instantDeliveryTimeRadioOption).toBeChecked();

      const scheduledDeliveryTimeRadioOption =
        screen.getByLabelText("Scheduled");
      expect(scheduledDeliveryTimeRadioOption).not.toBeChecked();

      const randomizeDeliveryTrueOption = screen.getByLabelText("Yes");
      const randomizeDeliveryFalseOption = screen.getByLabelText("No");
      expect(randomizeDeliveryTrueOption).not.toBeChecked();
      expect(randomizeDeliveryFalseOption).toBeChecked();

      await userEvent.click(randomizeDeliveryTrueOption);
      expect(screen.getByText(/time in minutes/i)).toBeVisible();
    });
  });

  describe("Switch Edit Snap Form", () => {
    beforeEach(async () => {
      renderWithProviders(
        <EditSnap {...SwitchSnapFormProps} installedSnaps={[snapData.snap2]} />,
      );
    });

    it("renders switch-form only fields", async () => {
      const releaseSelect = await screen.findByRole("combobox");
      expect(releaseSelect).toBeInTheDocument();
    });

    it("switches between release types", async () => {
      const releaseSelect = await screen.findByRole("combobox");
      expect(releaseSelect).toBeInTheDocument();

      const options: HTMLOptionElement[] = await screen.findAllByRole("option");
      await userEvent.selectOptions(releaseSelect, options[1]);
      expect(options[0].selected).toBeFalsy();
      expect(options[1].selected).toBeTruthy();
    });
  });

  describe("Hold Edit Snap Form", () => {
    beforeEach(async () => {
      renderWithProviders(
        <EditSnap
          {...HoldSnapFormProps}
          installedSnaps={[snapData.single.unheldSnap]}
        />,
      );
    });

    it("renders hold-form only fields", async () => {
      const indefiniteRadioOption = screen.getByLabelText("Indefinitely");
      expect(indefiniteRadioOption).toBeChecked();

      const selectDateRadioOption = screen.getByLabelText("Select date");
      expect(selectDateRadioOption).not.toBeChecked();
    });
  });
});
