import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import type { ComponentProps } from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdateMirrorModal from "./UpdateMirrorModal";

const mockSyncMirror = vi.fn();

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");

  return {
    ...actual,
    useSyncMirror: () => ({
      mutateAsync: mockSyncMirror,
    }),
  };
});

describe("UpdateMirrorModal", () => {
  const props: ComponentProps<typeof UpdateMirrorModal> = {
    close: () => undefined,
    isOpen: true,
    mirrorDisplayName: "Mirror display name",
    mirrorName: "mirrors/name",
  };

  const user = userEvent.setup();

  it("doesn't render while closed", async () => {
    renderWithProviders(<UpdateMirrorModal {...props} isOpen={false} />);

    expect(
      screen.queryByText(`Update ${props.mirrorDisplayName}`),
    ).not.toBeInTheDocument();
  });

  it("updates a mirror", async () => {
    renderWithProviders(<UpdateMirrorModal {...props} />);

    await user.click(screen.getByRole("button", { name: /update mirror/i }));

    expect(mockSyncMirror).toHaveBeenCalledWith(
      expect.objectContaining({ mirrorName: props.mirrorName }),
    );
  });
});
