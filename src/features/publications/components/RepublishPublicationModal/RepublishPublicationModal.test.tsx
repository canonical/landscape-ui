import { publications } from "@/tests/mocks/publications";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import RepublishPublicationModal from "./RepublishPublicationModal";

describe("RepublishPublicationModal", () => {
  const user = userEvent.setup();
  const [publication] = publications;
  const publicationLabel = publication.name;

  it("does not render when closed", () => {
    const props: ComponentProps<typeof RepublishPublicationModal> = {
      close: vi.fn(),
      isOpen: false,
      publication,
    };

    renderWithProviders(<RepublishPublicationModal {...props} />);

    expect(
      screen.queryByRole("heading", { name: `Republish ${publicationLabel}` }),
    ).not.toBeInTheDocument();
  });

  it("republishes a publication and closes modal", async () => {
    const props: ComponentProps<typeof RepublishPublicationModal> = {
      close: vi.fn(),
      isOpen: true,
      publication,
    };

    renderWithProviders(<RepublishPublicationModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Republish" }));

    expect(props.close).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText("Publication republished"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `Publication "${publicationLabel}" has been queued for republishing.`,
      ),
    ).toBeInTheDocument();
  });

  it("shows an error notification when republish fails", async () => {
    const props: ComponentProps<typeof RepublishPublicationModal> = {
      close: vi.fn(),
      isOpen: true,
      publication,
    };

    setEndpointStatus({ status: "error", path: "v1/publications/publish" });

    renderWithProviders(<RepublishPublicationModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Republish" }));

    expect(props.close).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText("Failed to republish publication"),
    ).toBeInTheDocument();
  });
});
