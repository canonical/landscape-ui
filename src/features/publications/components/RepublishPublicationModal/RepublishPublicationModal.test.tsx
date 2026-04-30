import { setEndpointStatus } from "@/tests/controllers/controller";
import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import RepublishPublicationModal from "./RepublishPublicationModal";

describe("RepublishPublicationModal", () => {
  const user = userEvent.setup();
  const [publication] = publications;
  const publicationLabel = publication.displayName;

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
      await screen.findByText(
        `You have marked ${publicationLabel} to be republished`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "This publication has been queued for republishing to the designated target.",
      ),
    ).toBeInTheDocument();
  });

  it("shows an error notification when republish fails", async () => {
    const props: ComponentProps<typeof RepublishPublicationModal> = {
      close: vi.fn(),
      isOpen: true,
      publication,
    };

    setEndpointStatus({ status: "error", path: "publications/publish" });

    renderWithProviders(<RepublishPublicationModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Republish" }));

    expect(props.close).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
