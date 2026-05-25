import { renderWithProviders } from "@/tests/render";
import { PATHS, ROUTES } from "@/libs/routes";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect } from "vitest";
import AssignEmployeeToInstanceForm from "./AssignEmployeeToInstanceForm";
import userEvent from "@testing-library/user-event";
import { setEndpointStatus } from "@/tests/controllers/controller";

const props: ComponentProps<typeof AssignEmployeeToInstanceForm> = {
  instanceTitle: "Test Instance",
};

const routePattern = `/${PATHS.instances.root}/${PATHS.instances.single}`;

describe("AssignEmployeeToInstanceForm", () => {
  const user = userEvent.setup();

  beforeEach(async () => {
    renderWithProviders(
      <AssignEmployeeToInstanceForm {...props} />,
      undefined,
      ROUTES.instances.details.single(1),
      routePattern,
    );
  });

  it("renders form correctly", () => {
    const title = screen.getByRole("searchbox", {
      name: /search for an employee/i,
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

  it("clears validation error after selecting an employee", async () => {
    await user.click(screen.getByRole("button", { name: /Associate/i }));
    expect(screen.getByText(/This field is required./i)).toBeInTheDocument();

    const search = screen.getByRole("searchbox", {
      name: /search for an employee/i,
    });

    await user.type(search, "John");
    await user.click(await screen.findByTestId("dropdownElement"));

    expect(
      screen.queryByText(/This field is required./i),
    ).not.toBeInTheDocument();
  });

  it("shows success notification when associating an employee", async () => {
    const search = screen.getByRole("searchbox", {
      name: /search for an employee/i,
    });

    await user.type(search, "John");
    await user.click(await screen.findByTestId("dropdownElement"));
    await user.click(screen.getByRole("button", { name: /Associate/i }));

    expect(
      await screen.findByText(
        "John Doe has been successfully associated with Test Instance.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("shows an error notification when association fails", async () => {
    const search = screen.getByRole("searchbox", {
      name: /search for an employee/i,
    });

    setEndpointStatus({
      status: "error",
      path: "associateEmployeeWithInstance",
    });

    await user.type(search, "John");
    await user.click(await screen.findByTestId("dropdownElement"));
    await user.click(screen.getByRole("button", { name: /Associate/i }));

    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });
});
