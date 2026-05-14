import { renderWithProviders } from "@/tests/render";
import {
  instanceCanceledActivityNoKey,
  instanceCanceledActivityWithKey,
  instanceActivityNoKey,
  instanceActivityWithKey,
  instanceFailedActivityNoKey,
  instanceFailedActivityWithKey,
  instanceNoActivityNoKey,
  instanceNoActivityWithKey,
} from "@/tests/mocks/instance";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RecoveryKeyStatus from "./RecoveryKeyStatus";
import { expectLoadingState } from "@/tests/helpers";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { MASKED_VALUE } from "@/constants";

describe("RecoveryKeyStatus", () => {
  it("renders loading state initially", async () => {
    renderWithProviders(
      <RecoveryKeyStatus instanceId={instanceNoActivityNoKey.id} />,
    );

    await expectLoadingState();
  });

  it("renders no data state when no recovery key exists and no activity", async () => {
    renderWithProviders(
      <RecoveryKeyStatus instanceId={instanceNoActivityNoKey.id} />,
    );
    await expectLoadingState();

    const noDataElement = await screen.findByText(NO_DATA_TEXT);

    expect(noDataElement).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders masked recovery key when key exists and no activity", async () => {
    renderWithProviders(
      <RecoveryKeyStatus instanceId={instanceNoActivityWithKey.id} />,
    );

    await expectLoadingState();
    const maskedKeyElement = await screen.findByText(MASKED_VALUE);

    expect(maskedKeyElement).toBeInTheDocument();
  });

  it("renders activity status when recovery key activity exists (no key)", async () => {
    renderWithProviders(
      <RecoveryKeyStatus instanceId={instanceActivityNoKey.id} />,
    );
    await expectLoadingState();
    expect(await screen.findByText(/activity:/i)).toBeInTheDocument();
    expect(screen.getByText(/queued/i)).toBeInTheDocument();
    expect(screen.queryByText(MASKED_VALUE)).not.toBeInTheDocument();
    expect(screen.queryByText(NO_DATA_TEXT)).not.toBeInTheDocument();
  });

  it("prioritizes activity status over key display when both exist", async () => {
    renderWithProviders(
      <RecoveryKeyStatus instanceId={instanceActivityWithKey.id} />,
    );

    await expectLoadingState();
    expect(await screen.findByText(/activity:/i)).toBeInTheDocument();
    expect(screen.getByText(/queued/i)).toBeInTheDocument();
    expect(screen.queryByText(MASKED_VALUE)).not.toBeInTheDocument();
  });

  it("shows warning tooltip when activity is failed and recovery key still exists", async () => {
    renderWithProviders(
      <RecoveryKeyStatus instanceId={instanceFailedActivityWithKey.id} />,
    );

    await expectLoadingState();
    expect(await screen.findByText(MASKED_VALUE)).toBeInTheDocument();

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows warning tooltip when activity is canceled and recovery key still exists", async () => {
    renderWithProviders(
      <RecoveryKeyStatus instanceId={instanceCanceledActivityWithKey.id} />,
    );

    await expectLoadingState();
    expect(await screen.findByText(MASKED_VALUE)).toBeInTheDocument();

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it.each([
    [instanceFailedActivityNoKey.id, /failed/i],
    [instanceCanceledActivityNoKey.id, /canceled/i],
  ])(
    "does not show terminal activity status when key does not exist (instance %s)",
    async (instanceId, activityStatusText) => {
      renderWithProviders(<RecoveryKeyStatus instanceId={instanceId} />);

      await expectLoadingState();
      expect(await screen.findByText(NO_DATA_TEXT)).toBeInTheDocument();
      expect(screen.queryByText(/activity:/i)).not.toBeInTheDocument();
      expect(screen.queryByText(activityStatusText)).not.toBeInTheDocument();
    },
  );
});
