import useSidePanel from "@/hooks/useSidePanel";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PublicationTargetAddButton from "./PublicationTargetAddButton";

vi.mock("@/hooks/useSidePanel");

describe("PublicationTargetAddButton", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    (useSidePanel as Mock).mockReturnValue({
      setSidePanelContent: vi.fn(),
      closeSidePanel: vi.fn(),
    });
  });

  it("renders the Add publication target button", () => {
    renderWithProviders(<PublicationTargetAddButton />);

    expect(
      screen.getByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
  });

  it("calls setSidePanelContent with the correct title when clicked", async () => {
    const { setSidePanelContent } = useSidePanel();

    renderWithProviders(<PublicationTargetAddButton />);

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    expect(setSidePanelContent).toHaveBeenCalledWith(
      "Add publication target",
      expect.anything(),
    );
  });
});
