import { removalProfiles } from "@/tests/mocks/removalProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import type { RemovalProfileRemoveModalProps } from "./RemovalProfileRemoveModal";
import RemovalProfileRemoveModal from "./RemovalProfileRemoveModal";

describe("RemovalProfileRemoveModal", () => {
  const user = userEvent.setup();

  it("removes a removal profile", async () => {
    const props: RemovalProfileRemoveModalProps = {
      close: vi.fn(),
      isOpen: true,
      removalProfile: removalProfiles[0],
    };

    renderWithProviders(<RemovalProfileRemoveModal {...props} />);

    expect(
      screen.getByRole("heading", { name: /remove removal profile/i }),
    ).toBeInTheDocument();

    const removeButton = screen.getByRole("button", { name: "Remove" });
    expect(removeButton).toBeDisabled();
    await user.type(
      screen.getByRole("textbox"),
      `remove ${props.removalProfile.title}`,
    );
    expect(removeButton).toBeEnabled();
    await user.click(removeButton);
    expect(props.close).toHaveBeenCalledTimes(1);
  });
});
