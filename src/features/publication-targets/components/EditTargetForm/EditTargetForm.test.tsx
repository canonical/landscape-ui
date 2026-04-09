import useSidePanel from "@/hooks/useSidePanel";
import { publicationTargets } from "@/tests/mocks/publication-targets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditTargetForm from "./EditTargetForm";

vi.mock("@/hooks/useSidePanel");

// TODO: Add tests for Swift target pre-population when Swift support is added to EditTargetForm.

const [s3Target] = publicationTargets;
if (!s3Target?.s3) {
  throw new Error("Test target does not have S3 configuration");
}

describe("EditTargetForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    (useSidePanel as Mock).mockReturnValue({
      setSidePanelContent: vi.fn(),
      closeSidePanel: vi.fn(),
    });
  });

  it("pre-populates the display_name field from the target prop", () => {
    renderWithProviders(<EditTargetForm target={s3Target} />);

    expect(screen.getByLabelText("Name")).toHaveValue(s3Target.display_name);
  });

  it("pre-populates S3 fields from the target prop", () => {
    renderWithProviders(<EditTargetForm target={s3Target} />);

    expect(screen.getByLabelText(/bucket name/i)).toHaveValue(
      s3Target.s3?.bucket,
    );
    expect(screen.getByLabelText(/aws access key id/i)).toHaveValue(
      s3Target.s3?.aws_access_key_id,
    );
    expect(screen.getByLabelText(/region/i)).toHaveValue(s3Target.s3?.region);
  });

  it("renders the save button", () => {
    renderWithProviders(<EditTargetForm target={s3Target} />);

    expect(
      screen.getByRole("button", { name: /save/i }),
    ).toBeInTheDocument();
  });

  it("submits the form and calls closeSidePanel on success", async () => {
    const { closeSidePanel } = useSidePanel();

    renderWithProviders(<EditTargetForm target={s3Target} />);

    await user.click(screen.getByRole("button", { name: /save/i }));

    await vi.waitFor(() => {
      expect(closeSidePanel).toHaveBeenCalled();
    });
  });
});
