import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { createFormik } from "@/tests/formik";
import UdebCheckboxInput from "./UdebCheckboxInput";

describe("UdebCheckboxInput", () => {
  it("renders the checkbox with label text", () => {
    const formik = createFormik({ include_udeb: false });

    renderWithProviders(<UdebCheckboxInput formik={formik} />);

    expect(screen.getByText("Include .udeb packages")).toBeInTheDocument();
  });

  it("renders an unchecked checkbox when include_udeb is false", () => {
    const formik = createFormik({ include_udeb: false });

    renderWithProviders(<UdebCheckboxInput formik={formik} />);

    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("renders a checked checkbox when include_udeb is true", () => {
    const formik = createFormik({ include_udeb: true });

    renderWithProviders(<UdebCheckboxInput formik={formik} />);

    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("renders the help tooltip icon", () => {
    const formik = createFormik({ include_udeb: false });

    renderWithProviders(<UdebCheckboxInput formik={formik} />);

    expect(screen.getByText("Help")).toBeInTheDocument();
  });
});
