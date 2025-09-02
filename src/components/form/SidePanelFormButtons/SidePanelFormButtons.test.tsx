import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import SidePanelFormButtons from "./SidePanelFormButtons";

describe("SidePanelFormButtons", () => {
  it("has a back button", () => {
    renderWithProviders(<SidePanelFormButtons hasBackButton />);
    expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
  });

  it("has a secondary action button", async () => {
    const submit = vi.fn();
    const title = "Secondary action";

    renderWithProviders(
      <SidePanelFormButtons
        secondaryActionButtonSubmit={submit}
        secondaryActionButtonTitle={title}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: title }));
    expect(submit).toHaveBeenCalledOnce();
  });

  it("has a submit button with submit type", () => {
    const text = "Submit";

    renderWithProviders(<SidePanelFormButtons submitButtonText={text} />);

    expect(screen.getByRole("button", { name: text })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("has a submit button with button type", async () => {
    const submit = vi.fn();
    const text = "Submit";

    renderWithProviders(
      <SidePanelFormButtons onSubmit={submit} submitButtonText={text} />,
    );

    const submitButton = screen.getByRole("button", { name: text });
    expect(submitButton).toHaveAttribute("type", "button");
    await userEvent.click(submitButton);
    expect(submit).toHaveBeenCalledOnce();
  });
});
