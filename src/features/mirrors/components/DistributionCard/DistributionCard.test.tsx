import { distributions } from "@/tests/mocks/distributions";
import type { ComponentProps } from "react";
import DistributionCard from "./DistributionCard";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";

const commonProps: ComponentProps<typeof DistributionCard> = {
  distribution: {
    access_group: "",
    creation_time: "",
    name: "distribution-name",
    series: [],
  },
  syncPocketRefAdd: vi.fn(),
  syncPocketRefs: [],
};

const emptySeriesProps: ComponentProps<typeof DistributionCard> = commonProps;
const withSeriesProps: ComponentProps<typeof DistributionCard> = {
  ...commonProps,
  distribution: {
    ...commonProps.distribution,
    series: distributions.find((d) => d.series.length > 0)?.series ?? [],
  },
};

const checkModalActions = async ({ isLarge }: { isLarge: boolean }) => {
  const removeDistributionButton = await screen.findByRole("button", {
    name: /remove distribution/i,
  });

  expect(removeDistributionButton).toBeVisible();

  await userEvent.click(removeDistributionButton);

  const removeButton = screen.getByRole("button", {
    name: "Remove",
  });
  const cancelButton = screen.getByRole("button", {
    name: /cancel/i,
  });

  expect(removeButton).toBeVisible();
  expect(cancelButton).toBeVisible();

  expect(
    screen.getByText("Are you sure? This action cannot be undone."),
  ).toBeVisible();

  await userEvent.click(cancelButton);

  if (!isLarge) {
    await userEvent.click(screen.getByText(/actions/i));
  }
  const addSeriesButton = await screen.findByRole("button", {
    name: /add series/i,
  });
  expect(addSeriesButton).toBeVisible();
};

describe("DistributionCard", () => {
  afterEach(() => {
    resetScreenSize();
  });

  it("renders menu buttons", async () => {
    setScreenSize("large");

    renderWithProviders(<DistributionCard {...commonProps} />);

    await checkModalActions({ isLarge: true });
  });

  it("renders contextual menu buttons", async () => {
    setScreenSize("small");

    renderWithProviders(<DistributionCard {...commonProps} />);

    const contextualMenuButton = await screen.findByRole("button", {
      name: /actions/i,
    });
    expect(contextualMenuButton).toBeVisible();

    await userEvent.click(contextualMenuButton);
    await checkModalActions({ isLarge: false });
  });

  it("renders empty distribution card", () => {
    renderWithProviders(<DistributionCard {...emptySeriesProps} />);

    expect(screen.getByText(emptySeriesProps.distribution.name)).toBeVisible();
    expect(screen.getByText("No series have been added yet")).toBeVisible();
    expect(
      screen.getByText("Add a new mirror or series to get started"),
    ).toBeVisible();
    expect(
      screen.getByRole("button", {
        name: /add mirror/i,
      }),
    ).toBeVisible();
  });

  it("renders distribution card with series", () => {
    const { container } = renderWithProviders(
      <DistributionCard {...withSeriesProps} />,
    );

    expect(screen.getByText(withSeriesProps.distribution.name)).toBeVisible();

    expect(container).toHaveTexts(["Pocket", "Mode", "Last synced", "Content"]);
    for (const series of withSeriesProps.distribution.series) {
      expect(screen.getByText(series.name)).toBeVisible();
    }
  });
});
