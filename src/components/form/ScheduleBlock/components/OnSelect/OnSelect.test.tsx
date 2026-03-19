import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import { createFormik } from "@/tests/formik";
import type { ScheduleBlockFormProps } from "../../types";
import OnSelect from "./OnSelect";

const getFormik = (values: Partial<ScheduleBlockFormProps>) =>
  createFormik<ScheduleBlockFormProps>({
    day_of_month_type: "day-of-month",
    days: [],
    every: 1,
    end_date: "",
    end_type: "never",
    months: [],
    start_date: "",
    start_type: "recurring",
    unit_of_time: "DAILY",
    ...values,
  });

describe("OnSelect", () => {
  it("renders weekly on-select field", () => {
    const formik = getFormik({ unit_of_time: "WEEKLY", days: ["SU"] });

    render(<OnSelect formik={formik} />);

    expect(screen.getByText("On")).toBeInTheDocument();
  });

  it("renders monthly options when start_date is provided", () => {
    const formik = getFormik({
      unit_of_time: "MONTHLY",
      start_date: "2026-03-17T12:00",
    });

    render(<OnSelect formik={formik} />);

    expect(
      screen.getByRole("option", { name: "17th of every month" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Third Tuesday of every month" }),
    ).toBeInTheDocument();
  });

  it("does not render monthly on-select when start_date is missing", () => {
    const formik = getFormik({ unit_of_time: "MONTHLY", start_date: "" });

    render(<OnSelect formik={formik} />);

    expect(screen.queryByLabelText("On")).not.toBeInTheDocument();
  });

  it("renders yearly on-select field", () => {
    const formik = getFormik({ unit_of_time: "YEARLY", months: [1] });

    render(<OnSelect formik={formik} />);

    expect(screen.getByText("On")).toBeInTheDocument();
  });
});
