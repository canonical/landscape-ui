import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import RepositoryProfileFormTabs from "./RepositoryProfileFormTabs";

describe("RepositoryProfileFormTabs", () => {
  const user = userEvent.setup();

  it("switches tabs on click", async () => {
    const setTab = vi.fn();
    renderWithProviders(
      <RepositoryProfileFormTabs currentTab={0} onCurrentTabChange={setTab} />,
    );

    await user.click(screen.getByRole("tab", { name: "Pockets" }));
    expect(setTab).toHaveBeenCalledWith(1);
  });
});
