import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect } from "vitest";
import AssignEmployeeToInstanceForm from "./AssignEmployeeToInstanceForm";
import userEvent from "@testing-library/user-event";

const props: ComponentProps<typeof AssignEmployeeToInstanceForm> = {
  instanceTitle: "Test Instance",
};

describe("AssignEmployeeToInstanceForm", () => {
  const user = userEvent.setup();

  beforeEach(async () => {
    renderWithProviders(<AssignEmployeeToInstanceForm {...props} />);
  });

  it("renders form correctly", () => {
    const title = screen.getByRole("searchbox", {
      name: /search for employees/i,
    });
    expect(title).toBeInTheDocument();

    const informationText = screen.getByText(
      /You can associate the instance with the selected employee, allowing them to view its details and recovery key./i,
    );
    expect(informationText).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Associate/i }),
    ).toBeInTheDocument();
  });

  it("shows error message when employee is not selected and form is submitted", async () => {
    const submitButton = screen.getByRole("button", { name: /Associate/i });
    await user.click(submitButton);

    const errorMessage = screen.getByText(/This field is required./i);
    expect(errorMessage).toBeInTheDocument();
  });
});
