import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PublicationSettingsBlock } from "../..";
import { useFormik } from "formik";
import type { Publication } from "@canonical/landscape-openapi";
import { AUTOMATIC_LABELS } from "../../constants";
import type { PublishSettingsValues } from "../../types";

const PublicationSettingsFormikWrapper = ({
  installsAndUpgrades = "automatic",
}: {
  readonly installsAndUpgrades?: PublishSettingsValues["installsAndUpgrades"];
}) => {
  const formik = useFormik<PublishSettingsValues>({
    initialValues: {
      installsAndUpgrades,
      hashIndexing: false,
      skipBz2: false,
      skipContentIndexing: false,
    },
    onSubmit: () => undefined,
  });

  return <PublicationSettingsBlock formik={formik} />;
};

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
    expect(screen.getByText(AUTOMATIC_LABELS.automatic)).toBeInTheDocument();
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

  it("renders existing publication settings if provided", () => {
    renderWithProviders(
      <PublicationSettingsBlock publication={getPublication(true)} />,
    );

    expect(screen.getByText(AUTOMATIC_LABELS.autoUpgrades)).toBeInTheDocument();

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);

    for (const checkbox of checkboxes) {
      expect(checkbox).toBeChecked();
    }
  });

  it("renders manual value from existing publication", () => {
    renderWithProviders(
      <PublicationSettingsBlock
        publication={{
          ...getPublication(true),
          butAutomaticUpgrades: false,
        }}
      />,
    );

    expect(screen.getByText(AUTOMATIC_LABELS.manual)).toBeInTheDocument();
  });

  it("selects each option in the dropdown", async () => {
    const user = userEvent.setup();

    renderWithProviders(<PublicationSettingsFormikWrapper />);

    const dropdownInput = screen.getByRole("combobox", {
      name: /installs and upgrades/i,
    });
    expect(dropdownInput).toHaveValue("automatic");

    await user.selectOptions(dropdownInput, "manual");
    expect(dropdownInput).toHaveValue("manual");

    await user.selectOptions(dropdownInput, "autoUpgrades");
    expect(dropdownInput).toHaveValue("autoUpgrades");

    await user.selectOptions(dropdownInput, "automatic");
    expect(dropdownInput).toHaveValue("automatic");
  });
});
