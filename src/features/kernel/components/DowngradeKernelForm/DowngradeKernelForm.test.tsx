import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { PATHS, ROUTES } from "@/libs/routes";
import DowngradeKernelForm from "./DowngradeKernelForm";
import {
  DOWNGRADE_MESSAGE_WITH_REBOOT,
  DOWNGRADE_MESSAGE_WITHOUT_REBOOT,
} from "./constants";

const INSTANCE_ID = 11;

const props: ComponentProps<typeof DowngradeKernelForm> = {
  currentKernelVersion: "5.11.0-27-generic",
  downgradeKernelVersions: [
    {
      id: 75473,
      name: "linux-image-virtual",
      version: "5.15.0.25.27",
      version_rounded: "5.15.0.25",
    },
    {
      id: 75474,
      name: "linux-image-virtual-2",
      version: "5.15.0.25.27",
      version_rounded: "5.15.0.25",
    },
  ],
  instanceName: "test-instance",
};

const [firstDowngradeVersion] = props.downgradeKernelVersions;
assert(firstDowngradeVersion);

describe("DowngradeKernelForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders notification message", () => {
    renderWithProviders(<DowngradeKernelForm {...props} />);
    expect(screen.getByText(/security warning/i)).toBeVisible();
  });

  it("radio button functionalities", async () => {
    renderWithProviders(<DowngradeKernelForm {...props} />);

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

  it("renders form dropdown", async () => {
    renderWithProviders(<DowngradeKernelForm {...props} />);

    const kernelVersionsCombobox = await screen.findByRole("combobox");
    expect(kernelVersionsCombobox).toBeInTheDocument();
  });

  it("switches between dropdown types", async () => {
    renderWithProviders(<DowngradeKernelForm {...props} />);

    const kernelVersionsCombobox = await screen.findByRole("combobox");
    expect(kernelVersionsCombobox).toBeInTheDocument();

    const options: HTMLOptionElement[] = await screen.findAllByRole("option");
    assert(options[0]);
    assert(options[1]);

    await user.selectOptions(kernelVersionsCombobox, options[1]);
    expect(options[0].selected).toBeFalsy();
    expect(options[1].selected).toBeTruthy();
  });

  it("cancel button can be clicked without error", async () => {
    renderWithProviders(<DowngradeKernelForm {...props} />);
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();
    await user.click(cancelButton);
  });

  it("clicking 'Downgrade kernel' opens confirmation modal", async () => {
    renderWithProviders(<DowngradeKernelForm {...props} />);
    const downgradeButton = screen.getByRole("button", {
      name: /downgrade kernel/i,
    });
    await user.click(downgradeButton);
    expect(
      screen.getByText(
        /are you sure\? this action will downgrade the kernel\./i,
      ),
    ).toBeInTheDocument();
  });

  it("clicking 'Downgrade and Restart' opens confirmation modal with correct title", async () => {
    renderWithProviders(<DowngradeKernelForm {...props} />);
    const downgradeRestartButton = screen.getByRole("button", {
      name: /downgrade and restart/i,
    });
    await user.click(downgradeRestartButton);
    expect(
      screen.getByText(/downgrading kernel and restarting instance/i),
    ).toBeInTheDocument();
  });

  it("does not render a dropdown when there is only one kernel version", async () => {
    const propsWithSingleVersion: ComponentProps<typeof DowngradeKernelForm> = {
      currentKernelVersion: "5.11.0-27-generic",
      downgradeKernelVersions: [
        {
          id: 75473,
          name: "linux-image-virtual",
          version: "5.15.0.25.27",
          version_rounded: "5.15.0.25",
        },
      ],
      instanceName: "test-instance",
    };
    renderWithProviders(<DowngradeKernelForm {...propsWithSingleVersion} />);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.getByText("5.15.0.25")).toBeInTheDocument();
  });

  it("submits downgrade and shows a success notification", async () => {
    const propsWithSingleVersion: ComponentProps<typeof DowngradeKernelForm> = {
      ...props,
      downgradeKernelVersions: [firstDowngradeVersion],
    };

    renderWithProviders(
      <DowngradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByRole("button", { name: /downgrade kernel/i }));

    const dialog = screen.getByRole("dialog", { name: "Downgrading kernel" });
    await user.click(within(dialog).getByRole("button", { name: "Downgrade" }));

    expect(
      await screen.findByText(
        /you queued kernel downgrade for instance "test-instance"/i,
      ),
    ).toBeInTheDocument();
  });

  it("submits downgrade and restart and shows a success notification", async () => {
    const propsWithSingleVersion: ComponentProps<typeof DowngradeKernelForm> = {
      ...props,
      downgradeKernelVersions: [firstDowngradeVersion],
    };

    renderWithProviders(
      <DowngradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(
      screen.getByRole("button", { name: /downgrade and restart/i }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Downgrading kernel and restarting instance",
    });
    await user.click(
      within(dialog).getByRole("button", { name: "Downgrade and Restart" }),
    );

    expect(
      await screen.findByText(
        /you queued kernel downgrade for instance "test-instance"/i,
      ),
    ).toBeInTheDocument();
  });

  it("shows notification with reboot message when reboot_after is true", async () => {
    const propsWithSingleVersion: ComponentProps<typeof DowngradeKernelForm> = {
      ...props,
      downgradeKernelVersions: [firstDowngradeVersion],
    };

    renderWithProviders(
      <DowngradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(
      screen.getByRole("button", { name: /downgrade and restart/i }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Downgrading kernel and restarting instance",
    });
    await user.click(
      within(dialog).getByRole("button", { name: "Downgrade and Restart" }),
    );

    expect(
      await screen.findByText(DOWNGRADE_MESSAGE_WITH_REBOOT),
    ).toBeInTheDocument();
  });

  it("shows notification with no-reboot message when reboot_after is false", async () => {
    const propsWithSingleVersion: ComponentProps<typeof DowngradeKernelForm> = {
      ...props,
      downgradeKernelVersions: [firstDowngradeVersion],
    };

    renderWithProviders(
      <DowngradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByRole("button", { name: /downgrade kernel/i }));

    const dialog = screen.getByRole("dialog", { name: "Downgrading kernel" });
    await user.click(within(dialog).getByRole("button", { name: "Downgrade" }));

    expect(
      await screen.findByText(DOWNGRADE_MESSAGE_WITHOUT_REBOOT),
    ).toBeInTheDocument();
  });

  it("can click View details after successful downgrade to open activity panel", async () => {
    const propsWithSingleVersion: ComponentProps<typeof DowngradeKernelForm> = {
      ...props,
      downgradeKernelVersions: [firstDowngradeVersion],
    };

    renderWithProviders(
      <DowngradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByRole("button", { name: /downgrade kernel/i }));

    const dialog = screen.getByRole("dialog", { name: "Downgrading kernel" });
    await user.click(within(dialog).getByRole("button", { name: "Downgrade" }));

    await user.click(
      await screen.findByRole("button", { name: "View details" }),
    );

    expect(
      await screen.findByRole("heading", { name: "Start instance Bionic WSL" }),
    ).toBeInTheDocument();
  });

  it("submits downgrade with scheduled delivery option", async () => {
    const propsWithSingleVersion: ComponentProps<typeof DowngradeKernelForm> = {
      ...props,
      downgradeKernelVersions: [firstDowngradeVersion],
    };

    renderWithProviders(
      <DowngradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByLabelText("Scheduled"));

    const deliverAfterInput = screen.getByLabelText("Deliver after");
    fireEvent.change(deliverAfterInput, {
      target: { value: "2099-12-31T23:59" },
    });

    await user.click(screen.getByRole("button", { name: /downgrade kernel/i }));

    const dialog = screen.getByRole("dialog", { name: "Downgrading kernel" });
    await user.click(within(dialog).getByRole("button", { name: "Downgrade" }));

    expect(
      await screen.findByText(
        /you queued kernel downgrade for instance "test-instance"/i,
      ),
    ).toBeInTheDocument();
  });

  it("submits downgrade with randomize delivery enabled", async () => {
    const propsWithSingleVersion: ComponentProps<typeof DowngradeKernelForm> = {
      ...props,
      downgradeKernelVersions: [firstDowngradeVersion],
    };

    renderWithProviders(
      <DowngradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByLabelText("Yes"));

    await user.click(screen.getByRole("button", { name: /downgrade kernel/i }));

    const dialog = screen.getByRole("dialog", { name: "Downgrading kernel" });
    await user.click(within(dialog).getByRole("button", { name: "Downgrade" }));

    expect(
      await screen.findByText(
        /you queued kernel downgrade for instance "test-instance"/i,
      ),
    ).toBeInTheDocument();
  });

  it("handles error silently when downgrade fails", async () => {
    setEndpointStatus("error");

    const propsWithSingleVersion: ComponentProps<typeof DowngradeKernelForm> = {
      ...props,
      downgradeKernelVersions: [firstDowngradeVersion],
    };

    renderWithProviders(
      <DowngradeKernelForm {...propsWithSingleVersion} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByRole("button", { name: /downgrade kernel/i }));

    const dialog = screen.getByRole("dialog", { name: "Downgrading kernel" });
    await user.click(within(dialog).getByRole("button", { name: "Downgrade" }));

    expect(
      screen.queryByText(
        /you queued kernel downgrade for instance "test-instance"/i,
      ),
    ).not.toBeInTheDocument();
  });
});
