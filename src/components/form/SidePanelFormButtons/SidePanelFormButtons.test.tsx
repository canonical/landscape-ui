import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import SidePanelFormButtons from "./SidePanelFormButtons";

describe("SidePanelFormButtons", () => {
  const user = userEvent.setup();
  const submitText = "Submit";

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

    await user.click(screen.getByRole("button", { name: title }));
    expect(submit).toHaveBeenCalledOnce();
  });

  it("has a submit button with submit type", () => {
    renderWithProviders(<SidePanelFormButtons submitButtonText={submitText} />);

    expect(screen.getByRole("button", { name: submitText })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("has a submit button with button type", async () => {
    const submit = vi.fn();

    renderWithProviders(
      <SidePanelFormButtons onSubmit={submit} submitButtonText={submitText} />,
    );

    const submitButton = screen.getByRole("button", { name: submitText });
    expect(submitButton).toHaveAttribute("type", "button");
    await user.click(submitButton);
    expect(submit).toHaveBeenCalledOnce();
  });

  describe("Form validation handling", () => {
    const formError = "Something went wrong";
    const formWarning = "Be careful";

    it("does not show the form error before a submit attempt", () => {
      renderWithProviders(<SidePanelFormButtons formError={formError} />);

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.queryByText(formError)).not.toBeInTheDocument();
    });

    it("shows the form error after a submit attempt", async () => {
      renderWithProviders(
        <SidePanelFormButtons
          formError={formError}
          submitButtonText={submitText}
        />,
      );

      await user.click(screen.getByRole("button", { name: submitText }));

      expect(screen.getByRole("alert")).toHaveTextContent(formError);
    });

    it("shows the form warning", () => {
      renderWithProviders(<SidePanelFormButtons formWarning={formWarning} />);

      expect(screen.getByRole("alert")).toHaveTextContent(formWarning);
    });

    it("shows the form error instead of the form warning after a submit attempt", async () => {
      renderWithProviders(
        <SidePanelFormButtons
          formError={formError}
          formWarning={formWarning}
          submitButtonText={submitText}
        />,
      );

      await user.click(screen.getByRole("button", { name: submitText }));

      expect(screen.getByText(formError)).toBeInTheDocument();
      expect(screen.queryByText(formWarning)).not.toBeInTheDocument();
    });
  });
});
