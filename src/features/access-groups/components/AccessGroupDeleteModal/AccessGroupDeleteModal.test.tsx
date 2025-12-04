import { accessGroups } from "@/tests/mocks/accessGroup";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AccessGroupDeleteModal from "./AccessGroupDeleteModal";

const handleClose = vi.fn();

describe("AccessGroupDeleteModal", () => {
  it("should render with required text input and default warning", async () => {
    const [, accessGroup] = accessGroups;

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

    await screen.findByTestId("default-access-group-warning");

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

    await screen.findByTestId("affected-instances-warning");
  });
});
