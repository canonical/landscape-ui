import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PublicationTargetAddButton from "./PublicationTargetAddButton";

vi.mock(
  "@/features/publication-targets/components/NewPublicationTargetForm",
  () => ({
    NewPublicationTargetForm: () => <div>New publication target form</div>,
  }),
);

describe("PublicationTargetAddButton", () => {
  const user = userEvent.setup();

  it("renders the Add publication target button", () => {
    renderWithProviders(<PublicationTargetAddButton />);

    expect(
      screen.getByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
  });

  it("opens a side panel with the correct title when clicked", async () => {
    renderWithProviders(<PublicationTargetAddButton />);

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    expect(
      screen.getByRole("heading", { name: /add publication target/i }),
    ).toBeInTheDocument();
  });

  it("renders NewPublicationTargetForm inside the side panel", async () => {
    renderWithProviders(<PublicationTargetAddButton />);

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    expect(
      await screen.findByText("New publication target form"),
    ).toBeInTheDocument();
  });
});
