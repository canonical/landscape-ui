import useNotify from "@/hooks/useNotify";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { GlobalShell } from "./GlobalShell";

const NotificationTrigger = () => {
  const { notify } = useNotify();

  return (
    <button
      type="button"
      onClick={() => {
        notify.success({
          title: "Success",
          message: "Success notification",
        });
      }}
    >
      Trigger notification
    </button>
  );
};

describe("GlobalShell", () => {
  it("renders children", () => {
    renderWithProviders(<GlobalShell>Shell content</GlobalShell>);
    expect(screen.getByText("Shell content")).toBeInTheDocument();
  });

  it("shows a notification when notify has a message", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <GlobalShell>
        <NotificationTrigger />
      </GlobalShell>,
    );

    await user.click(
      screen.getByRole("button", { name: "Trigger notification" }),
    );

    expect(
      (await screen.findAllByText("Success notification")).length,
    ).toBeGreaterThan(0);
  });
});
