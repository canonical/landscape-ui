import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AddPublicationTargetForm from "./AddPublicationTargetForm";

// TODO: Add tests for Swift target type when Swift form support is implemented.

describe("AddPublicationTargetForm", () => {
  const user = userEvent.setup();

  it("renders all required S3 fields", () => {
    renderWithProviders(<AddPublicationTargetForm />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText(/region/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bucket name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/aws access key id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/aws secret access key/i)).toBeInTheDocument();
  });

  it("renders optional S3 fields", () => {
    renderWithProviders(<AddPublicationTargetForm />);

    expect(screen.getByLabelText(/endpoint/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prefix/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/acl/i)).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderWithProviders(<AddPublicationTargetForm />);

    expect(
      screen.getByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when required fields are empty on submit", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    expect(
      await screen.findAllByText(/this field is required/i),
    ).not.toHaveLength(0);
  });

  it("submits the form and shows success notification", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

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
      expect(screen.getByText("Publication target created")).toBeInTheDocument();
    });
  });

  it("includes optional fields in submission when all fields are provided", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.type(screen.getByLabelText("Name"), "Full Target");
    await user.type(screen.getByLabelText(/region/i), "us-east-1");
    await user.type(screen.getByLabelText(/bucket name/i), "my-bucket");
    await user.type(screen.getByLabelText(/endpoint/i), "https://s3.example.com");
    await user.type(
      screen.getByLabelText(/aws access key id/i),
      "AKIAIOSFODNN7EXAMPLE",
    );
    await user.type(
      screen.getByLabelText(/aws secret access key/i),
      "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    );
    await user.type(screen.getByLabelText(/prefix/i), "ubuntu/");
    await user.type(screen.getByLabelText(/^acl$/i), "private");
    await user.type(screen.getByLabelText(/storage class/i), "STANDARD");
    await user.type(screen.getByLabelText(/encryption method/i), "AES256");

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    await vi.waitFor(() => {
      expect(screen.getByText("Publication target created")).toBeInTheDocument();
    });
  });

  it("toggles the disable_multi_del checkbox", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    const checkbox = screen.getByRole("checkbox", { name: /disable multidel/i });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("toggles the force_sig_v2 checkbox", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    const checkbox = screen.getByRole("checkbox", {
      name: /force aws sigv2/i,
    });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});
