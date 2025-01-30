import { distributions } from "@/tests/mocks/distributions";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_SNAPSHOT_URI } from "../../constants";
import SeriesCard from "./SeriesCard";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import type { MirrorPocket } from "../../types/Pocket";
import { DISPLAY_DATE_FORMAT } from "@/constants";
import type { Distribution } from "../../types";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";

const checkModalActions = async ({
  isLarge,
  distributionName,
  seriesName,
}: {
  isLarge: boolean;
  distributionName: string;
  seriesName: string;
}) => {
  if (!isLarge) {
    const actionsButton = screen.getByText(/actions/i);
    await userEvent.click(actionsButton);
  }
  const deriveSeriesButton = await screen.findByRole("button", {
    name: /derive series/i,
  });
  expect(deriveSeriesButton).toBeVisible();
  await userEvent.click(deriveSeriesButton);

  const deriveSeriesFormHeaderText = await screen.findByRole("heading", {
    name: /derive series/i,
  });
  expect(deriveSeriesFormHeaderText).toBeVisible();
  await userEvent.click(
    screen.getByRole("button", { name: /close side panel/i }),
  );

  if (!isLarge) {
    const actionsButton = screen.getByText(/actions/i);
    await userEvent.click(actionsButton);
  }

  const newPocketButton = await screen.findByRole("button", {
    name: /new pocket/i,
  });
  expect(newPocketButton).toBeVisible();

  const removeButton = screen.getByRole("button", {
    name: `Remove ${distributionName}/${seriesName}`,
  });
  expect(removeButton).toBeVisible();

  await userEvent.click(removeButton);

  expect(
    screen.getByText("Are you sure? This action cannot be undone."),
  ).toBeVisible();

  const cancelButton = screen.getByRole("button", {
    name: /cancel/i,
  });
  expect(cancelButton).toBeVisible();

  await userEvent.click(cancelButton);
};

const findDistributionWithoutSnapshot = (): Distribution => {
  const dist = distributions.find((d) =>
    d.series.some((s) =>
      s.pockets.every(
        (p) =>
          p.mode !== "mirror" ||
          (p.mode === "mirror" &&
            !p.mirror_uri.startsWith(DEFAULT_SNAPSHOT_URI)),
      ),
    ),
  );
  return dist ?? distributions[0];
};

const findDistributionWithSnapshot = () => {
  const dist = distributions.find((d) =>
    d.series.some((s) =>
      s.pockets.some(
        (p) =>
          p.mode === "mirror" && p.mirror_uri.startsWith(DEFAULT_SNAPSHOT_URI),
      ),
    ),
  );
  return dist ?? distributions[0];
};

const distributionWithoutSnapshot = findDistributionWithoutSnapshot();
const distributionWithSnapshot = findDistributionWithSnapshot();

const seriesWithoutSnapshot =
  distributionWithoutSnapshot.series.find((s) =>
    s.pockets.some(
      (p) =>
        p.mode === "mirror" && !p.mirror_uri.startsWith(DEFAULT_SNAPSHOT_URI),
    ),
  ) ?? distributionWithoutSnapshot.series[0];
const seriesWithSnapshot =
  distributionWithSnapshot.series.find((s) =>
    s.pockets.some(
      (p) =>
        p.mode === "mirror" && p.mirror_uri.startsWith(DEFAULT_SNAPSHOT_URI),
    ),
  ) ?? distributionWithSnapshot.series[0];

const propsWithoutSnapshotDate: ComponentProps<typeof SeriesCard> = {
  distribution: distributionWithoutSnapshot,
  series: seriesWithoutSnapshot,
  syncPocketRefAdd: vi.fn(),
  syncPocketRefs: [],
};

const propsWithSnapshotDate: ComponentProps<typeof SeriesCard> = {
  distribution: distributionWithSnapshot,
  series: seriesWithSnapshot,
  syncPocketRefAdd: vi.fn(),
  syncPocketRefs: [],
};

describe("SeriesCard", () => {
  afterEach(() => {
    resetScreenSize();
  });

  it("renders series card", () => {
    const { container } = renderWithProviders(
      <SeriesCard {...propsWithoutSnapshotDate} />,
    );
    expect(
      screen.getByText(propsWithoutSnapshotDate.series.name),
    ).toBeVisible();

    expect(container).toHaveTexts(["Pocket", "Mode", "Last synced", "Content"]);
  });

  it("renders series card buttons", async () => {
    setScreenSize("large");

    renderWithProviders(<SeriesCard {...propsWithoutSnapshotDate} />);
    expect(
      screen.getByText(propsWithoutSnapshotDate.series.name),
    ).toBeVisible();

    await checkModalActions({
      isLarge: true,
      distributionName: propsWithoutSnapshotDate.distribution.name,
      seriesName: propsWithoutSnapshotDate.series.name,
    });
  });

  it("renders series card contextual buttons", async () => {
    setScreenSize("small");

    renderWithProviders(<SeriesCard {...propsWithoutSnapshotDate} />);

    expect(
      screen.getByText(propsWithoutSnapshotDate.series.name),
    ).toBeVisible();

    await checkModalActions({
      isLarge: false,
      distributionName: propsWithoutSnapshotDate.distribution.name,
      seriesName: propsWithoutSnapshotDate.series.name,
    });
  });

  it("renders series card with snapshot date and only remove button", () => {
    setScreenSize("small");

    renderWithProviders(<SeriesCard {...propsWithSnapshotDate} />);

    const snapshotDate = `Snapshot from ${moment((propsWithSnapshotDate.series.pockets[0] as MirrorPocket).mirror_uri.replace(/^.*\/(\d{8})T\d{6}Z$/, "$1")).format(DISPLAY_DATE_FORMAT)}`;

    expect(screen.getByText(snapshotDate)).toBeVisible();

    const deriveSeriesButton = screen.queryByRole("button", {
      name: /derive series/i,
    });
    expect(deriveSeriesButton).not.toBeInTheDocument();

    const newPocketButton = screen.queryByRole("button", {
      name: /new pocket/i,
    });
    expect(newPocketButton).not.toBeInTheDocument();
  });

  it("renders only remove button on smaller screen", async () => {
    setScreenSize("small");

    renderWithProviders(<SeriesCard {...propsWithSnapshotDate} />);

    const snapshotDate = `Snapshot from ${moment((propsWithSnapshotDate.series.pockets[0] as MirrorPocket).mirror_uri.replace(/^.*\/(\d{8})T\d{6}Z$/, "$1")).format(DISPLAY_DATE_FORMAT)}`;
    expect(screen.getByText(snapshotDate)).toBeVisible();

    await userEvent.click(screen.getByText(/actions/i));

    const removeButton = screen.getByRole("button", {
      name: `Remove ${propsWithSnapshotDate.distribution.name}/${propsWithSnapshotDate.series.name}`,
    });

    expect(removeButton).toBeVisible();
    const deriveSeriesButton = screen.queryByRole("button", {
      name: /derive series/i,
    });
    expect(deriveSeriesButton).not.toBeInTheDocument();

    const newPocketButton = screen.queryByRole("button", {
      name: /new pocket/i,
    });
    expect(newPocketButton).not.toBeInTheDocument();
  });
});
