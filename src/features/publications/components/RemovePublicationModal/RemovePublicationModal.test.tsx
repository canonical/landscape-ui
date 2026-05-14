import { publications } from "@/tests/mocks/publications";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import RemovePublicationModal from "./RemovePublicationModal";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";

describe("RemovePublicationModal", () => {
  const user = userEvent.setup();
  const [publication] = publications;
  const publicationLabel = publication.displayName;

  it("does not render when closed", () => {
    const props: ComponentProps<typeof RemovePublicationModal> = {
      close: vi.fn(),
      isOpen: false,
      publication,
    };

    renderWithProviders(<RemovePublicationModal {...props} />);

    expect(
      screen.queryByRole("heading", { name: `Remove ${publicationLabel}` }),
    ).not.toBeInTheDocument();
  });

  it("removes a publication and closes modal", async () => {
    const props: ComponentProps<typeof RemovePublicationModal> = {
      close: vi.fn(),
      isOpen: true,
      publication,
    };

    renderWithProviders(<RemovePublicationModal {...props} />);

    await user.click(
      screen.getByRole("button", { name: "Remove publication" }),
    );

    expect(props.close).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText(
        `You have successfully removed ${publicationLabel}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("The publication has been removed from Landscape."),
    ).toBeInTheDocument();
  });

  it("shows an error notification when removing fails", async () => {
    const props: ComponentProps<typeof RemovePublicationModal> = {
      close: vi.fn(),
      isOpen: true,
      publication,
    };

    setEndpointStatus({ status: "error", path: "/publications" });

    renderWithProviders(<RemovePublicationModal {...props} />);

    await user.click(
      screen.getByRole("button", { name: "Remove publication" }),
    );

    expect(props.close).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
