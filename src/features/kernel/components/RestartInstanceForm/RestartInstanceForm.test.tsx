import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { PATHS, ROUTES } from "@/libs/routes";
import RestartInstanceForm from "./RestartInstanceForm";

const props: ComponentProps<typeof RestartInstanceForm> = {
  showNotification: true,
  instanceName: "test-instance",
};
const INSTANCE_ID = 11;

describe("RestartInstanceForm", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders notification when restart is recommended", () => {
    renderWithProviders(<RestartInstanceForm {...props} />);
    expect(screen.getByText(/restart recommended/i)).toBeVisible();
  });

  it("does not render notification when restart is not recommended", () => {
    renderWithProviders(
      <RestartInstanceForm {...props} showNotification={false} />,
    );
    expect(screen.queryByText(/restart recommended/i)).toBeNull();
  });

  it("shows randomization input when enabling random delivery", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <RestartInstanceForm {...props} showNotification={false} />,
    );

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

  it("shows upgrade and restart action only when kernel id is provided", () => {
    const { rerender } = renderWithProviders(
      <RestartInstanceForm {...props} newKernelVersionId={123} />,
    );

    expect(
      screen.getByRole("button", { name: "Upgrade and Restart" }),
    ).toBeInTheDocument();

    rerender(<RestartInstanceForm {...props} />);

    expect(
      screen.queryByRole("button", { name: "Upgrade and Restart" }),
    ).not.toBeInTheDocument();
  });

  it("submits restart and shows a success notification", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <RestartInstanceForm {...props} showNotification={false} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByRole("button", { name: "Restart" }));

    const dialog = screen.getByRole("dialog", { name: "Restarting instance" });
    await user.click(within(dialog).getByRole("button", { name: "Restart" }));

    expect(
      await screen.findByText('You queued "test-instance" to be restarted.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "View details" }));

    expect(
      await screen.findByRole("heading", { name: "Start instance Bionic WSL" }),
    ).toBeInTheDocument();
  });

  it("submits upgrade and restart and shows a success notification", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <RestartInstanceForm {...props} newKernelVersionId={123} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(
      screen.getByRole("button", { name: "Upgrade and Restart" }),
    );

    const dialog = screen.getByRole("dialog", {
      name: "Upgrading kernel and restarting instance",
    });
    await user.click(
      within(dialog).getByRole("button", { name: "Upgrade and Restart" }),
    );

    expect(
      await screen.findByText('You queued kernel upgrade for "test-instance"'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "View details" }));

    expect(
      await screen.findByRole("heading", { name: "Start instance Bionic WSL" }),
    ).toBeInTheDocument();
  });

  it("shows an error notification when restart fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({
      status: "error",
      path: "computers/:computerId/restart",
    });

    renderWithProviders(
      <RestartInstanceForm {...props} showNotification={false} />,
      undefined,
      ROUTES.instances.details.single(INSTANCE_ID),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByRole("button", { name: "Restart" }));
    const dialog = screen.getByRole("dialog", { name: "Restarting instance" });
    await user.click(within(dialog).getByRole("button", { name: "Restart" }));

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
