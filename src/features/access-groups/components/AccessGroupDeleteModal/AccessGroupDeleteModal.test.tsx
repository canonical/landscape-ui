import { setEndpointStatus } from "@/tests/controllers/controller";
import { LocationDisplay, getLocationDisplay } from "@/tests/LocationDisplay";
import { accessGroups } from "@/tests/mocks/accessGroup";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AccessGroupDeleteModal from "./AccessGroupDeleteModal";

const handleClose = vi.fn();
const [accessGroup] = accessGroups;

describe("AccessGroupDeleteModal", () => {
  beforeEach(() => {
    handleClose.mockClear();
  });

  it("should render with required text input and default warning", async () => {
    const emptyAccessGroup = accessGroups.find(
      (value) => value.name === "empty-access-group",
    );
    assert(emptyAccessGroup);

    renderWithProviders(
      <AccessGroupDeleteModal
        accessGroup={emptyAccessGroup}
        opened
        close={handleClose}
        parentAccessGroupTitle={emptyAccessGroup.parent}
      />,
    );

    expect(
      await screen.findByRole("button", { name: "Delete" }),
    ).toHaveAttribute("aria-disabled", "true");

    await screen.findByText(/profiles may be associated/i);

    await userEvent.type(
      screen.getByRole("textbox"),
      `delete ${emptyAccessGroup.title}`,
    );

    const button = await screen.findByRole("button", { name: "Delete" });
    expect(button).not.toHaveAttribute("aria-disabled");
    expect(button).toBeEnabled();

    await userEvent.click(
      await screen.findByRole("button", { name: "Delete" }),
    );

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("should render a specific warning for affected instances", async () => {
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
    const singleAccessGroup = accessGroups.find(
      (value) => value.name === "singular-access-group",
    );
    assert(singleAccessGroup);

    renderWithProviders(
      <AccessGroupDeleteModal
        accessGroup={singleAccessGroup}
        opened
        close={handleClose}
        parentAccessGroupTitle={singleAccessGroup.parent}
      />,
    );

    await screen.findByText(/is associated with 1 instance/i);
    await screen.findByText(/move it to the parent access group/i);
    await screen.findByText(/applied to this instance/i);
  });

  it("should close the side panel and show a success notification on successful deletion", async () => {
    renderWithProviders(
      <>
        <AccessGroupDeleteModal
          accessGroup={accessGroup}
          opened
          close={handleClose}
          parentAccessGroupTitle={accessGroup.parent}
        />
        <LocationDisplay />
      </>,
      undefined,
      "/?sidePath=view",
    );

    await userEvent.type(
      screen.getByRole("textbox"),
      `delete ${accessGroup.title}`,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: "Delete" }),
    );

    expect(
      await screen.findByText(
        `You have successfully deleted the "${accessGroup.title}" access group.`,
      ),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    });

    expect(getLocationDisplay()).not.toHaveTextContent("sidePath");
  });

  it("should show an error notification when deletion fails", async () => {
    setEndpointStatus({ status: "error", path: "RemoveAccessGroup" });

    renderWithProviders(
      <AccessGroupDeleteModal
        accessGroup={accessGroup}
        opened
        close={handleClose}
        parentAccessGroupTitle={accessGroup.parent}
      />,
    );

    await userEvent.type(
      screen.getByRole("textbox"),
      `delete ${accessGroup.title}`,
    );

    await userEvent.click(
      await screen.findByRole("button", { name: "Delete" }),
    );

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
