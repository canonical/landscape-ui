import { setEndpointStatus } from "@/tests/controllers/controller";
import { ADD_AUTOINSTALL_FILE_NOTIFICATION } from "@/pages/dashboard/settings/employees/tabs/autoinstall-files";
import { autoinstallValidateOverrideError } from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, vi } from "vitest";
import AutoinstallFileForm from "./AutoinstallFileForm";
import { DEFAULT_FILE } from "./constants";

describe("AutoinstallFileForm", () => {
  const createAutoinstallFileProps = (): ComponentProps<
    typeof AutoinstallFileForm
  > => ({
    buttonText: "Add",
    description: "Add an autoinstall file.",
    initialFile: DEFAULT_FILE,
    notification: ADD_AUTOINSTALL_FILE_NOTIFICATION,
    onSubmit: vi.fn(async () => undefined),
  });

  const editAutoinstallFileProps = (): ComponentProps<
    typeof AutoinstallFileForm
  > => ({
    buttonText: "Save changes",
    description: `The duplicated file will be assigned to the same user groups in the identity provider as the original file.`,
    initialFile: {
      contents: "echo 'Hello, world!'",
      filename: "autoinstall.yaml",
      is_default: false,
    },
    notification: ADD_AUTOINSTALL_FILE_NOTIFICATION,
    onSubmit: vi.fn(async () => undefined),
  });

  const createAutoinstallFileWithContentsProps = (): ComponentProps<
    typeof AutoinstallFileForm
  > => ({
    ...createAutoinstallFileProps(),
    initialFile: {
      ...DEFAULT_FILE,
      contents: "#cloud-config\nusers:\n  - name: ubuntu",
    },
  });

  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("should not render default checkbox when editing", () => {
    renderWithProviders(
      <AutoinstallFileForm {...editAutoinstallFileProps()} />,
    );
    expect(
      screen.queryByRole("checkbox", { name: "Default" }),
    ).not.toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: "Save changes",
    });

    expect(submitButton).toBeInTheDocument();
  });

  it("should show a disabled button when first creating a form", async () => {
    const props = createAutoinstallFileProps();
    renderWithProviders(<AutoinstallFileForm {...props} />);

    expect(
      screen.getByRole("checkbox", { name: "Default" }),
    ).toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: props.buttonText,
    });

    expect(submitButton).toHaveAttribute("aria-disabled", "true");
  });

  it("populates filename from uploaded file when creating", async () => {
    const props = createAutoinstallFileProps();
    const user = userEvent.setup();
    const file = new File(["#cloud-config\nusers: []"], "custom-config.yaml", {
      type: "text/yaml",
    });

    renderWithProviders(<AutoinstallFileForm {...props} />);

    const fileInput = screen.getByTestId("autoinstall-upload-input");

    await user.upload(fileInput, file);

    expect(screen.getByRole("textbox", { name: "File name" })).toHaveValue(
      "custom-config",
    );
    expect(screen.getByRole("button", { name: "Add" })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("keeps existing filename when uploading a file", async () => {
    const props = createAutoinstallFileProps();
    const user = userEvent.setup();
    const file = new File(["#cloud-config\npackage_update: true"], "new.yaml", {
      type: "text/yaml",
    });

    renderWithProviders(<AutoinstallFileForm {...props} />);

    const fileNameInput = screen.getByRole("textbox", { name: "File name" });
    await user.type(fileNameInput, "custom-file-name");

    await user.upload(screen.getByTestId("autoinstall-upload-input"), file);

    expect(fileNameInput).toHaveValue("custom-file-name");
  });

  it("enables submit when content differs from initial file content", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <AutoinstallFileForm {...createAutoinstallFileWithContentsProps()} />,
    );

    expect(screen.getByRole("button", { name: "Add" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await user.type(screen.getByTestId("mock-monaco"), "\n# changed");

    expect(screen.getByRole("button", { name: "Add" })).not.toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("submits successfully after validation", async () => {
    const user = userEvent.setup();
    const props = createAutoinstallFileProps();
    renderWithProviders(<AutoinstallFileForm {...props} />);

    await user.type(screen.getByRole("textbox", { name: "File name" }), "base");
    await user.type(screen.getByTestId("mock-monaco"), "#cloud-config");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(props.onSubmit).toHaveBeenCalledWith({
      accept_warning: false,
      contents: "#cloud-config",
      filename: "base.yaml",
      is_default: false,
    });
  });

  it("handles submit errors from creating file", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => {
      throw new Error("submit failed");
    });
    const props = { ...createAutoinstallFileProps(), onSubmit };
    renderWithProviders(<AutoinstallFileForm {...props} />);

    await user.type(screen.getByRole("textbox", { name: "File name" }), "base");
    await user.type(screen.getByTestId("mock-monaco"), "#cloud-config");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(onSubmit).toHaveBeenCalledWith({
      accept_warning: false,
      contents: "#cloud-config",
      filename: "base.yaml",
      is_default: false,
    });
    expect(await screen.findByText("submit failed")).toBeInTheDocument();
  });

  it("handles validation errors that are not override warnings", async () => {
    const user = userEvent.setup();
    const props = createAutoinstallFileProps();
    setEndpointStatus({ status: "error", path: "autoinstall:validate" });
    renderWithProviders(<AutoinstallFileForm {...props} />);

    await user.type(screen.getByRole("textbox", { name: "File name" }), "base");
    await user.type(screen.getByTestId("mock-monaco"), "#cloud-config");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(props.onSubmit).not.toHaveBeenCalled();
    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });

  it("shows override modal and submits when confirmed", async () => {
    const user = userEvent.setup();
    const props = createAutoinstallFileProps();
    setEndpointStatus({
      status: "variant",
      path: "autoinstall-validate",
      response: autoinstallValidateOverrideError,
    });
    renderWithProviders(<AutoinstallFileForm {...props} />);

    await user.type(screen.getByRole("textbox", { name: "File name" }), "base");
    await user.type(screen.getByTestId("mock-monaco"), "#cloud-config");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(
      await screen.findByRole("heading", { name: "Override autoinstall file" }),
    ).toBeInTheDocument();
    expect(screen.getByText("users")).toBeInTheDocument();
    expect(screen.getByText("identity")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Override and add file" }),
    );

    expect(props.onSubmit).toHaveBeenCalledWith({
      accept_warning: true,
      contents: "#cloud-config",
      filename: "base.yaml",
      is_default: false,
    });
  });

  it("hides override modal when canceled", async () => {
    const user = userEvent.setup();
    const props = createAutoinstallFileProps();
    setEndpointStatus({
      status: "variant",
      path: "autoinstall-validate",
      response: autoinstallValidateOverrideError,
    });
    renderWithProviders(<AutoinstallFileForm {...props} />);

    await user.type(screen.getByRole("textbox", { name: "File name" }), "base");
    await user.type(screen.getByTestId("mock-monaco"), "#cloud-config");
    await user.click(screen.getByRole("button", { name: "Add" }));

    const dialog = await screen.findByRole("dialog", {
      name: "Override autoinstall file",
    });
    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));

    expect(
      screen.queryByRole("heading", { name: "Override autoinstall file" }),
    ).not.toBeInTheDocument();
  });

  it("opens hidden file input when clicking populate from file", async () => {
    const user = userEvent.setup();
    const clickSpy = vi.spyOn(HTMLInputElement.prototype, "click");
    const props = createAutoinstallFileProps();
    renderWithProviders(<AutoinstallFileForm {...props} />);

    await user.click(
      screen.getByRole("button", { name: "Populate from file" }),
    );

    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it("ignores empty file input change", async () => {
    const user = userEvent.setup();
    const props = createAutoinstallFileProps();
    const file = new File(["#cloud-config\nusers: []"], "custom-config.yaml", {
      type: "text/yaml",
    });
    renderWithProviders(<AutoinstallFileForm {...props} />);

    const fileInput = screen.getByTestId("autoinstall-upload-input");
    await user.upload(fileInput, file);
    await user.upload(fileInput, []);

    expect(screen.getByRole("textbox", { name: "File name" })).toHaveValue(
      "custom-config",
    );
  });
});
