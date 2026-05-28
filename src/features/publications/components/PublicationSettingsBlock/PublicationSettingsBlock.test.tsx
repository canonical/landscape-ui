import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PublicationSettingsBlock } from "../..";
import { createFormik } from "@/tests/formik";
import type { Publication } from "@canonical/landscape-openapi";
import { AUTOMATIC_LABELS } from "../../constants";

const createPublicationSettingsFormik = (
  limitAutomaticInstallation = false,
  automaticUpgrades = false,
) =>
  createFormik({
    limitAutomaticInstallation,
    automaticUpgrades,
    hashIndexing: false,
    skipBz2: false,
    skipContentIndexing: false,
  });

const getPublication = (values: boolean) =>
  ({
    acquireByHash: values,
    notAutomatic: values,
    butAutomaticUpgrades: values,
    skipBz2: values,
    skipContents: values,
  }) as unknown as Publication;

describe("PublicationSettingsBlock", () => {
  it("renders disabled checkbox settings if no formik", () => {
    renderWithProviders(
      <PublicationSettingsBlock publication={getPublication(false)} />,
    );

    expect(screen.getByText("Installs and upgrades")).toBeInTheDocument();
    expect(screen.getByText(AUTOMATIC_LABELS.both)).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /hash based indexing/i }),
    ).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: /skip bz2/i })).toBeDisabled();
    expect(
      screen.getByRole("checkbox", {
        name: /skip generating content indexes/i,
      }),
    ).toBeDisabled();
  });

  it("renders existing publication settings if publication is provided", () => {
    renderWithProviders(
      <PublicationSettingsBlock publication={getPublication(true)} />,
    );

    expect(screen.getByText(AUTOMATIC_LABELS.upgrades)).toBeInTheDocument();

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);

    for (const checkbox of checkboxes) {
      expect(checkbox).toBeChecked();
    }
  });

  it("preselects manual value from publication", () => {
    renderWithProviders(
      <PublicationSettingsBlock
        publication={{
          ...getPublication(true),
          butAutomaticUpgrades: false,
        }}
      />,
    );

    expect(screen.getByText(AUTOMATIC_LABELS.neither)).toBeInTheDocument();
  });

  it("preselects manual when installs are limited and upgrades disabled", () => {
    const formik = createPublicationSettingsFormik(true);

    renderWithProviders(<PublicationSettingsBlock formik={formik} />);

    expect(
      screen.getByRole("combobox", { name: /installs and upgrades/i }),
    ).toHaveValue("manual");
  });

  it("preselects autoUpgrades when installs are limited and upgrades enabled", () => {
    const formik = createPublicationSettingsFormik(true, true);

    renderWithProviders(<PublicationSettingsBlock formik={formik} />);

    expect(
      screen.getByRole("combobox", { name: /installs and upgrades/i }),
    ).toHaveValue("autoUpgrades");
  });

  it("selects each option in the dropdown", async () => {
    const formik = createPublicationSettingsFormik();
    const user = userEvent.setup();

    renderWithProviders(<PublicationSettingsBlock formik={formik} />);

    const dropdownInput = screen.getByRole("combobox", {
      name: /installs and upgrades/i,
    });
    expect(dropdownInput).toHaveValue("automatic");

    await user.selectOptions(dropdownInput, AUTOMATIC_LABELS.neither);
    expect(formik.values.limitAutomaticInstallation).toBe(true);
    expect(formik.values.automaticUpgrades).toBe(false);

    await user.selectOptions(dropdownInput, AUTOMATIC_LABELS.upgrades);
    expect(formik.values.limitAutomaticInstallation).toBe(true);
    expect(formik.values.automaticUpgrades).toBe(true);

    await user.selectOptions(dropdownInput, AUTOMATIC_LABELS.both);
    expect(formik.values.limitAutomaticInstallation).toBe(false);
    expect(formik.values.automaticUpgrades).toBe(false);
  });
});
