import { renderWithProviders } from "@/tests/render";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RemoveMirrorModal from "./RemoveMirrorModal";
import type { ComponentProps } from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { publications } from "@/tests/mocks/publications";
import { mirrors } from "@/tests/mocks/mirrors";

describe("RemoveMirrorModal", () => {
  const close = vi.fn();
  const props: ComponentProps<typeof RemoveMirrorModal> = {
    close,
    isOpen: true,
    mirrorDisplayName: mirrors[0].displayName,
    mirrorName: mirrors[0].name,
  };

  const user = userEvent.setup();

  beforeEach(() => {
    close.mockReset();
  });

  it("doesn't render while closed", () => {
    renderWithProviders(<RemoveMirrorModal {...props} isOpen={false} />);

    expect(
      screen.queryByText(`Remove ${props.mirrorDisplayName}`),
    ).not.toBeInTheDocument();
  });

  it("renders a list of publications", async () => {
    renderWithProviders(<RemoveMirrorModal {...props} />);

    for (const { displayName } of publications.filter(
      ({ source }) => source === props.mirrorName,
    )) {
      expect(await screen.findByText(displayName)).toBeInTheDocument();
    }
  });

  it("renders a message when there are no publications", async () => {
    renderWithProviders(
      <RemoveMirrorModal
        {...props}
        mirrorDisplayName={mirrors[1].displayName}
        mirrorName={mirrors[1].name}
      />,
    );

    expect(
      screen.queryByText(
        "This mirror is associated with the following publications:",
      ),
    ).not.toBeInTheDocument();
    expect(
      await screen.findByText(
        /This action will remove the mirror from Landscape/i,
      ),
    ).toBeInTheDocument();
  });

  it("removes a mirror", async () => {
    renderWithProviders(<RemoveMirrorModal {...props} />);

    await user.type(
      screen.getByPlaceholderText(`remove ${props.mirrorDisplayName}`),
      `remove ${props.mirrorDisplayName}`,
    );
    await user.click(screen.getByRole("button", { name: /remove mirror/i }));

    expect(
      await screen.findByText(
        `You have successfully removed ${props.mirrorDisplayName}`,
      ),
    ).toBeInTheDocument();
    expect(close).toHaveBeenCalled();
  });

  it("does not fetch publications when the modal is closed", () => {
    renderWithProviders(<RemoveMirrorModal {...props} isOpen={false} />);

    expect(
      screen.queryByText(
        "This mirror is associated with the following publications:",
      ),
    ).not.toBeInTheDocument();
  });
});
