import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assert, describe, expect, it } from "vitest";
import SelectableMirrorContentsBlock from "./SelectableMirrorContentsBlock";
import { useFormik } from "formik";
import {
  ubuntuArchiveInfo,
  ubuntuESMInfo,
} from "@/tests/mocks/ubuntuArchiveInfo";
import type { FormProps } from "../AddMirrorForm/types";
import type { ComponentProps } from "react";
import { hasOneItem } from "@/utils/_helpers";
import type { Distribution } from "../../types";

const archiveBaseValues: FormProps = {
  architectures: [],
  components: [],
  distribution: ubuntuArchiveInfo.distributions[0].slug,
  downloadInstallerFiles: false,
  downloadSources: false,
  downloadUdebPackages: false,
  preserveSignatures: false,
  name: "",
  sourceType: "ubuntu-archive",
  sourceUrl: "",
};

const TestComponent = ({
  initialValues,
}: {
  readonly initialValues: FormProps;
}) => {
  const formik = useFormik<FormProps>({
    initialValues,
    onSubmit: () => undefined,
  });

  return (
    <SelectableMirrorContentsBlock
      formik={
        formik as ComponentProps<typeof SelectableMirrorContentsBlock>["formik"]
      }
      ubuntuArchiveInfo={ubuntuArchiveInfo}
      ubuntuEsmInfo={ubuntuESMInfo}
    />
  );
};

describe("SelectableMirrorContentsBlock", () => {
  it("renders select components", () => {
    renderWithProviders(
      <TestComponent
        initialValues={{
          architectures: [],
          components: [],
          distribution: ubuntuArchiveInfo.distributions[0].slug,
          downloadInstallerFiles: false,
          downloadSources: false,
          downloadUdebPackages: false,
          preserveSignatures: false,
          name: "",
          sourceType: "ubuntu-archive",
          sourceUrl: "",
        }}
      />,
    );
  });

  it("renders readonly components when there is only one option", () => {
    const proService = ubuntuESMInfo.find(
      ({ distributions }) =>
        hasOneItem(distributions as Distribution[]) &&
        distributions[0].components.length === 1 &&
        distributions[0].architectures.length === 1,
    );

    assert(proService && proService.distributions[0].architectures[0]);

    renderWithProviders(
      <TestComponent
        initialValues={{
          architectures: [proService.distributions[0].architectures[0].slug],
          components: [proService.distributions[0].components[0].slug],
          distribution: proService.distributions[0].slug,
          downloadInstallerFiles: false,
          downloadSources: false,
          downloadUdebPackages: false,
          preserveSignatures: false,
          name: "",
          sourceType: "ubuntu-pro",
          sourceUrl: "",
          proService: proService.mirror_url,
          token: "",
        }}
      />,
    );

    expect(
      screen.queryByRole("combobox", { name: /distribution/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(proService.distributions[0].label),
    ).toBeInTheDocument();
    expect(
      screen.getByText(proService.distributions[0].components[0].slug),
    ).toBeInTheDocument();
    expect(
      screen.getByText(proService.distributions[0].architectures[0].slug),
    ).toBeInTheDocument();
  });

  it("renders empty select fields when ubuntu-pro proService is not found", () => {
    renderWithProviders(
      <TestComponent
        initialValues={{
          ...archiveBaseValues,
          sourceType: "ubuntu-pro",
          proService: "nonexistent-service",
          token: "",
        }}
      />,
    );

    const select = screen.getByRole("combobox", { name: /distribution/i });
    expect(select).toBeInTheDocument();
    expect(select.querySelectorAll("option")).toHaveLength(0);
  });

  it("updates components when a component option is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TestComponent initialValues={archiveBaseValues} />);

    const componentsToggle = screen.getByRole("combobox", {
      name: "Components",
    });
    await user.click(componentsToggle);

    const mainOption = screen.getByText("main");
    await user.click(mainOption);

    expect(componentsToggle).toHaveTextContent("main");
  });

  it("updates architectures when an architecture option is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TestComponent initialValues={archiveBaseValues} />);

    const archToggle = screen.getByRole("combobox", { name: "Architectures" });
    await user.click(archToggle);

    const amd64Option = screen.getByText("amd64");
    await user.click(amd64Option);

    expect(archToggle).toHaveTextContent("amd64");
  });
});
