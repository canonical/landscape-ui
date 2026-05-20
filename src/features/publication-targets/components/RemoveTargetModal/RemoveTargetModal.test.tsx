import { API_URL_DEB_ARCHIVE } from "@/constants";
import { publicationTargets } from "@/tests/mocks/publicationTargets";
import { publications } from "@/tests/mocks/publications";
import server from "@/tests/server";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import type { Mock } from "vitest";
import { describe, expect, it, vi, beforeEach } from "vitest";
import RemoveTargetModal from "./RemoveTargetModal";

vi.mock("../../api/useGetPublicationsByTarget", () => ({
  default: vi.fn(),
}));

import useGetPublicationsByTarget from "../../api/useGetPublicationsByTarget";

// Target with publications (prod-s3-us-east)
const [targetWithPublications, targetWithoutPublications] = publicationTargets;
if (!targetWithPublications || !targetWithoutPublications) {
  throw new Error("Test targets are missing");
}
if (!publications[0]) {
  throw new Error("Test publications are missing");
}

const [firstPublication] = publications;

const defaultClose = vi.fn();

describe("RemoveTargetModal", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    defaultClose.mockReset();
  });

  it("renders the irreversible warning", () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: publications,
      isGettingPublications: false,
    });

    renderWithProviders(
      <RemoveTargetModal
        isOpen={true}
        close={defaultClose}
        target={targetWithPublications}
      />,
    );

    expect(
      screen.getByText(/this action is irreversible/i),
    ).toBeInTheDocument();
  });

  it("renders Cancel and Remove target buttons", () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: publications,
      isGettingPublications: false,
    });

    renderWithProviders(
      <RemoveTargetModal
        isOpen={true}
        close={defaultClose}
        target={targetWithPublications}
      />,
    );

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove target/i }),
    ).toBeInTheDocument();
  });

  it("shows the publications table with explanatory text when target has publications", () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: publications,
      isGettingPublications: false,
    });

    renderWithProviders(
      <RemoveTargetModal
        isOpen={true}
        close={defaultClose}
        target={targetWithPublications}
      />,
    );

    expect(
      screen.getByText(/currently being used by the following publications/i),
    ).toBeInTheDocument();
    // publications table column header
    expect(screen.getByText("Publication")).toBeInTheDocument();
    // first publication's label
    expect(
      screen.getByText(firstPublication.displayName ?? ""),
    ).toBeInTheDocument();
  });

  it("hides the publications section when target has no publications", () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
    });

    renderWithProviders(
      <RemoveTargetModal
        isOpen={true}
        close={defaultClose}
        target={targetWithoutPublications}
      />,
    );

    expect(
      screen.queryByText(/currently being used by the following publications/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Publication")).not.toBeInTheDocument();
  });

  it("calls close when Cancel is clicked", async () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
    });

    renderWithProviders(
      <RemoveTargetModal
        isOpen={true}
        close={defaultClose}
        target={targetWithPublications}
      />,
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(defaultClose).toHaveBeenCalled();
  });

  it("submits the deletion after typing the confirmation text", async () => {
    server.use(
      http.delete(
        `${API_URL_DEB_ARCHIVE}publicationTargets/:id`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
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
      await screen.findByText(/successfully removed/i),
    ).toBeInTheDocument();
  });

  it("shows an error notification when deletion fails", async () => {
    server.use(
      http.delete(`${API_URL_DEB_ARCHIVE}publicationTargets/:id`, () =>
        HttpResponse.json({ message: "deletion failed" }, { status: 500 }),
      ),
    );

    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
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

    expect(await screen.findByText("deletion failed")).toBeInTheDocument();
  });

  it("does nothing on submit when target has no name", async () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
    });

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

    expect(screen.queryByText(/removed successfully/i)).not.toBeInTheDocument();
  });
});
