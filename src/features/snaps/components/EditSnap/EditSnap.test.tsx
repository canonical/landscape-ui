import { PATHS } from "@/libs/routes";
import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import { EditSnapType } from "../../helpers";
import EditSnap from "./EditSnap";

const snapData = {
  snap2:
    installedSnaps.find((snap) => snap.snap.name === "Snap 2") ??
    installedSnaps[0],
  single: {
    unheldSnap:
      installedSnaps.find((snap) => snap.held_until === null) ??
      installedSnaps[0],
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

const renderEditSnap = (props: Parameters<typeof EditSnap>[0]) =>
  renderWithProviders(
    <EditSnap {...props} />,
    {},
    "/instances/1",
    `/${PATHS.instances.root}/${PATHS.instances.single}`,
  );

describe("EditSnap", () => {
  describe("renders with all different types", () => {
    it.each([allProps])("renders with types in props", (props) => {
      renderEditSnap(props);
    });
  });

  describe("common edit snap form functionalities", () => {
    beforeEach(async () => {
      renderEditSnap({
        ...SwitchSnapFormProps,
        installedSnaps: [snapData.snap2],
      });
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

    it("submits with scheduled delivery enabled", async () => {
      await screen.findByRole("combobox");

      const scheduledRadio = screen.getByLabelText("Scheduled");
      await userEvent.click(scheduledRadio);

      const deliverAfterInput = await screen.findByLabelText(/deliver after/i);
      fireEvent.change(deliverAfterInput, {
        target: { value: "2026-12-31T12:00" },
      });

      const submitButton = screen.getByRole("button", { name: /switch/i });
      await userEvent.click(submitButton);

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
    });

    it("submits with randomize delivery enabled", async () => {
      const randomizeYesOption = screen.getByLabelText("Yes");
      await userEvent.click(randomizeYesOption);

      const submitButton = screen.getByRole("button", { name: /switch/i });
      await userEvent.click(submitButton);

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
    });
  });

  describe("Switch Edit Snap Form", () => {
    beforeEach(async () => {
      renderEditSnap({
        ...SwitchSnapFormProps,
        installedSnaps: [snapData.snap2],
      });
    });

    it("renders switch-form only fields", async () => {
      const releaseSelect = await screen.findByRole("combobox");
      expect(releaseSelect).toBeInTheDocument();
    });

    it("switches between release types", async () => {
      const releaseSelect = await screen.findByRole("combobox");
      expect(releaseSelect).toBeInTheDocument();

      const options: HTMLOptionElement[] = await screen.findAllByRole("option");
      assert(options[0]);
      assert(options[1]);
      await userEvent.selectOptions(releaseSelect, options[1]);
      expect(options[0].selected).toBeFalsy();
      expect(options[1].selected).toBeTruthy();
    });

    it("submits the switch form and shows success notification", async () => {
      const releaseSelect = await screen.findByRole("combobox");
      const options = await screen.findAllByRole("option");
      if (options[0]) {
        await userEvent.selectOptions(releaseSelect, options[0]);
      }

      const submitButton = screen.getByRole("button", { name: /switch/i });
      await userEvent.click(submitButton);

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
    });
  });

  describe("Hold Edit Snap Form", () => {
    beforeEach(async () => {
      renderEditSnap({
        ...HoldSnapFormProps,
        installedSnaps: [snapData.single.unheldSnap],
      });
    });

    it("renders hold-form only fields", async () => {
      const indefiniteRadioOption = screen.getByLabelText("Indefinitely");
      expect(indefiniteRadioOption).toBeChecked();

      const selectDateRadioOption = screen.getByLabelText("Select date");
      expect(selectDateRadioOption).not.toBeChecked();
    });

    it("shows datetime input when 'Select date' radio is clicked", async () => {
      const selectDateRadioOption = screen.getByLabelText("Select date");
      await userEvent.click(selectDateRadioOption);
      expect(
        screen.getByDisplayValue(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/),
      ).toBeInTheDocument();
    });

    it("submits hold form with indefinite hold", async () => {
      const submitButton = screen.getByRole("button", { name: /hold/i });
      await userEvent.click(submitButton);

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
    });
  });

  describe("Uninstall Edit Snap Form", () => {
    it("renders submit button with text 'Uninstall'", () => {
      renderEditSnap(UninstallSnapFormProps);
      expect(
        screen.getByRole("button", { name: /uninstall/i }),
      ).toBeInTheDocument();
    });

    it("submits uninstall form and shows success notification", async () => {
      renderEditSnap(UninstallSnapFormProps);
      const submitButton = screen.getByRole("button", { name: /uninstall/i });
      await userEvent.click(submitButton);

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
    });
  });

  describe("Unhold Edit Snap Form", () => {
    it("renders submit button with text 'Unhold'", () => {
      renderEditSnap(unholdSnapFormProps);
      expect(
        screen.getByRole("button", { name: /unhold/i }),
      ).toBeInTheDocument();
    });

    it("submits unhold form and shows success notification", async () => {
      renderEditSnap(unholdSnapFormProps);
      const submitButton = screen.getByRole("button", { name: /unhold/i });
      await userEvent.click(submitButton);

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
    });
  });

  describe("Refresh Edit Snap Form", () => {
    it("renders submit button with text 'Refresh'", () => {
      renderEditSnap(RefreshSnapFormProps);
      expect(
        screen.getByRole("button", { name: /refresh/i }),
      ).toBeInTheDocument();
    });

    it("submits refresh form and shows success notification", async () => {
      renderEditSnap(RefreshSnapFormProps);
      const submitButton = screen.getByRole("button", { name: /refresh/i });
      await userEvent.click(submitButton);

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
    });
  });
});
