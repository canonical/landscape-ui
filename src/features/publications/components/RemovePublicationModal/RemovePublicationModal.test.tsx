import { publications } from "@/tests/mocks/publications";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import RemovePublicationModal from "./RemovePublicationModal";

describe("RemovePublicationModal", () => {
  const user = userEvent.setup();
  const [publication] = publications;

  it("does not render when closed", () => {
    const props: ComponentProps<typeof RemovePublicationModal> = {
      close: vi.fn(),
      isOpen: false,
      publication,
    };

    renderWithProviders(<RemovePublicationModal {...props} />);

    expect(
      screen.queryByRole("heading", { name: "Remove publication" }),
    ).not.toBeInTheDocument();
  });

  it("removes a publication and closes modal", async () => {
    const props: ComponentProps<typeof RemovePublicationModal> = {
      close: vi.fn(),
      isOpen: true,
      publication,
    };

    renderWithProviders(<RemovePublicationModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Remove" }));

    expect(props.close).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("Publication removed")).toBeInTheDocument();
    expect(
      screen.getByText(`Publication "${publication.name}" has been removed.`),
    ).toBeInTheDocument();
  });

  it("shows an error notification when removing fails", async () => {
    const props: ComponentProps<typeof RemovePublicationModal> = {
      close: vi.fn(),
      isOpen: true,
      publication,
    };

    setEndpointStatus({ status: "error", path: "RemovePublication" });

    renderWithProviders(<RemovePublicationModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Remove" }));

    expect(props.close).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByText("Failed to remove publication"),
    ).toBeInTheDocument();
  });
});
