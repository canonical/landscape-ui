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

  it("does not render when closed", () => {
    const props: ComponentProps<typeof RepublishPublicationModal> = {
      close: vi.fn(),
      isOpen: false,
      publication,
    };

    renderWithProviders(<RepublishPublicationModal {...props} />);

    expect(
      screen.queryByRole("heading", { name: `Republish ${publication.name}` }),
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
        `Publication "${publication.name}" has been queued for republishing.`,
      ),
    ).toBeInTheDocument();
  });

  it("shows an error notification when republish fails", async () => {
    const props: ComponentProps<typeof RepublishPublicationModal> = {
      close: vi.fn(),
      isOpen: true,
      publication,
    };

    setEndpointStatus({ status: "error", path: "RepublishPublication" });

    renderWithProviders(<RepublishPublicationModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Republish" }));

    expect(props.close).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText("Failed to republish publication"),
    ).toBeInTheDocument();
  });
});
