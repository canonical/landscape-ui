import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import IgnorableModal from "./IgnorableModal";

describe("IgnorableModal", () => {
  const props = {
    confirmButtonLabel: "Confirm",
    hideModal: vi.fn(),
    hideNotification: vi.fn(),
    ignore: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();

    renderWithProviders(<IgnorableModal {...props} />);
  });

  it("should confirm", async () => {
    await userEvent.click(screen.getByRole("checkbox"));

    await userEvent.click(
      screen.getByRole("button", { name: props.confirmButtonLabel }),
    );

    expect(props.hideModal).toHaveBeenCalledOnce();
    expect(props.hideNotification).toHaveBeenCalledOnce();
    expect(props.ignore).toHaveBeenCalledOnce();
  });

  it("should close", async () => {
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(props.hideModal).toHaveBeenCalledOnce();
  });
});
