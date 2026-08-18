import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { FILE_INPUT_HELPER_TEXT } from "../constants";
import WslProfileAddSidePanel from "./WslProfileAddSidePanel";

type UserEvent = ReturnType<typeof userEvent.setup>;

const fillRequiredTextFields = async (user: UserEvent) => {
  await user.type(screen.getByLabelText("Title"), "My WSL profile");
  await user.type(screen.getByLabelText("Description"), "A description");
};

const selectStockRootfsImage = async (user: UserEvent) => {
  await screen.findByRole("option", { name: "Ubuntu" });
  await user.selectOptions(screen.getByLabelText("rootfs image"), "Ubuntu");
};

const clickSubmit = async (user: UserEvent) => {
  await user.click(
    screen.getByRole("button", { name: "Add a new WSL profile" }),
  );
};

describe("WslProfileAddSidePanel", () => {
  it("renders the form with correct fields for add action", async () => {
    const { container } = renderWithProviders(<WslProfileAddSidePanel />);

    expect(container).toHaveTexts([
      "Title",
      "Access group",
      "rootfs image",
      "cloud-init",
      "Add",
    ]);
  });

  it("shows file upload for cloud-init", async () => {
    renderWithProviders(<WslProfileAddSidePanel />);

    await userEvent.selectOptions(screen.getByLabelText("cloud-init"), "file");
    const helperText = screen.getByText(FILE_INPUT_HELPER_TEXT);
    expect(helperText).toBeInTheDocument();
  });

  it("shows a compliance warning once a rootfs image is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WslProfileAddSidePanel />);

    expect(
      screen.queryByText(/you cannot modify the rootfs image/i),
    ).not.toBeInTheDocument();

    await selectStockRootfsImage(user);

    expect(
      screen.getByText(/you cannot modify the rootfs image/i),
    ).toBeInTheDocument();
  });

  it("reveals custom image fields and rejects reserved image names", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WslProfileAddSidePanel />);

    await fillRequiredTextFields(user);
    await screen.findByRole("option", { name: "Ubuntu" });
    await user.selectOptions(screen.getByLabelText("rootfs image"), "custom");

    await user.type(screen.getByLabelText("Image name"), "ubuntu");
    await user.type(
      screen.getByLabelText("rootfs image URL"),
      "https://example.com/rootfs",
    );

    await clickSubmit(user);

    expect(
      await screen.findByText(/Image name cannot match/i),
    ).toBeInTheDocument();
  });

  it("shows required field validation on empty submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WslProfileAddSidePanel />);

    await clickSubmit(user);

    expect(
      (await screen.findAllByText("This field is required")).length,
    ).toBeGreaterThan(0);
  });

  it("requires a cloud-init value once the file source is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WslProfileAddSidePanel />);

    await fillRequiredTextFields(user);
    await selectStockRootfsImage(user);
    await user.selectOptions(screen.getByLabelText("cloud-init"), "file");

    await clickSubmit(user);

    expect(
      await screen.findByText("This field is required"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/added successfully/i)).not.toBeInTheDocument();
  });

  it("creates a profile with a stock rootfs image", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WslProfileAddSidePanel />);

    await fillRequiredTextFields(user);
    await selectStockRootfsImage(user);

    await clickSubmit(user);

    expect(await screen.findByText(/added successfully/i)).toBeInTheDocument();
  });

  it("creates a profile with a custom image and plain-text cloud-init", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WslProfileAddSidePanel />);

    await fillRequiredTextFields(user);
    await screen.findByRole("option", { name: "Ubuntu" });
    await user.selectOptions(screen.getByLabelText("rootfs image"), "custom");
    await user.type(screen.getByLabelText("Image name"), "my-custom-image");
    await user.type(
      screen.getByLabelText("rootfs image URL"),
      "https://example.com/rootfs",
    );

    await user.selectOptions(screen.getByLabelText("cloud-init"), "text");
    await user.type(screen.getByTestId("mock-monaco"), "cloud-config-content");

    await clickSubmit(user);

    expect(await screen.findByText(/added successfully/i)).toBeInTheDocument();
  });

  it("creates a profile with a file cloud-init and can remove the uploaded file", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WslProfileAddSidePanel />);

    await fillRequiredTextFields(user);
    await selectStockRootfsImage(user);

    await user.selectOptions(screen.getByLabelText("cloud-init"), "file");

    const file = new File(["#cloud-config\nfoo: bar"], "cloud-init.yaml", {
      type: "application/x-yaml",
    });
    await user.upload(screen.getByLabelText("Upload cloud-init"), file);

    expect(screen.getByText("cloud-init.yaml")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(screen.queryByText("cloud-init.yaml")).not.toBeInTheDocument();

    await user.upload(screen.getByLabelText("Upload cloud-init"), file);
    await clickSubmit(user);

    expect(await screen.findByText(/added successfully/i)).toBeInTheDocument();
  });

  it("shows an error notification when creating the profile fails", async () => {
    setEndpointStatus({ status: "error", path: "create-wsl-profile" });
    const user = userEvent.setup();
    renderWithProviders(<WslProfileAddSidePanel />);

    await fillRequiredTextFields(user);
    await selectStockRootfsImage(user);

    await clickSubmit(user);

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
