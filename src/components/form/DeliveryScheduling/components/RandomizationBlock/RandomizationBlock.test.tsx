import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it } from "vitest";
import { createFormik } from "@/tests/formik";
import RandomizationBlock from "./RandomizationBlock";

describe("RandomizationBlock", () => {
  it("renders yes/no options and the delay window input when randomization is enabled", () => {
    const formik = createFormik({
      randomize_delivery: true,
      deliver_delay_window: 30,
    });

    render(<RandomizationBlock formik={formik} />);

    expect(
      screen.getByText("Randomize delivery over a time window"),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Yes" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "No" })).not.toBeChecked();
    expect(screen.getByLabelText("Delivery delay window")).toBeInTheDocument();
  });

  it("resets the delay window to 0 when selecting 'No'", async () => {
    const user = userEvent.setup();
    const formik = createFormik({
      randomize_delivery: true,
      deliver_delay_window: 30,
    });

    render(<RandomizationBlock formik={formik} />);

    await user.click(screen.getByRole("radio", { name: "No" }));

    expect(formik.setFieldValue).toHaveBeenNthCalledWith(
      1,
      "randomize_delivery",
      false,
    );
    expect(formik.setFieldValue).toHaveBeenNthCalledWith(
      2,
      "deliver_delay_window",
      0,
    );
  });
});
