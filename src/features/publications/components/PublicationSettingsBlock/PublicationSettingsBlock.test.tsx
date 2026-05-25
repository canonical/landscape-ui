import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PublicationSettingsBlock } from "../..";
import { createFormik } from "@/tests/formik";
import type { Publication } from "@canonical/landscape-openapi";

const createPublicationSettingsFormik = (
  automaticUpgrades = false,
  limitAutomaticInstallation = true,
) =>
  createFormik({
    hashIndexing: false,
    limitAutomaticInstallation,
    automaticUpgrades,
    skipBz2: false,
    skipContentIndexing: false,
  });

const publication = {
  acquireByHash: true,
  notAutomatic: true,
  butAutomaticUpgrades: true,
  skipBz2: true,
  skipContents: true,
} as unknown as Publication;

describe("PublicationSettingsBlock", () => {
  it("renders disabled checkbox settings if no formik", () => {
    renderWithProviders(<PublicationSettingsBlock />);

    expect(
      screen.getByRole("checkbox", { name: /hash based indexing/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("checkbox", { name: /limit automatic installation/i }),
    ).toBeDisabled();
    expect(
      screen.queryByRole("checkbox", { name: /automatic upgrades/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /skip bz2/i })).toBeDisabled();
    expect(
      screen.getByRole("checkbox", {
        name: /skip generating content indexes/i,
      }),
    ).toBeDisabled();
  });

  it("renders existing disabled publication settings if publication is provided", () => {
    renderWithProviders(<PublicationSettingsBlock publication={publication} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(5);

    for (const checkbox of checkboxes) {
      expect(checkbox).toBeChecked();
      expect(checkbox).toBeDisabled();
    }
  });

  it("shows automatic upgrades if limit automatic installation is checked", async () => {
    const formik = createPublicationSettingsFormik();

    renderWithProviders(<PublicationSettingsBlock formik={formik} />);

    expect(
      screen.getByRole("checkbox", { name: /limit automatic installation/i }),
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: /automatic upgrades/i }),
    ).toBeInTheDocument();
  });

  it("resets automatic upgrades when limit automatic installation is unchecked", async () => {
    const formik = createPublicationSettingsFormik(true);
    const user = userEvent.setup();

    renderWithProviders(<PublicationSettingsBlock formik={formik} />);

    const autoInstallCheckbox = screen.getByRole("checkbox", {
      name: /limit automatic installation/i,
    });

    await user.click(autoInstallCheckbox);

    expect(formik.setFieldValue).toHaveBeenCalledWith(
      "automaticUpgrades",
      false,
    );
    expect(formik.values.automaticUpgrades).toBe(false);
  });

  it("does not reset automatic upgrades when limit automatic installation is checked", async () => {
    const formik = createPublicationSettingsFormik(true, false);
    const user = userEvent.setup();

    renderWithProviders(<PublicationSettingsBlock formik={formik} />);

    const autoInstallCheckbox = screen.getByRole("checkbox", {
      name: /limit automatic installation/i,
    });

    await user.click(autoInstallCheckbox);

    expect(formik.setFieldValue).not.toHaveBeenCalled();
    expect(formik.values.automaticUpgrades).toBe(true);
  });
});
