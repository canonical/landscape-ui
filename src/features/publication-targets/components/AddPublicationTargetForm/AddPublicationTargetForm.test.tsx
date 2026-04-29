import { API_URL_DEB_ARCHIVE } from "@/constants";
import server from "@/tests/server";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import AddPublicationTargetForm from "./AddPublicationTargetForm";

describe("AddPublicationTargetForm", () => {
  const user = userEvent.setup();

  it("renders the type selector with S3, Swift and Filesystem options", () => {
    renderWithProviders(<AddPublicationTargetForm />);

    const select = screen.getByLabelText(/^type$/i);
    expect(select).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "S3" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Swift" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Filesystem" }),
    ).toBeInTheDocument();
  });

  it("shows S3 fields by default", () => {
    renderWithProviders(<AddPublicationTargetForm />);

    expect(screen.getByLabelText(/region/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bucket name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/aws access key id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/aws secret access key/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/container/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^path$/i)).not.toBeInTheDocument();
  });

  it("switches to Swift fields when Swift type is selected", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "swift");

    expect(screen.getByLabelText(/container/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^username$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/auth url/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/region/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^path$/i)).not.toBeInTheDocument();
  });

  it("switches to Filesystem fields when Filesystem type is selected", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "filesystem");

    expect(screen.getByLabelText(/^path$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/link method/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/region/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/container/i)).not.toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderWithProviders(<AddPublicationTargetForm />);

    expect(
      screen.getByRole("button", { name: /add publication target/i }),
    ).toBeInTheDocument();
  });

  it("shows S3 validation errors when required fields are empty on submit", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    expect(
      await screen.findAllByText(/this field is required/i),
    ).not.toHaveLength(0);
  });

  it("shows Swift validation errors when required Swift fields are empty", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "swift");
    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    expect(
      await screen.findAllByText(/this field is required/i),
    ).not.toHaveLength(0);
  });

  it("shows Filesystem validation error when path is empty", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "filesystem");
    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    expect(
      await screen.findAllByText(/this field is required/i),
    ).not.toHaveLength(0);
  });

  it("submits S3 form and shows success notification", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.type(screen.getByLabelText("Name"), "My S3 Target");
    await user.type(screen.getByLabelText(/region/i), "us-east-1");
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
      expect(
        screen.getByText("Publication target created"),
      ).toBeInTheDocument();
    });
  });

  it("submits Swift form and shows success notification", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "swift");
    await user.type(screen.getByLabelText("Name"), "My Swift Target");
    await user.type(screen.getByLabelText(/container/i), "my-container");
    await user.type(screen.getByLabelText(/^username$/i), "admin");
    await user.type(
      screen.getByLabelText(/^password$/i),
      "secret",
    );
    await user.type(
      screen.getByLabelText(/auth url/i),
      "https://keystone.example.com/v3",
    );

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    await vi.waitFor(() => {
      expect(screen.getByText("Publication target created")).toBeInTheDocument();
    });
  });

  it("submits Filesystem form and shows success notification", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "filesystem");
    await user.type(screen.getByLabelText("Name"), "My Filesystem Target");
    await user.type(
      screen.getByLabelText(/^path$/i),
      "/srv/landscape/archives",
    );

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    await vi.waitFor(() => {
      expect(screen.getByText("Publication target created")).toBeInTheDocument();
    });
  });

  it("toggles the disable MultiDel checkbox on S3 form", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    const checkbox = screen.getByRole("checkbox", {
      name: /disable multidel/i,
    });
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("resets type-specific fields when switching type", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.type(screen.getByLabelText(/region/i), "us-east-1");
    await user.selectOptions(screen.getByLabelText(/^type$/i), "swift");
    await user.selectOptions(screen.getByLabelText(/^type$/i), "s3");

    expect(screen.getByLabelText(/region/i)).toHaveValue("");
  });

  it("clears Swift fields when switching from Swift to S3", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "swift");
    await user.type(screen.getByLabelText(/container/i), "my-container");
    await user.selectOptions(screen.getByLabelText(/^type$/i), "s3");
    await user.selectOptions(screen.getByLabelText(/^type$/i), "swift");

    expect(screen.getByLabelText(/container/i)).toHaveValue("");
  });

  it("clears Filesystem path when switching from Filesystem to Swift", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "filesystem");
    await user.type(screen.getByLabelText(/^path$/i), "/some/path");
    await user.selectOptions(screen.getByLabelText(/^type$/i), "swift");
    await user.selectOptions(screen.getByLabelText(/^type$/i), "filesystem");

    expect(screen.getByLabelText(/^path$/i)).toHaveValue("");
  });

  it("shows 'Path must start with /' error when path lacks a leading slash", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "filesystem");
    await user.type(screen.getByLabelText(/^path$/i), "no-leading-slash");
    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    expect(
      await screen.findByText(/path must start with \//i),
    ).toBeInTheDocument();
  });

  it("clears path error once a valid path with a leading slash is entered", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "filesystem");
    await user.type(screen.getByLabelText(/^path$/i), "no-leading-slash");
    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );
    await screen.findByText(/path must start with \//i);

    await user.clear(screen.getByLabelText(/^path$/i));
    await user.type(screen.getByLabelText(/^path$/i), "/valid/path");

    expect(
      screen.queryByText(/path must start with \//i),
    ).not.toBeInTheDocument();
  });

  it("shows filesystem path help text when there is no validation error", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "filesystem");

    expect(
      screen.getByText(/file system path starting with \//i),
    ).toBeInTheDocument();
  });

  it("hides filesystem path help text when a validation error is present", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "filesystem");
    await user.type(screen.getByLabelText(/^path$/i), "no-leading-slash");
    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );
    await screen.findByText(/path must start with \//i);

    expect(
      screen.queryByText(/file system path starting with \//i),
    ).not.toBeInTheDocument();
  });

  it("renders optional Swift fields when Swift type is selected", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "swift");

    expect(screen.getByLabelText("Tenant")).toBeInTheDocument();
    expect(screen.getByLabelText("Tenant ID")).toBeInTheDocument();
    expect(screen.getByLabelText("OpenStack domain name")).toBeInTheDocument();
    expect(screen.getByLabelText("OpenStack domain ID")).toBeInTheDocument();
    expect(screen.getByLabelText("OpenStack tenant domain")).toBeInTheDocument();
    expect(
      screen.getByLabelText("OpenStack tenant domain ID"),
    ).toBeInTheDocument();
  });

  it("accepts input in optional Swift fields", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "swift");
    await user.type(screen.getByLabelText("Tenant"), "my-tenant");
    await user.type(screen.getByLabelText("Tenant ID"), "tenant-123");

    expect(screen.getByLabelText("Tenant")).toHaveValue("my-tenant");
    expect(screen.getByLabelText("Tenant ID")).toHaveValue("tenant-123");
  });

  it("toggles the Force SIGv2 checkbox on S3 form", async () => {
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

  it("submits S3 form with optional fields and shows success notification", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.type(screen.getByLabelText("Name"), "S3 Optional Fields");
    await user.type(screen.getByLabelText(/region/i), "us-east-1");
    await user.type(screen.getByLabelText(/bucket name/i), "my-bucket");
    await user.type(
      screen.getByLabelText(/aws access key id/i),
      "AKIAIOSFODNN7EXAMPLE",
    );
    await user.type(
      screen.getByLabelText(/aws secret access key/i),
      "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    );
    await user.type(
      screen.getByLabelText(/endpoint/i),
      "https://s3.custom.example.com",
    );
    await user.type(screen.getByLabelText(/^prefix$/i), "ubuntu/");
    await user.type(screen.getByLabelText(/^acl$/i), "public-read");
    await user.type(screen.getByLabelText(/storage class/i), "STANDARD_IA");
    await user.type(screen.getByLabelText(/encryption method/i), "AES256");

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    await vi.waitFor(() => {
      expect(
        screen.getByText("Publication target created"),
      ).toBeInTheDocument();
    });
  });

  it("submits Swift form with all optional fields and shows success notification", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "swift");
    await user.type(screen.getByLabelText("Name"), "Swift Optional Fields");
    await user.type(screen.getByLabelText(/container/i), "my-container");
    await user.type(screen.getByLabelText(/^username$/i), "admin");
    await user.type(screen.getByLabelText(/^password$/i), "secret");
    await user.type(
      screen.getByLabelText(/auth url/i),
      "https://keystone.example.com/v3",
    );
    await user.type(screen.getByLabelText(/^prefix$/i), "packages/");
    await user.type(screen.getByLabelText("Tenant"), "my-tenant");
    await user.type(screen.getByLabelText("Tenant ID"), "tid-123");
    await user.type(
      screen.getByLabelText("OpenStack domain name"),
      "Default",
    );
    await user.type(screen.getByLabelText("OpenStack domain ID"), "did-123");
    await user.type(
      screen.getByLabelText("OpenStack tenant domain"),
      "tenant-domain",
    );
    await user.type(
      screen.getByLabelText("OpenStack tenant domain ID"),
      "tdid-123",
    );

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    await vi.waitFor(() => {
      expect(
        screen.getByText("Publication target created"),
      ).toBeInTheDocument();
    });
  });

  it("submits Filesystem form with linkMethod set and shows success notification", async () => {
    renderWithProviders(<AddPublicationTargetForm />);

    await user.selectOptions(screen.getByLabelText(/^type$/i), "filesystem");
    await user.type(screen.getByLabelText("Name"), "FS with link method");
    await user.type(screen.getByLabelText(/^path$/i), "/srv/archives");
    await user.selectOptions(screen.getByLabelText(/link method/i), "SYMLINK");

    await user.click(
      screen.getByRole("button", { name: /add publication target/i }),
    );

    await vi.waitFor(() => {
      expect(
        screen.getByText("Publication target created"),
      ).toBeInTheDocument();
    });
  });

  it("shows an error notification when form submission fails", async () => {
    server.use(
      http.post(`${API_URL_DEB_ARCHIVE}publicationTargets`, () =>
        HttpResponse.json({ message: "server error" }, { status: 500 }),
      ),
    );

    renderWithProviders(<AddPublicationTargetForm />);

    await user.type(screen.getByLabelText("Name"), "My S3 Target");
    await user.type(screen.getByLabelText(/region/i), "us-east-1");
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

    expect(await screen.findByText("server error")).toBeInTheDocument();
  });
});

