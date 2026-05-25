import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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

  it("submits the form successfully with valid data", async () => {
    renderWithProviders(<NewAccessGroupForm />);

    const parentSelect = await screen.findByRole("combobox", {
      name: /parent/i,
    });
    await waitFor(() => {
      expect(parentSelect).not.toBeDisabled();
    });

    const titleInput = screen.getByRole("textbox", { name: /title/i });
    await userEvent.type(titleInput, "New Test Group");

    const submitButton = screen.getByRole("button", {
      name: /add access group/i,
    });
    await userEvent.click(submitButton);

    expect(
      screen.queryByText("This field is required"),
    ).not.toBeInTheDocument();
  });
});
