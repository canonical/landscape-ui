import { accessGroups } from "@/tests/mocks/accessGroup";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AccessGroupDeleteModal from "./AccessGroupDeleteModal";

const handleClose = vi.fn();

describe("AccessGroupDeleteModal", () => {
  it("should render with required text input and default warning", async () => {
    const [accessGroup] = accessGroups.filter(
      (value) => value.name == "empty-access-group",
    );

    renderWithProviders(
      <AccessGroupDeleteModal
        accessGroup={accessGroup}
        opened
        close={handleClose}
        parentAccessGroupTitle={accessGroup.parent}
      />,
    );

    expect(
      await screen.findByRole("button", { name: "Delete" }),
    ).toBeDisabled();

    await screen.findByText(/profiles may be associated/i);

    await userEvent.type(
      screen.getByRole("textbox"),
      `delete ${accessGroup.title}`,
    );

    expect(await screen.findByRole("button", { name: "Delete" })).toBeEnabled();

    await userEvent.click(
      await screen.findByRole("button", { name: "Delete" }),
    );

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("should render a specific warning for affected instances", async () => {
    const [accessGroup] = accessGroups;

    renderWithProviders(
      <AccessGroupDeleteModal
        accessGroup={accessGroup}
        opened
        close={handleClose}
        parentAccessGroupTitle={accessGroup.parent}
      />,
    );

    await screen.findByText(/is associated with [0-9]+ instances/i);
    await screen.findByText(/move them to the parent access group/i);
    await screen.findByText(/applied to these instances/i);
  });

  it("should render a specific warning for a single affected instance", async () => {
    const [accessGroup] = accessGroups.filter(
      (value) => value.name == "singular-access-group",
    );

    renderWithProviders(
      <AccessGroupDeleteModal
        accessGroup={accessGroup}
        opened
        close={handleClose}
        parentAccessGroupTitle={accessGroup.parent}
      />,
    );

    await screen.findByText(/is associated with 1 instance/i);
    await screen.findByText(/move it to the parent access group/i);
    await screen.findByText(/applied to this instance/i);
  });
});
