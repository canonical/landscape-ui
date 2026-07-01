import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import { Suspense } from "react";
import SidePanel from "@/components/layout/SidePanel";
import EditLocalRepositorySidePanel from "./EditLocalRepositorySidePanel";
import { screen } from "@testing-library/react";
import { expectLoadingState } from "@/tests/helpers";
import userEvent from "@testing-library/user-event";
import { repositories } from "@/tests/mocks/localRepositories";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { setEndpointStatus } from "@/tests/controllers/controller";

const [repository] = repositories;
const ROUTE_PATH = `?sidePath=edit&name=${repository.localId}`;

const renderComponent = () =>
  renderWithProviders(
    <Suspense fallback={<SidePanel.LoadingState />}>
      <EditLocalRepositorySidePanel />
    </Suspense>,
    undefined,
    ROUTE_PATH,
  );

describe("EditLocalRepositorySidePanel", () => {
  it("renders header with repository name and form buttons", async () => {
    renderComponent();

    expect(
      await screen.findByText(`Edit ${repository.displayName}`),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });

  it("renders form with repository data", async () => {
    renderComponent();

    await expectLoadingState();

    expect(screen.getByLabelText(/name/i)).toHaveValue(repository.displayName);
    expect(screen.getByLabelText(/description/i)).toHaveValue("");

    expect(
      screen.getByText(repository.defaultDistribution),
    ).toBeInTheDocument();
    expect(screen.getByText(repository.defaultComponent)).toBeInTheDocument();
  });

  it("submits form with updated data", async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = await screen.findByDisplayValue(repository.displayName);
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Repository");

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(
        "You have successfully edited Updated Repository",
      ),
    ).toBeInTheDocument();
  });

  it("validates required name field", async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = await screen.findByLabelText(/name/i);
    await user.clear(nameInput);

    const submitButton = screen.getByRole("button", { name: /save changes/i });
    await user.click(submitButton);

    expect(
      await screen.findByText(/this field is required/i),
    ).toBeInTheDocument();
  });

  it("shows an error notification when editing a repository fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({ path: "locals", status: "error" });

    renderComponent();

    const submitButton = await screen.findByRole("button", {
      name: /save changes/i,
    });
    await user.click(submitButton);

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: `You have successfully edited ${repository.displayName}`,
      }),
    ).not.toBeInTheDocument();
  });
});
