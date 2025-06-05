import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewAccessGroupForm from "./NewAccessGroupForm";

describe("NewAccessGroupForm", () => {
  it("renders form fields", () => {
    const { container } = renderWithProviders(<NewAccessGroupForm />);

    expect(container).toHaveTexts(["Title", "Parent"]);

    const addAccessGroupButton = screen.getByRole("button", {
      name: /add access group/i,
    });
    expect(addAccessGroupButton).toBeInTheDocument();
  });

  it("checks error messages for each field", async () => {
    renderWithProviders(<NewAccessGroupForm />);
    const addAccessGroupButton = screen.getByRole("button", {
      name: /add access group/i,
    });
    expect(addAccessGroupButton).toBeInTheDocument();
    await userEvent.click(addAccessGroupButton);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });
});
