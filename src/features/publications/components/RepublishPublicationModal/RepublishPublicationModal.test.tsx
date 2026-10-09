import { setEndpointStatus } from "@/tests/controllers/controller";
import { publications } from "@/tests/mocks/publications";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import RepublishPublicationModal from "./RepublishPublicationModal";

describe("RepublishPublicationModal", () => {
  const user = userEvent.setup();
  const [publication] = publications;
  const publicationLabel = publication.displayName;

  const props = {
    close: vi.fn(),
    isOpen: true,
    isPublishing: false,
    publication,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setEndpointStatus("default");
  });

  it("does not render when closed", () => {
    renderWithProviders(
      <RepublishPublicationModal {...props} isOpen={false} />,
    );

    expect(
      screen.queryByRole("heading", { name: `Republish ${publicationLabel}` }),
    ).not.toBeInTheDocument();
  });

  it("republishes a publication and closes modal", async () => {
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
        "An activity has been queued to republish it to the designated target.",
      ),
    ).toBeInTheDocument();
  });

  it("shows an error notification when republish fails", async () => {
    setEndpointStatus({ status: "error", path: "publications" });

    renderWithProviders(<RepublishPublicationModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Republish" }));

    expect(props.close).not.toHaveBeenCalled();
    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });

  it("shows an error notification when cancelation fails", async () => {
    setEndpointStatus({ status: "error", path: "operations/cancel" });

    renderWithProviders(
      <RepublishPublicationModal {...props} isPublishing={true} />,
    );

    await user.click(screen.getByRole("button", { name: /start new/i }));

    expect(props.close).not.toHaveBeenCalled();
    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });

  it("confirms cancelling an ongoing publication before showing the republish step", async () => {
    renderWithProviders(
      <RepublishPublicationModal {...props} isPublishing={true} />,
    );

    expect(
      screen.getByRole("heading", {
        name: `${publicationLabel} is already being published`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: `Republish ${publicationLabel}` }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /cancel and start new republication/i,
      }),
    );

    expect(
      await screen.findByText(
        `You have marked ${publicationLabel} to be republished`,
      ),
    ).toBeInTheDocument();

    expect(props.close).toHaveBeenCalledTimes(1);
  });
});
