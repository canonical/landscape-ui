import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import RepositoryProfileAddButton from "./RepositoryProfileAddButton";

describe("RepositoryProfileAddButton", () => {
  const user = userEvent.setup();

  it("renders button with correct label", () => {
    renderWithProviders(<RepositoryProfileAddButton />);

    expect(
      screen.getByRole("button", { name: /Add repository profile/i }),
    ).toBeInTheDocument();
  });

  it("opens add repository profile form in side panel on click", async () => {
    renderWithProviders(<RepositoryProfileAddButton />);

    await user.click(
      screen.getByRole("button", { name: /Add repository profile/i }),
    );

    expect(
      await screen.findByRole("heading", { name: "Add repository profile" }),
    ).toBeInTheDocument();
  });
});
