import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import { createFormik } from "@/tests/formik";
import type { ScheduleBlockFormProps } from "../../types";
import ScheduleBlock from "./ScheduleBlock";

const formik = createFormik<ScheduleBlockFormProps>({
  day_of_month_type: "day-of-month",
  days: [],
  every: 1,
  end_date: "",
  end_type: "never",
  months: [],
  start_date: "",
  start_type: "on-a-date",
  unit_of_time: "DAILY",
});

describe("ScheduleBlock", () => {
  it("renders the schedule type select and schedule base content", () => {
    render(<ScheduleBlock formik={formik} />);

    expect(screen.getByLabelText("Schedule")).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "On a date" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Recurring" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
  });
});
