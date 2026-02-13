import { renderWithProviders } from "@/tests/render";
import {
  instanceActivityNoKey,
  instanceActivityWithKey,
  instanceNoActivityNoKey,
  instanceNoActivityWithKey,
} from "@/tests/mocks/instance";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RecoveryKeyStatus from "./RecoveryKeyStatus";
import { RECOVERY_KEY_MASK } from "./constants";
import { expectLoadingState } from "@/tests/helpers";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

describe("RecoveryKeyStatus", () => {
  it("renders loading state initially", () => {
    renderWithProviders(
      <RecoveryKeyStatus instanceId={instanceNoActivityNoKey.id} />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
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
    const maskedKeyElement = await screen.findByText(RECOVERY_KEY_MASK);

    expect(maskedKeyElement).toBeInTheDocument();
  });

  it("renders 'Activity queued' when recovery key activity is in progress (no key)", async () => {
    renderWithProviders(
      <RecoveryKeyStatus instanceId={instanceActivityNoKey.id} />,
    );
    await expectLoadingState();
    const activityQueuedElement = await screen.findByText("Activity queued");

    expect(activityQueuedElement).toBeInTheDocument();
    expect(screen.queryByText(RECOVERY_KEY_MASK)).not.toBeInTheDocument();
    expect(screen.queryByText(NO_DATA_TEXT)).not.toBeInTheDocument();
  });

  it("prioritizes activity queued state over key display when both exist", async () => {
    renderWithProviders(
      <RecoveryKeyStatus instanceId={instanceActivityWithKey.id} />,
    );

    await expectLoadingState();
    const activityQueuedElement = await screen.findByText("Activity queued");

    expect(activityQueuedElement).toBeInTheDocument();
    expect(screen.queryByText(RECOVERY_KEY_MASK)).not.toBeInTheDocument();
  });
});
