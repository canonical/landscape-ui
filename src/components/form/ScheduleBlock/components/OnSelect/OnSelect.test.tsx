import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
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
  const user = userEvent.setup();

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

  it("returns null for DAILY unit_of_time", () => {
    const formik = getFormik({ unit_of_time: "DAILY" });

    const { container } = render(<OnSelect formik={formik} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("calls setFieldValue when a day is selected in WEEKLY mode", async () => {
    const formik = getFormik({ unit_of_time: "WEEKLY", days: [] });

    render(<OnSelect formik={formik} />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    const sundayCheckbox = await screen.findByRole("checkbox", {
      name: /sunday/i,
    });
    await user.click(sundayCheckbox);

    await waitFor(() => {
      expect(formik.setFieldValue).toHaveBeenCalledWith(
        "days",
        expect.arrayContaining(["SU"]),
      );
    });
  });

  it("calls setFieldValue when a month is selected in YEARLY mode", async () => {
    const formik = getFormik({ unit_of_time: "YEARLY", months: [] });

    render(<OnSelect formik={formik} />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    const januaryCheckbox = await screen.findByRole("checkbox", {
      name: /january/i,
    });
    await user.click(januaryCheckbox);

    await waitFor(() => {
      expect(formik.setFieldValue).toHaveBeenCalledWith(
        "months",
        expect.arrayContaining([1]),
      );
    });
  });
});
