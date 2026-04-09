import useSidePanel from "@/hooks/useSidePanel";
import { publicationTargetsWithPublications } from "@/tests/mocks/publication-targets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PublicationTargetListActions from "./PublicationTargetListActions";

vi.mock("@/hooks/useSidePanel");

const [target] = publicationTargetsWithPublications;
if (!target?.s3) {
  throw new Error("Test target does not have S3 configuration");
}

describe("PublicationTargetListActions", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    (useSidePanel as Mock).mockReturnValue({
      setSidePanelContent: vi.fn(),
      closeSidePanel: vi.fn(),
    });
  });

  it("renders the actions toggle button", () => {
    renderWithProviders(<PublicationTargetListActions target={target} />);

    expect(
      screen.getByRole("button", { name: `${target.display_name} actions` }),
    ).toBeInTheDocument();
  });

  it("shows View details, Edit, and Remove actions in the dropdown", async () => {
    renderWithProviders(<PublicationTargetListActions target={target} />);

    await user.click(
      screen.getByRole("button", { name: `${target.display_name} actions` }),
    );

    expect(
      await screen.findByRole("menuitem", { name: `View details for ${target.display_name}` }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("menuitem", { name: `Edit ${target.display_name}` }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("menuitem", { name: `Remove ${target.display_name}` }),
    ).toBeInTheDocument();
  });

  it("calls setSidePanelContent with the target display_name on View details", async () => {
    const { setSidePanelContent } = useSidePanel();

    renderWithProviders(<PublicationTargetListActions target={target} />);

    await user.click(
      screen.getByRole("button", { name: `${target.display_name} actions` }),
    );
    await user.click(
      await screen.findByRole("menuitem", {
        name: `View details for ${target.display_name}`,
      }),
    );

    expect(setSidePanelContent).toHaveBeenCalledWith(
      target.display_name,
      expect.anything(),
    );
  });

  it("calls setSidePanelContent with edit title on Edit", async () => {
    const { setSidePanelContent } = useSidePanel();

    renderWithProviders(<PublicationTargetListActions target={target} />);

    await user.click(
      screen.getByRole("button", { name: `${target.display_name} actions` }),
    );
    await user.click(
      await screen.findByRole("menuitem", { name: `Edit ${target.display_name}` }),
    );

    expect(setSidePanelContent).toHaveBeenCalledWith(
      `Edit "${target.display_name}"`,
      expect.anything(),
    );
  });

  it("calls setSidePanelContent with remove title on Remove", async () => {
    const { setSidePanelContent } = useSidePanel();

    renderWithProviders(<PublicationTargetListActions target={target} />);

    await user.click(
      screen.getByRole("button", { name: `${target.display_name} actions` }),
    );
    await user.click(
      await screen.findByRole("menuitem", { name: `Remove ${target.display_name}` }),
    );

    expect(setSidePanelContent).toHaveBeenCalledWith(
      `Remove "${target.display_name}"`,
      expect.anything(),
    );
  });
});
