import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import { createFormik } from "@/tests/formik";
import type { ScheduleBlockFormProps } from "../../types";
import ScheduleBlockBase from "./ScheduleBlockBase";

const getFormik = (values: Partial<ScheduleBlockFormProps>) =>
  createFormik<ScheduleBlockFormProps>({
    day_of_month_type: "day-of-month",
    days: [],
    every: 1,
    end_date: "",
    end_type: "never",
    months: [],
    start_date: "2026-03-17T12:00",
    start_type: "on-a-date",
    unit_of_time: "DAILY",
    ...values,
  });

describe("ScheduleBlockBase", () => {
  it("renders the date input for one-time schedule", () => {
    const formik = getFormik({ start_type: "on-a-date" });

    render(<ScheduleBlockBase formik={formik} />);

    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.queryByLabelText("Start date")).not.toBeInTheDocument();
  });

  it("renders recurring schedule fields", () => {
    const formik = getFormik({
      start_type: "recurring",
      every: 2,
      unit_of_time: "MONTHLY",
      end_type: "on-a-date",
      end_date: "2026-03-20T12:00",
    });

    render(<ScheduleBlockBase formik={formik} />);

    expect(screen.getByLabelText("Start date")).toBeInTheDocument();
    expect(screen.getAllByLabelText("Repeat every")).toHaveLength(2);
    expect(screen.getByRole("option", { name: "Months" })).toBeInTheDocument();
    expect(screen.getByLabelText("On")).toBeInTheDocument();
    expect(screen.getByLabelText("Ends")).toBeInTheDocument();
    expect(screen.getByLabelText("End date")).toBeInTheDocument();
  });

  it("does not render end date input when recurring end type is never", () => {
    const formik = getFormik({
      start_type: "recurring",
      end_type: "never",
    });

    render(<ScheduleBlockBase formik={formik} />);

    expect(screen.queryByLabelText("End date")).not.toBeInTheDocument();
  });
});
