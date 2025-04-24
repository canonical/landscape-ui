import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import IgnorableNotification from "./IgnorableNotification";

describe("IgnorableNotification", () => {
  it("should render", async () => {
    const props = {
      modalProps: {
        confirmButtonLabel: "Confirm",
      },
      hide: vi.fn(),
      storageKey: "key",
    };

    renderWithProviders(<IgnorableNotification {...props} />);

    await userEvent.click(screen.getByTestId("notification-close-button"));
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(
      screen.getByRole("button", { name: props.modalProps.confirmButtonLabel }),
    );

    expect(props.hide).toHaveBeenCalledOnce();
    expect(localStorage.getItem(props.storageKey)).toBe("true");
  });
});
