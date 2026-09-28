import { expectLoadingState } from "@/tests/helpers";
import { activities } from "@/tests/mocks/activity";
import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ActivityDetails from "./ActivityDetails";
import type { Creator } from "@/types/Creator";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

describe("ActivityDetails", () => {
  it("renders activity details with all information", async () => {
    const [activity] = activities;

    renderWithProviders(<ActivityDetails activityId={activity.id} />);
    await expectLoadingState();

    expect(screen.getByText(activity.summary)).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByText("Created at")).toBeInTheDocument();
    if (activity.delivery_time) {
      expect(screen.getByText("Delivered at")).toBeInTheDocument();
    }
  });

  it("renders instance link when computer_id is present", async () => {
    const [activity] = activities;
    const expectedInstance = instances.find(
      (i) => i.id === activity.computer_id,
    );

    renderWithProviders(<ActivityDetails activityId={activity.id} />);

    await expectLoadingState();

    if (expectedInstance) {
      await screen.findByText(expectedInstance.title);
      expect(screen.getByText("Instance")).toBeInTheDocument();
      expect(screen.getByText(expectedInstance.title)).toBeInTheDocument();
    }
  });

  it("renders the activity creator when present", async () => {
    const activity = activities.find(
      (activity): activity is typeof activity & { creator: Creator } =>
        activity.creator !== null,
    );

    assert(activity);

    renderWithProviders(<ActivityDetails activityId={activity.id} />);

    await expectLoadingState();

    const creatorLabel = screen.getByText("Creator");
    expect(creatorLabel).toBeInTheDocument();

    const creatorContainer = creatorLabel.parentElement;
    assert(creatorContainer);

    expect(
      within(creatorContainer).getByText(activity.creator.name),
    ).toBeInTheDocument();
  });

  it("renders no-data text when activity creator is not present", async () => {
    const activity = activities.find((activity) => activity.creator === null);

    assert(activity);

    renderWithProviders(<ActivityDetails activityId={activity.id} />);

    await expectLoadingState();

    const creatorLabel = screen.getByText("Creator");
    expect(creatorLabel).toBeInTheDocument();

    const creatorContainer = creatorLabel.parentElement;
    assert(creatorContainer);

    expect(
      within(creatorContainer).getByText(NO_DATA_TEXT),
    ).toBeInTheDocument();
  });

  it("renders output when result_text is present", async () => {
    const activity = activities.find((a) => a.result_text !== null);
    assert(activity);

    renderWithProviders(<ActivityDetails activityId={activity.id} />);

    await expectLoadingState();

    expect(screen.getByText("Output")).toBeInTheDocument();
  });

  it("does not render output when result_text is null", async () => {
    const activity = activities.find((a) => a.result_text === null);
    assert(activity);

    renderWithProviders(<ActivityDetails activityId={activity.id} />);

    await expectLoadingState();

    expect(screen.queryByText("Output")).not.toBeInTheDocument();
  });

  it("does not render completed at when completion_time is null", async () => {
    const activity = activities.find((a) => a.completion_time === null);
    assert(activity);

    renderWithProviders(<ActivityDetails activityId={activity.id} />);

    await expectLoadingState();

    expect(screen.queryByText("Completed at")).not.toBeInTheDocument();
  });

  it("renders ActivityDetailsButtons component", async () => {
    const [activity] = activities;

    renderWithProviders(<ActivityDetails activityId={activity.id} />);

    await expectLoadingState();

    if (activity.actions?.approvable) {
      expect(screen.getByText("Approve")).toBeInTheDocument();
    }
    if (activity.actions?.cancelable) {
      expect(screen.getByText(/Cancel/)).toBeInTheDocument();
    }
  });

  it("renders activity with completion time when present", async () => {
    const activityWithCompletion = activities.find(
      (a) => a.completion_time !== null,
    );
    assert(activityWithCompletion);

    renderWithProviders(
      <ActivityDetails activityId={activityWithCompletion.id} />,
    );

    await expectLoadingState();

    expect(screen.getByText("Completed at")).toBeInTheDocument();
  });
});
