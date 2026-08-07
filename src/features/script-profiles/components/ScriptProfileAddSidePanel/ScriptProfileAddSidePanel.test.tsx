import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import ScriptProfileAddSidePanel from "./ScriptProfileAddSidePanel";

describe("ScriptProfileAddSidePanel", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders the add header and the script profile form", async () => {
    renderWithProviders(<ScriptProfileAddSidePanel />);

    expect(screen.getByText("Add script profile")).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "Add profile" }),
    ).toBeInTheDocument();
  });

  it("creates a script profile and shows a success notification", async () => {
    const user = userEvent.setup();

    renderWithProviders(<ScriptProfileAddSidePanel />);

    await user.type(
      await screen.findByRole("textbox", { name: "Title" }),
      "My new profile",
    );

    const scriptSearch = screen.getByPlaceholderText(/search for scripts/i);
    await user.click(scriptSearch);

    await waitFor(() => {
      expect(screen.getAllByTestId("dropdownElement").length).toBeGreaterThan(
        0,
      );
    });
    const [firstScript] = screen.getAllByTestId("dropdownElement");
    assert(firstScript);
    await user.click(firstScript);

    await user.click(screen.getByRole("button", { name: "Trigger" }));
    await user.click(
      await screen.findByRole("option", { name: /post enrollment/i }),
    );

    await user.click(screen.getByRole("button", { name: "Add profile" }));

    expect(
      await screen.findByText("You have successfully created My new profile"),
    ).toBeInTheDocument();
  });
});
