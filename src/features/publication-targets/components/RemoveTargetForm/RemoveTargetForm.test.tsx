import useSidePanel from "@/hooks/useSidePanel";
import { publicationTargetsWithPublications } from "@/tests/mocks/publication-targets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RemoveTargetForm from "./RemoveTargetForm";

vi.mock("@/hooks/useSidePanel");

// Target with publications (prod-s3-us-east)
const [targetWithPublications, targetWithoutPublications] = publicationTargetsWithPublications;
if (!targetWithPublications?.publications 
    || !targetWithoutPublications
    || !targetWithPublications.publications[0]) {
  throw new Error("Test target does not have S3 configuration");
}

const [firstPublication] = targetWithPublications.publications;


describe("RemoveTargetForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    (useSidePanel as Mock).mockReturnValue({
      setSidePanelContent: vi.fn(),
      closeSidePanel: vi.fn(),
    });
  });

  it("renders the irreversible warning", () => {
    renderWithProviders(<RemoveTargetForm target={targetWithPublications} />);

    expect(screen.getByText(/this action is irreversible/i)).toBeInTheDocument();
  });

  it("renders Cancel and Remove target buttons", () => {
    renderWithProviders(<RemoveTargetForm target={targetWithPublications} />);

    expect(
      screen.getByRole("button", { name: /cancel/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /remove target/i }),
    ).toBeInTheDocument();
  });

  it("shows the publications table with explanatory text when target has publications", () => {
    renderWithProviders(<RemoveTargetForm target={targetWithPublications} />);

    expect(
      screen.getByText(/currently being used by the following publications/i),
    ).toBeInTheDocument();
    // publications table column header
    expect(screen.getByText("Publication")).toBeInTheDocument();
    // first publication's display_name
    expect(
      screen.getByText(firstPublication.display_name),
    ).toBeInTheDocument();
  });

  it("hides the publications section when target has no publications", () => {
    renderWithProviders(
      <RemoveTargetForm target={targetWithoutPublications} />,
    );

    expect(
      screen.queryByText(/currently being used by the following publications/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Publication")).not.toBeInTheDocument();
  });

  it("calls closeSidePanel when Cancel is clicked", async () => {
    const { closeSidePanel } = useSidePanel();

    renderWithProviders(<RemoveTargetForm target={targetWithPublications} />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(closeSidePanel).toHaveBeenCalled();
  });

  it("immediately submits the deletion on Remove target click without a second confirmation step", async () => {
    // TODO: If a confirmation step is added before deletion, update this test
    // to interact with the confirmation UI before asserting success.
    renderWithProviders(<RemoveTargetForm target={targetWithPublications} />);

    await user.click(screen.getByRole("button", { name: /remove target/i }));

    expect(
      await screen.findByText(/publication target removed successfully/i),
    ).toBeInTheDocument();
  });
});
