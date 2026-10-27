import { activities } from "@/tests/mocks/activity";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ActivitiesList from "./ActivitiesList";
import Activities from "../Activities";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";

describe("ActivitiesList selection", () => {
  afterEach(resetScreenSize);
  it.each([true, false])(
    "clears an all-selected row using an explicit handler: %s",
    async (explicitHandler) => {
      const clear = vi.fn();
      const setSelected = vi.fn();
      renderWithProviders(
        <ActivitiesList
          activities={activities}
          selectedActivities={[]}
          setSelectedActivities={setSelected}
          isAllSelected
          onClearSelection={explicitHandler ? clear : undefined}
        />,
      );
      await userEvent.click(
        screen.getByRole("checkbox", { name: activities[0].summary }),
      );
      if (explicitHandler) {
        expect(clear).toHaveBeenCalledTimes(1);
        expect(setSelected).not.toHaveBeenCalled();
      } else {
        expect(setSelected).toHaveBeenCalledWith([]);
      }
    },
  );

  it("deselects one selected row without affecting another", async () => {
    const setSelected = vi.fn();
    const [first, second] = activities;
    renderWithProviders(
      <ActivitiesList
        activities={activities}
        selectedActivities={[first, second]}
        setSelectedActivities={setSelected}
      />,
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: first.summary }),
    );
    expect(setSelected).toHaveBeenCalledWith([second]);
    await userEvent.click(screen.getByRole("checkbox", { name: "Toggle all" }));
    expect(setSelected).toHaveBeenLastCalledWith([]);
  });

  it.each([true, false])(
    "clears selection when filters change with explicit callback %s",
    async (explicitHandler) => {
      setScreenSize("xxl");
      const clear = vi.fn();
      const setSelected = vi.fn();
      renderWithProviders(
        <Activities
          activities={activities}
          activitiesCount={activities.length}
          isGettingActivities={false}
          selectedActivities={[activities[0]]}
          setSelectedActivities={setSelected}
          onClearSelection={explicitHandler ? clear : undefined}
        />,
      );
      await userEvent.click(screen.getByRole("button", { name: "Status" }));
      await userEvent.click(screen.getByRole("button", { name: "Failed" }));
      if (explicitHandler) {
        expect(clear).toHaveBeenCalledTimes(1);
        expect(setSelected).not.toHaveBeenCalled();
      } else {
        expect(setSelected).toHaveBeenCalledWith([]);
      }
    },
  );
});
