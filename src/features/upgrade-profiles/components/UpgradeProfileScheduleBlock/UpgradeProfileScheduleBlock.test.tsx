import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FormikErrors, FormikTouched } from "formik";
import { useFormik } from "formik";
import type { FC } from "react";
import { describe, expect, it } from "vitest";
import type { FormProps } from "../../types";
import UpgradeProfileScheduleBlock from "./UpgradeProfileScheduleBlock";

const BASE_VALUES: FormProps = {
  every: "week",
  title: "Weekly upgrades",
  upgrade_type: "all",
  all_computers: true,
  autoremove: false,
  deliver_within: 30,
  on_days: ["mo"],
  tags: [],
  at_hour: 10,
  at_minute: 30,
  deliver_delay_window: 0,
  randomize_delivery: false,
};

interface HarnessProps {
  readonly initialValues?: Partial<FormProps>;
  readonly initialErrors?: FormikErrors<FormProps>;
  readonly initialTouched?: FormikTouched<FormProps>;
}

const ComponentWithFormik: FC<HarnessProps> = ({
  initialValues,
  initialErrors,
  initialTouched,
}) => {
  const formik = useFormik<FormProps>({
    initialValues: { ...BASE_VALUES, ...initialValues },
    initialErrors,
    initialTouched,
    onSubmit: () => undefined,
  });

  return <UpgradeProfileScheduleBlock formik={formik} />;
};

describe("UpgradeProfileScheduleBlock", () => {
  it("renders schedule controls for weekly mode", () => {
    renderWithProviders(<ComponentWithFormik />);

    expect(screen.getByText("Schedule")).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "At a specific time" }),
    ).toBeChecked();
    expect(screen.getByRole("radio", { name: "Hourly" })).not.toBeChecked();
    expect(screen.getByLabelText("at hour")).toBeInTheDocument();
    expect(screen.getByLabelText("at minute")).toBeInTheDocument();
  });

  it("renders hourly controls without the hour input", () => {
    renderWithProviders(
      <ComponentWithFormik initialValues={{ every: "hour" }} />,
    );

    expect(screen.getByRole("radio", { name: "Hourly" })).toBeChecked();
    expect(screen.queryByLabelText("at hour")).not.toBeInTheDocument();
    expect(screen.getByLabelText("at minute")).toBeInTheDocument();
    expect(screen.getByText("minute")).toBeInTheDocument();
  });

  it("switches from weekly to hourly mode", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ComponentWithFormik />);

    expect(screen.getByLabelText("at hour")).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Hourly" }));

    await waitFor(() => {
      expect(screen.queryByLabelText("at hour")).not.toBeInTheDocument();
    });
    expect(screen.getByRole("radio", { name: "Hourly" })).toBeChecked();
  });

  it("switches from hourly back to weekly mode", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ComponentWithFormik initialValues={{ every: "hour" }} />,
    );

    expect(screen.queryByLabelText("at hour")).not.toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "At a specific time" }));

    expect(await screen.findByLabelText("at hour")).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "At a specific time" }),
    ).toBeChecked();
  });

  it("updates the selected days", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ComponentWithFormik />);

    await user.click(screen.getByRole("combobox", { name: /days/i }));

    expect(
      await screen.findByRole("checkbox", { name: "Monday" }),
    ).toBeChecked();

    await user.click(screen.getByRole("checkbox", { name: "Friday" }));

    expect(screen.getByRole("checkbox", { name: "Friday" })).toBeChecked();
  });

  it("shows validation errors for the time fields", () => {
    renderWithProviders(
      <ComponentWithFormik
        initialErrors={{
          at_hour: "Hour is required",
          at_minute: "Minute is required",
          deliver_within: "Expiration window is required",
        }}
        initialTouched={{
          at_hour: true,
          at_minute: true,
          deliver_within: true,
        }}
      />,
    );

    expect(screen.getByText("Hour is required")).toBeInTheDocument();
    expect(screen.getByText("Minute is required")).toBeInTheDocument();
    expect(
      screen.getByText("Expiration window is required"),
    ).toBeInTheDocument();
    expect(screen.getByText(/error:/i)).toBeInTheDocument();
  });
});
