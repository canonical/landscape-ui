import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT, NOT_AVAILABLE } from "@/constants";
import { pockets } from "@/tests/mocks/pockets";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import moment from "moment";
import type { ComponentProps } from "react";
import { describe, expect, vi } from "vitest";
import PocketSyncActivity from "./PocketSyncActivity";
import type { MirrorPocket, PullPocket } from "../../types/Pocket";
import { ACTIVITY_STATUSES } from "@/features/activities";

const commonProps = {
  syncPocketRefs: [],
  syncPocketRefAdd: vi.fn(),
};

const propsWithUploadPocket: ComponentProps<typeof PocketSyncActivity> = {
  ...commonProps,
  pocket: pockets.find((p) => p.mode === "upload") ?? pockets[0],
};

const propsWithNoLastSyncStatus: ComponentProps<typeof PocketSyncActivity> = {
  ...commonProps,
  pocket:
    pockets.find((p) => p.mode !== "upload" && !p.last_sync_status) ??
    pockets[0],
};

const propsWithSyncedLastSyncStatus: ComponentProps<typeof PocketSyncActivity> =
  {
    ...commonProps,
    pocket:
      pockets.find((p) => p.mode !== "upload" && p.last_sync_time) ??
      pockets[0],
  };

const propsWithInProgressLastSyncStatus: ComponentProps<
  typeof PocketSyncActivity
> = {
  ...commonProps,
  pocket:
    pockets.find(
      (p) =>
        p.mode !== "upload" &&
        p.last_sync_status === "in progress" &&
        p.last_sync_activity !== null,
    ) ?? pockets[0],
};

const propsWithMirrorPocket: ComponentProps<typeof PocketSyncActivity> = {
  ...commonProps,
  pocket: pockets.find((p) => p.mode === "mirror") ?? pockets[0],
};

describe("PocketSyncActivity", () => {
  it("renders upload pocket", () => {
    renderWithProviders(<PocketSyncActivity {...propsWithUploadPocket} />);
    expect(screen.getByText(NOT_AVAILABLE)).toBeVisible();
  });

  it("renders pocket with no last sync status", () => {
    renderWithProviders(<PocketSyncActivity {...propsWithNoLastSyncStatus} />);

    expect(screen.getByText(NO_DATA_TEXT)).toBeVisible();
  });

  it("renders pocket with synced last sync status", () => {
    renderWithProviders(
      <PocketSyncActivity {...propsWithSyncedLastSyncStatus} />,
    );

    expect(
      screen.getByText(
        moment(
          (propsWithSyncedLastSyncStatus.pocket as MirrorPocket | PullPocket)
            .last_sync_time,
        ).format(DISPLAY_DATE_TIME_FORMAT),
      ),
    ).toBeVisible();
  });

  it("renders pocket with in progress last sync status", () => {
    renderWithProviders(
      <PocketSyncActivity {...propsWithInProgressLastSyncStatus} />,
    );

    expect(
      screen.getByText(
        `${
          (
            propsWithInProgressLastSyncStatus.pocket as
              | MirrorPocket
              | PullPocket
          ).last_sync_activity?.progress
        }%`,
      ),
    ).toBeVisible();
  });

  it("renders pocket activity status", () => {
    renderWithProviders(<PocketSyncActivity {...propsWithMirrorPocket} />);

    const pocket = propsWithMirrorPocket.pocket as MirrorPocket;

    const key =
      pocket.last_sync_status === "queued"
        ? "undelivered"
        : (pocket.last_sync_status as "canceled" | "failed" | "undelivered");

    expect(screen.getByText(ACTIVITY_STATUSES[key].label)).toBeVisible();
  });
});
