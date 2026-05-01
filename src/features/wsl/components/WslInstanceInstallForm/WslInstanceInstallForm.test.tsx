import { PATHS } from "@/libs/routes";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach } from "vitest";
import WslInstanceInstallForm from "./WslInstanceInstallForm";

afterEach(() => {
  setEndpointStatus("default");
});

const renderForm = () =>
  renderWithProviders(
    <WslInstanceInstallForm />,
    {},
    "/instances/1",
    `/${PATHS.instances.root}/${PATHS.instances.single}`,
  );

describe("WslInstanceInstallForm", () => {
  it("renders correct form fields when a provided instance type is selected", () => {
    const { container } = renderForm();

    expect(container).toHaveTexts(["Instance type", "cloud-init"]);

    const installInstanceButton = screen.getByRole("button", {
      name: /create/i,
    });
    expect(installInstanceButton).toBeInTheDocument();
    expect(installInstanceButton).not.toHaveAttribute("aria-disabled");
    expect(installInstanceButton).toBeEnabled();
  });

  it("renders correct form fields when a provided custom instance type is selected", async () => {
    const { container } = renderForm();

    expect(container).toHaveTexts(["Instance type", "cloud-init"]);

    const instanceTypeSelect = screen.getByRole("combobox");
    expect(instanceTypeSelect).toBeInTheDocument();

    await userEvent.click(instanceTypeSelect);
    await userEvent.selectOptions(instanceTypeSelect, ["Custom"]);

    expect(container).toHaveTexts([
      "Instance type",
      "Instance name",
      "rootfs URL",
      "cloud-init",
    ]);

    const installInstanceButton = screen.getByRole("button", {
      name: /create/i,
    });

    expect(installInstanceButton).toBeInTheDocument();
  });

  it("shows validation errors when submitting with empty custom fields", async () => {
    renderForm();
    const instanceTypeSelect = screen.getByRole("combobox");
    await userEvent.click(instanceTypeSelect);
    await userEvent.selectOptions(instanceTypeSelect, ["Custom"]);
    // Assert custom fields rendered before submitting
    expect(
      screen.getByRole("textbox", { name: /instance name/i }),
    ).toBeInTheDocument();
    const createButton = screen.getByRole("button", { name: /create/i });
    await userEvent.click(createButton);
    const errors = await screen.findAllByText("This field is required");
    expect(errors.length).toBeGreaterThan(0);
  });

  it("shows validation error for a reserved instance name", async () => {
    renderForm();
    const instanceTypeSelect = screen.getByRole("combobox");
    await userEvent.click(instanceTypeSelect);
    await userEvent.selectOptions(instanceTypeSelect, ["Custom"]);
    const instanceNameInput = screen.getByRole("textbox", {
      name: /instance name/i,
    });
    await userEvent.type(instanceNameInput, "ubuntu");
    const createButton = screen.getByRole("button", { name: /create/i });
    await userEvent.click(createButton);
    expect(
      await screen.findByText(/instance name cannot match/i),
    ).toBeInTheDocument();
  });

  it("shows validation error for an invalid rootfs URL", async () => {
    renderForm();
    const instanceTypeSelect = screen.getByRole("combobox");
    await userEvent.click(instanceTypeSelect);
    await userEvent.selectOptions(instanceTypeSelect, ["Custom"]);
    const rootfsInput = screen.getByRole("textbox", { name: /rootfs url/i });
    await userEvent.type(rootfsInput, "not-a-valid-url");
    const createButton = screen.getByRole("button", { name: /create/i });
    await userEvent.click(createButton);
    expect(await screen.findByText(/must be a valid url/i)).toBeInTheDocument();
  });

  it("submits successfully with a pre-configured instance type", async () => {
    renderForm();

    const createButton = screen.getByRole("button", { name: /create/i });
    await userEvent.click(createButton);

    expect(
      await screen.findByText(/you have successfully marked/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/an activity has been queued to install it/i),
    ).toBeInTheDocument();

    const viewDetailsButton = screen.getByRole("button", {
      name: /view details/i,
    });
    await userEvent.click(viewDetailsButton);
  });

  it("submits successfully with a custom instance type", async () => {
    renderForm();

    const instanceTypeSelect = screen.getByRole("combobox");
    await userEvent.click(instanceTypeSelect);
    await userEvent.selectOptions(instanceTypeSelect, ["Custom"]);

    const instanceNameInput = await screen.findByRole("textbox", {
      name: /instance name/i,
    });
    await userEvent.type(instanceNameInput, "my-custom-instance");

    const rootfsInput = screen.getByRole("textbox", { name: /rootfs url/i });
    await userEvent.type(rootfsInput, "https://example.com/rootfs.tar.gz");

    const createButton = screen.getByRole("button", { name: /create/i });
    await userEvent.click(createButton);

    expect(
      await screen.findByText(/an activity has been queued to install it/i),
    ).toBeInTheDocument();
  });

  it("shows validation error when cloud-init file exceeds 1MB", async () => {
    renderForm();

    const largeFile = new File(
      [new Uint8Array(2 * 1024 * 1024)],
      "large-cloud-init.yaml",
      { type: "text/yaml" },
    );
    const fileInput = screen.getByLabelText(/cloud-init/i);
    await userEvent.upload(fileInput, largeFile);

    const createButton = screen.getByRole("button", { name: /create/i });
    await userEvent.click(createButton);

    expect(
      await screen.findByText(/file size must be less than 1mb/i),
    ).toBeInTheDocument();
  });

  it("submits with a valid cloud-init file", async () => {
    renderForm();

    const validFile = new File(["cloud-init: true"], "cloud-init.yaml", {
      type: "text/yaml",
    });
    const fileInput = screen.getByLabelText(/cloud-init/i);
    await userEvent.upload(fileInput, validFile);

    const createButton = screen.getByRole("button", { name: /create/i });
    await userEvent.click(createButton);

    expect(
      await screen.findByText(/an activity has been queued to install it/i),
    ).toBeInTheDocument();
  });

  it("allows removing an uploaded cloud-init file", async () => {
    renderForm();

    const validFile = new File(["cloud-init: true"], "cloud-init.yaml", {
      type: "text/yaml",
    });
    const fileInput = screen.getByLabelText(/cloud-init/i);
    await userEvent.upload(fileInput, validFile);

    const removeButton = await screen.findByRole("button", { name: /remove/i });
    await userEvent.click(removeButton);

    expect(screen.getByLabelText(/cloud-init/i)).toBeInTheDocument();
  });

  it("shows validation error when cloud-init file has undefined size", async () => {
    renderForm();

    const file = new File(["content"], "test.yaml", { type: "text/yaml" });
    Object.defineProperty(file, "size", {
      value: undefined,
      configurable: true,
    });

    const fileInput = screen.getByLabelText(/cloud-init/i);
    await userEvent.upload(fileInput, file);

    const createButton = screen.getByRole("button", { name: /create/i });
    await userEvent.click(createButton);

    expect(
      await screen.findByText(/file size must be less than 1mb/i),
    ).toBeInTheDocument();
  });

  it("handles error gracefully when creating a wsl instance fails", async () => {
    setEndpointStatus({ status: "error", path: "create-wsl-instance" });

    renderForm();

    const createButton = screen.getByRole("button", { name: /create/i });
    await userEvent.click(createButton);

    // Wait for the async onSubmit to complete (catch block runs, then isSubmitting → false)
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /create new wsl instance/i }),
      ).toBeEnabled();
    });
  });
});
