import { renderWithProviders } from "@/tests/render";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdateMirrorModal from "./UpdateMirrorModal";
import { mirrors } from "@/tests/mocks/mirrors";

describe("UpdateMirrorModal", () => {
  const close = vi.fn();
  const props: ComponentProps<typeof UpdateMirrorModal> = {
    close,
    isOpen: true,
    mirrorDisplayName: mirrors[0].displayName,
    mirrorName: mirrors[0].name,
  };

  const user = userEvent.setup();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("doesn't render while closed", async () => {
    renderWithProviders(<UpdateMirrorModal {...props} isOpen={false} />);

    expect(
      screen.queryByText(`Update ${props.mirrorDisplayName}`),
    ).not.toBeInTheDocument();
  });

  it("updates a mirror", async () => {
    renderWithProviders(<UpdateMirrorModal {...props} />);

    await user.click(screen.getByRole("button", { name: /update mirror/i }));

    expect(
      await screen.findByText(
        `You have marked ${props.mirrorDisplayName} to be updated`,
      ),
    ).toBeInTheDocument();
    expect(close).toHaveBeenCalled();
  });
});
