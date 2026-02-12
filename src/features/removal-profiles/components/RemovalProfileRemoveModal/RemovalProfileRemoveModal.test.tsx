import { removalProfiles } from "@/tests/mocks/removalProfiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, it } from "vitest";
import RemovalProfileRemoveModal from "./RemovalProfileRemoveModal";

describe("RemovalProfileRemoveModal", () => {
  const user = userEvent.setup();

  it("removes a removal profile", async () => {
    const props: ComponentProps<typeof RemovalProfileRemoveModal> = {
      close: vi.fn(),
      isOpen: true,
      removalProfile: removalProfiles[0],
    };

    renderWithProviders(<RemovalProfileRemoveModal {...props} />);

    expect(
      screen.getByRole("heading", { name: /remove removal profile/i }),
    ).toBeInTheDocument();

    const removeButton = screen.getByRole("button", { name: "Remove" });
    expect(removeButton).toHaveAttribute("aria-disabled", "true");
    await user.type(
      screen.getByRole("textbox"),
      `remove ${props.removalProfile.title}`,
    );
    expect(removeButton).not.toHaveAttribute("aria-disabled");
    expect(removeButton).toBeEnabled();
    await user.click(removeButton);
    expect(props.close).toHaveBeenCalledTimes(1);
  });
});
