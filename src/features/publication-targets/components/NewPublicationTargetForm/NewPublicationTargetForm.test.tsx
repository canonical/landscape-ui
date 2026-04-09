import useSidePanel from "@/hooks/useSidePanel";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NewPublicationTargetForm from "./NewPublicationTargetForm";

vi.mock("@/hooks/useSidePanel");

// TODO: Add tests for Swift target type when Swift form support is implemented.

describe("NewPublicationTargetForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    (useSidePanel as Mock).mockReturnValue({
      setSidePanelContent: vi.fn(),
      closeSidePanel: vi.fn(),
    });
  });

  it("renders all required S3 fields", () => {
    renderWithProviders(<NewPublicationTargetForm />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText(/region/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bucket name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/aws access key id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/aws secret access key/i)).toBeInTheDocument();
  });

  it("renders optional S3 fields", () => {
    renderWithProviders(<NewPublicationTargetForm />);

    expect(screen.getByLabelText(/endpoint/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prefix/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/acl/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderWithProviders(<NewPublicationTargetForm />);

    expect(
      screen.getByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when required fields are empty on submit", async () => {
    renderWithProviders(<NewPublicationTargetForm />);

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    expect(
      await screen.findAllByText(/this field is required/i),
    ).not.toHaveLength(0);
  });

  it("submits the form and calls closeSidePanel on success", async () => {
    const { closeSidePanel } = useSidePanel();

    renderWithProviders(<NewPublicationTargetForm />);

    await user.type(screen.getByLabelText("Name"), "My New Target");
    await user.type(screen.getByLabelText(/bucket name/i), "my-bucket");
    await user.type(
      screen.getByLabelText(/aws access key id/i),
      "AKIAIOSFODNN7EXAMPLE",
    );
    await user.type(
      screen.getByLabelText(/aws secret access key/i),
      "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    );

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    await vi.waitFor(() => {
      expect(closeSidePanel).toHaveBeenCalled();
    });
  });
});
