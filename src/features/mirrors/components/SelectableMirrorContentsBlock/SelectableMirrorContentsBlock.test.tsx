import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
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
          name: "",
          sourceType: "ubuntu-pro",
          sourceUrl: "",
          proService: proService.mirror_type,
          token: "",
        }}
      />,
    );
  });
});
