import useSidePanel from "@/hooks/useSidePanel";
import useDebug from "@/hooks/useDebug";
import { publicationTargets, publications } from "@/tests/mocks/publication-targets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { describe, expect, it, vi, beforeEach } from "vitest";
import RemoveTargetForm from "./RemoveTargetForm";

vi.mock("@/hooks/useSidePanel");
vi.mock("@/hooks/useDebug");
vi.mock("@/features/publication-targets/api/useRemovePublicationTarget", () => ({
  default: vi.fn(() => ({
    removePublicationTargetQuery: {
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    },
  })),
}));
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

describe("RemoveTargetForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    (useSidePanel as Mock).mockReturnValue({
      setSidePanelContent: vi.fn(),
      closeSidePanel: vi.fn(),
    });
    (useDebug as Mock).mockReturnValue(vi.fn());
  });

  it("renders the irreversible warning", () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: publications,
      isGettingPublications: false,
    });

    renderWithProviders(<RemoveTargetForm target={targetWithPublications} />);

    expect(screen.getByText(/this action is irreversible/i)).toBeInTheDocument();
  });

  it("renders Cancel and Remove target buttons", () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: publications,
      isGettingPublications: false,
    });

    renderWithProviders(<RemoveTargetForm target={targetWithPublications} />);

    expect(
      screen.getByRole("button", { name: /cancel/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove target/i }),
    ).toBeInTheDocument();
  });

  it("shows the publications table with explanatory text when target has publications", () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: publications,
      isGettingPublications: false,
    });

    renderWithProviders(<RemoveTargetForm target={targetWithPublications} />);

    expect(
      screen.getByText(/currently being used by the following publications/i),
    ).toBeInTheDocument();
    // publications table column header
    expect(screen.getByText("Publication")).toBeInTheDocument();
    // first publication's label
    expect(
      screen.getByText(firstPublication.label ?? ""),
    ).toBeInTheDocument();
  });

  it("hides the publications section when target has no publications", () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
    });

    renderWithProviders(
      <RemoveTargetForm target={targetWithoutPublications} />,
    );

    expect(
      screen.queryByText(/currently being used by the following publications/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Publication")).not.toBeInTheDocument();
  });

  it("calls closeSidePanel when Cancel is clicked", async () => {
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
    });

    const { closeSidePanel } = useSidePanel();

    renderWithProviders(<RemoveTargetForm target={targetWithPublications} />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(closeSidePanel).toHaveBeenCalled();
  });

  it("immediately submits the deletion on Remove target click without a second confirmation step", async () => {
    // TODO: If a confirmation step is added before deletion, update this test
    // to interact with the confirmation UI before asserting success.
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
    });

    renderWithProviders(<RemoveTargetForm target={targetWithPublications} />);

    await user.click(screen.getByRole("button", { name: /remove target/i }));

    expect(
      await screen.findByText(/publication target removed successfully/i),
    ).toBeInTheDocument();
  });

  it("calls debug when deletion fails with an error", async () => {
    const mockDebug = vi.fn();
    (useDebug as Mock).mockReturnValue(mockDebug);
    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
    });

    // Override the mutation to reject, simulating an API error
    const { default: useRemovePublicationTarget } = await import(
      "@/features/publication-targets/api/useRemovePublicationTarget"
    );
    vi.mocked(useRemovePublicationTarget).mockImplementation(() => ({
      removePublicationTargetQuery: {
        mutateAsync: vi.fn().mockRejectedValue(
          new Error("API error: deletion failed"),
        ),
        isPending: false,
      },
    } as never));

    renderWithProviders(<RemoveTargetForm target={targetWithPublications} />);

    await user.click(screen.getByRole("button", { name: /remove target/i }));

    // Verify the error handler was invoked with the error
    await vi.waitFor(() => {
      expect(mockDebug).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it("does nothing on submit when target has no name", async () => {
    const mockRemoveTarget = vi.fn();
    const { default: useRemovePublicationTarget } = await import(
      "@/features/publication-targets/api/useRemovePublicationTarget"
    );
    vi.mocked(useRemovePublicationTarget).mockImplementation(() => ({
      removePublicationTargetQuery: {
        mutateAsync: mockRemoveTarget,
        isPending: false,
      },
    } as never));

    (useGetPublicationsByTarget as Mock).mockReturnValue({
      publications: [],
      isGettingPublications: false,
    });

    const targetWithoutName = { ...targetWithPublications, name: "" };

    renderWithProviders(<RemoveTargetForm target={targetWithoutName} />);

    await user.click(screen.getByRole("button", { name: /remove target/i }));

    expect(mockRemoveTarget).not.toHaveBeenCalled();
  });
});
