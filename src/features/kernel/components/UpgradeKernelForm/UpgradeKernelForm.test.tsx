import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { PATHS, ROUTES } from "@/libs/routes";
import UpgradeKernelForm from "./UpgradeKernelForm";
import {
  UPGRADE_MESSAGE_WITH_REBOOT,
  UPGRADE_MESSAGE_WITHOUT_REBOOT,
} from "./constants";

const INSTANCE_ID = 11;

const props: ComponentProps<typeof UpgradeKernelForm> = {
  currentKernelVersion: "5.11.0-27-generic",
  upgradeKernelVersions: [
    {
      id: 75473,
      name: "linux-image-virtual",
      version: "5.15.0.25.28",
      version_rounded: "5.15.0.30",
    },
    {
      id: 75474,
      name: "linux-image-virtual-2",
      version: "5.15.0.25.29",
      version_rounded: "5.15.0.30",
    },
  ],
  instanceName: "test-instance",
};

const [firstUpgradeVersion] = props.upgradeKernelVersions;
assert(firstUpgradeVersion);

describe("UpgradeKernelForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders notification message", () => {
    renderWithProviders(<UpgradeKernelForm {...props} />);
    expect(screen.getByText(/restart recommended/i)).toBeVisible();
  });

  it("radio button functionalities", async () => {
    renderWithProviders(<UpgradeKernelForm {...props} />);

    const instantDeliveryTimeRadioOption = screen.getByLabelText(
      "As soon as possible",
    );
    expect(instantDeliveryTimeRadioOption).toBeChecked();

    const scheduledDeliveryTimeRadioOption = screen.getByLabelText("Scheduled");
    expect(scheduledDeliveryTimeRadioOption).not.toBeChecked();

    const randomizeDeliveryTrueOption = screen.getByLabelText("Yes");
    const randomizeDeliveryFalseOption = screen.getByLabelText("No");
    expect(randomizeDeliveryTrueOption).not.toBeChecked();
    expect(randomizeDeliveryFalseOption).toBeChecked();

    await user.click(randomizeDeliveryTrueOption);
    expect(screen.getByText(/time in minutes/i)).toBeVisible();
  });

  it("renders a cancel button that can be clicked", async () => {
    renderWithProviders(<UpgradeKernelForm {...props} />);
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    expect(cancelButton).toBeVisible();
    await user.click(cancelButton);
  });

  it("clicking 'Upgrade kernel' opens confirmation modal with correct message", async () => {
    renderWithProviders(<UpgradeKernelForm {...props} />);
    await user.click(screen.getByRole("button", { name: /upgrade kernel/i }));
    await waitFor(() => {
      expect(
        screen.getByText(
          /Are you sure\? This action will upgrade the kernel\./i,
        ),
      ).toBeVisible();
    });
  });

  it("clicking 'Upgrade and Restart' opens confirmation modal with correct title", async () => {
    renderWithProviders(<UpgradeKernelForm {...props} />);
    await user.click(
      screen.getByRole("button", { name: /upgrade and restart/i }),
    );
    await waitFor(() => {
      expect(
        screen.getByText(/upgrading kernel and restarting instance/i),
      ).toBeVisible();
    });
  });

  it("submits upgrade and shows a success notification", async () => {
    const propsWithSingleVersion: ComponentProps<typeof UpgradeKernelForm> = {
      ...props,
      upgradeKernelVersions: [firstUpgradeVersion],
    };

    renderWithProviders(
      <UpgradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByRole("button", { name: /upgrade kernel/i }));

    const dialog = screen.getByRole("dialog", { name: "Upgrading kernel" });
    await user.click(within(dialog).getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText(/you queued kernel upgrade for "test-instance"/i),
    ).toBeInTheDocument();
  });

  it("submits upgrade and restart and shows a success notification", async () => {
    const propsWithSingleVersion: ComponentProps<typeof UpgradeKernelForm> = {
      ...props,
      upgradeKernelVersions: [firstUpgradeVersion],
    };

    renderWithProviders(
      <UpgradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(
      screen.getByRole("button", { name: /upgrade and restart/i }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Upgrading kernel and restarting instance",
    });
    await user.click(
      within(dialog).getByRole("button", { name: "Upgrade and Restart" }),
    );

    expect(
      await screen.findByText(/you queued kernel upgrade for "test-instance"/i),
    ).toBeInTheDocument();
  });

  it("shows notification with reboot message when reboot_after is true", async () => {
    const propsWithSingleVersion: ComponentProps<typeof UpgradeKernelForm> = {
      ...props,
      upgradeKernelVersions: [firstUpgradeVersion],
    };

    renderWithProviders(
      <UpgradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(
      screen.getByRole("button", { name: /upgrade and restart/i }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Upgrading kernel and restarting instance",
    });
    await user.click(
      within(dialog).getByRole("button", { name: "Upgrade and Restart" }),
    );

    expect(
      await screen.findByText(UPGRADE_MESSAGE_WITH_REBOOT),
    ).toBeInTheDocument();
  });

  it("shows notification with no-reboot message when reboot_after is false", async () => {
    const propsWithSingleVersion: ComponentProps<typeof UpgradeKernelForm> = {
      ...props,
      upgradeKernelVersions: [firstUpgradeVersion],
    };

    renderWithProviders(
      <UpgradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByRole("button", { name: /upgrade kernel/i }));

    const dialog = screen.getByRole("dialog", { name: "Upgrading kernel" });
    await user.click(within(dialog).getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText(UPGRADE_MESSAGE_WITHOUT_REBOOT),
    ).toBeInTheDocument();
  });

  it("can click View details after successful upgrade to open activity panel", async () => {
    const propsWithSingleVersion: ComponentProps<typeof UpgradeKernelForm> = {
      ...props,
      upgradeKernelVersions: [firstUpgradeVersion],
    };

    renderWithProviders(
      <UpgradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByRole("button", { name: /upgrade kernel/i }));

    const dialog = screen.getByRole("dialog", { name: "Upgrading kernel" });
    await user.click(within(dialog).getByRole("button", { name: "Upgrade" }));

    await user.click(
      await screen.findByRole("button", { name: "View details" }),
    );

    expect(
      await screen.findByRole("heading", { name: "Start instance Bionic WSL" }),
    ).toBeInTheDocument();
  });

  it("submits upgrade with scheduled delivery option", async () => {
    const propsWithSingleVersion: ComponentProps<typeof UpgradeKernelForm> = {
      ...props,
      upgradeKernelVersions: [firstUpgradeVersion],
    };

    renderWithProviders(
      <UpgradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByLabelText("Scheduled"));

    const deliverAfterInput = screen.getByLabelText("Deliver after");
    fireEvent.change(deliverAfterInput, {
      target: { value: "2099-12-31T23:59" },
    });

    await user.click(screen.getByRole("button", { name: /upgrade kernel/i }));

    const dialog = screen.getByRole("dialog", { name: "Upgrading kernel" });
    await user.click(within(dialog).getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText(/you queued kernel upgrade for "test-instance"/i),
    ).toBeInTheDocument();
  });

  it("submits upgrade with randomize delivery enabled", async () => {
    const propsWithSingleVersion: ComponentProps<typeof UpgradeKernelForm> = {
      ...props,
      upgradeKernelVersions: [firstUpgradeVersion],
    };

    renderWithProviders(
      <UpgradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByLabelText("Yes"));

    await user.click(screen.getByRole("button", { name: /upgrade kernel/i }));

    const dialog = screen.getByRole("dialog", { name: "Upgrading kernel" });
    await user.click(within(dialog).getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText(/you queued kernel upgrade for "test-instance"/i),
    ).toBeInTheDocument();
  });

  it("handles error silently when upgrade fails", async () => {
    setEndpointStatus("error");

    const propsWithSingleVersion: ComponentProps<typeof UpgradeKernelForm> = {
      ...props,
      upgradeKernelVersions: [firstUpgradeVersion],
    };

    renderWithProviders(
      <UpgradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByRole("button", { name: /upgrade kernel/i }));

    const dialog = screen.getByRole("dialog", { name: "Upgrading kernel" });
    await user.click(within(dialog).getByRole("button", { name: "Upgrade" }));

    expect(
      screen.queryByText(/you queued kernel upgrade for "test-instance"/i),
    ).not.toBeInTheDocument();
  });
});

const propsWithSingleVersion: ComponentProps<typeof UpgradeKernelForm> = {
  currentKernelVersion: "5.11.0-27-generic",
  upgradeKernelVersions: [
    {
      id: 75473,
      name: "linux-image-virtual",
      version: "5.15.0.25.28",
      version_rounded: "5.15.0.30",
    },
  ],
  instanceName: "test-instance",
};

describe("UpgradeKernelForm with single version", () => {
  it("does not render a dropdown and shows the version text", () => {
    renderWithProviders(<UpgradeKernelForm {...propsWithSingleVersion} />);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.getByText("5.15.0.30")).toBeVisible();
  });
});
