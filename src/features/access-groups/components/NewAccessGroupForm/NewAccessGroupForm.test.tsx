import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import NewAccessGroupForm from "./NewAccessGroupForm";
import userEvent from "@testing-library/user-event";

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
    expect(screen.getAllByText("This field is required")).toHaveLength(2);
  });
});
