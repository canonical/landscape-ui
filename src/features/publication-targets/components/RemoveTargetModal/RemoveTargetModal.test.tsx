import { setEndpointStatus } from "@/tests/controllers/controller";
import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RemoveTargetModal from "./RemoveTargetModal";

const targetWithPublications = publicationTargets.find((target) =>
  publications.some(
    ({ publicationTarget }) => publicationTarget === target.name,
  ),
);
const targetWithoutPublications = publicationTargets.find(
  (target) =>
    !publications.some(
      ({ publicationTarget }) => publicationTarget === target.name,
    ),
);
const [firstPublication] = publications;

assert(targetWithPublications, "Expected publication target test fixture");
assert(targetWithoutPublications, "Expected publication target test fixture");
assert(firstPublication, "Expected publication target test fixture");

const defaultClose = vi.fn();

describe("RemoveTargetModal", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    defaultClose.mockReset();
    setEndpointStatus("default");
  });

  it("renders the irreversible warning", async () => {
    renderWithProviders(
      <RemoveTargetModal
        isOpen={true}
        close={defaultClose}
        target={targetWithPublications}
      />,
    );

    expect(
      await screen.findByText(/this action is irreversible/i),
    ).toBeInTheDocument();
  });

  it("renders Cancel and Remove target buttons", async () => {
    renderWithProviders(
      <RemoveTargetModal
        isOpen={true}
        close={defaultClose}
        target={targetWithPublications}
      />,
    );

    expect(
      await screen.findByRole("button", { name: /cancel/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove target/i }),
    ).toBeInTheDocument();
  });

  it("shows the publications table with explanatory text when target has publications", async () => {
    renderWithProviders(
      <RemoveTargetModal
        isOpen={true}
        close={defaultClose}
        target={targetWithPublications}
      />,
    );

    expect(
      await screen.findByText(
        /currently being used by the following publications/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Publication")).toBeInTheDocument();
    expect(
      screen.getByText(firstPublication.displayName ?? ""),
    ).toBeInTheDocument();
  });

  it("hides the publications section when target has no publications", async () => {
    renderWithProviders(
      <RemoveTargetModal
        isOpen={true}
        close={defaultClose}
        target={targetWithoutPublications}
      />,
    );

    expect(
      await screen.findByText(/this action is irreversible/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/currently being used by the following publications/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Publication")).not.toBeInTheDocument();
  });

  it("calls close when Cancel is clicked", async () => {
    renderWithProviders(
      <RemoveTargetModal
        isOpen={true}
        close={defaultClose}
        target={targetWithPublications}
      />,
    );

    await user.click(await screen.findByRole("button", { name: /cancel/i }));

    expect(defaultClose).toHaveBeenCalled();
  });

  it("submits the deletion after typing the confirmation text", async () => {
    renderWithProviders(
      <RemoveTargetModal
        isOpen={true}
        close={defaultClose}
        target={targetWithPublications}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(
        `remove ${targetWithPublications.displayName}`,
      ),
      `remove ${targetWithPublications.displayName}`,
    );
    await user.click(screen.getByRole("button", { name: /remove target/i }));

    expect(
      await screen.findByText(
        `You have successfully removed ${targetWithPublications.displayName}`,
      ),
    ).toBeInTheDocument();
  });

  it("shows an error notification when deletion fails", async () => {
    setEndpointStatus({
      status: "error",
      path: "publicationTargets/delete",
    });

    renderWithProviders(
      <RemoveTargetModal
        isOpen={true}
        close={defaultClose}
        target={targetWithPublications}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(
        `remove ${targetWithPublications.displayName}`,
      ),
      `remove ${targetWithPublications.displayName}`,
    );
    await user.click(screen.getByRole("button", { name: /remove target/i }));

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });

  it("does nothing on submit when target has no name", async () => {
    const targetWithoutName = { ...targetWithPublications, name: "" };

    renderWithProviders(
      <RemoveTargetModal
        isOpen={true}
        close={defaultClose}
        target={targetWithoutName}
      />,
    );

    await user.type(
      screen.getByPlaceholderText(`remove ${targetWithoutName.displayName}`),
      `remove ${targetWithoutName.displayName}`,
    );
    await user.click(screen.getByRole("button", { name: /remove target/i }));

    expect(
      screen.queryByText(
        `You have successfully removed ${targetWithoutName.displayName}`,
      ),
    ).not.toBeInTheDocument();
  });
});
