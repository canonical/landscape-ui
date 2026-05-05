import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { createFormik } from "@/tests/formik";
import AssociationBlock from "./AssociationBlock";

describe("AssociationBlock", () => {
  const user = userEvent.setup();

  it("renders the Association heading", () => {
    const formik = createFormik({ all_computers: false, tags: [] });

    renderWithProviders(<AssociationBlock formik={formik} />);

    expect(screen.getByText("Association")).toBeInTheDocument();
  });

  it("renders the 'Associate to all instances' checkbox", () => {
    const formik = createFormik({ all_computers: false, tags: [] });

    renderWithProviders(<AssociationBlock formik={formik} />);

    expect(
      screen.getByRole("checkbox", { name: /associate to all instances/i }),
    ).toBeInTheDocument();
  });

  it("hides the tags multiselect when all_computers is true", () => {
    const formik = createFormik({ all_computers: true, tags: [] });

    renderWithProviders(<AssociationBlock formik={formik} />);

    expect(screen.queryByText("Tags")).not.toBeInTheDocument();
  });

  it("shows the tags multiselect when all_computers is false", async () => {
    const formik = createFormik({ all_computers: false, tags: [] });

    renderWithProviders(<AssociationBlock formik={formik} />);

    expect(await screen.findByText("Tags")).toBeInTheDocument();
  });

  it("shows selected tags as chips when all_computers is false", async () => {
    const formik = createFormik({
      all_computers: false,
      tags: ["appservers"],
    });

    renderWithProviders(<AssociationBlock formik={formik} />);

    expect(await screen.findByText("appservers")).toBeInTheDocument();
  });

  it("unchecks the checkbox when all_computers is false", () => {
    const formik = createFormik({ all_computers: false, tags: [] });

    renderWithProviders(<AssociationBlock formik={formik} />);

    expect(
      screen.getByRole("checkbox", { name: /associate to all instances/i }),
    ).not.toBeChecked();
  });

  it("checks the checkbox when all_computers is true", () => {
    const formik = createFormik({ all_computers: true, tags: [] });

    renderWithProviders(<AssociationBlock formik={formik} />);

    expect(
      screen.getByRole("checkbox", { name: /associate to all instances/i }),
    ).toBeChecked();
  });

  it("calls setFieldValue when a chip is dismissed", async () => {
    const formik = createFormik({
      all_computers: false,
      tags: ["appservers"],
    });

    renderWithProviders(<AssociationBlock formik={formik} />);

    const dismissButton = await screen.findByRole("button", {
      name: /dismiss/i,
    });
    await user.click(dismissButton);

    await waitFor(() => {
      expect(formik.setFieldValue).toHaveBeenCalledWith("tags", []);
    });
  });

  it("calls setFieldValue when tags are selected via multiselect", async () => {
    const formik = createFormik({ all_computers: false, tags: [] });

    renderWithProviders(<AssociationBlock formik={formik} />);

    await screen.findByText("Tags");

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    const checkbox = await screen.findByRole("checkbox", {
      name: "appservers",
    });
    await user.click(checkbox);

    await waitFor(() => {
      expect(formik.setFieldValue).toHaveBeenCalledWith(
        "tags",
        expect.arrayContaining(["appservers"]),
      );
    });
  });
});
