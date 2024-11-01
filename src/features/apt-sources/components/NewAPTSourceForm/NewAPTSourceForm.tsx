import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useGPGKeys } from "@/features/gpg-keys";
import useDebug from "@/hooks/useDebug";
import useRoles from "@/hooks/useRoles";
import useSidePanel from "@/hooks/useSidePanel";
import { SelectOption } from "@/types/SelectOption";
import { testLowercaseAlphaNumeric } from "@/utils/tests";
import {
  Form,
  Icon,
  Input,
  Select,
  Tooltip,
} from "@canonical/react-components";
import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";
import { useAPTSources } from "../../hooks";
import { INITIAL_VALUES, APT_LINE_TOOLTIP } from "./constants";
import classes from "./NewAPTSourceForm.module.scss";
import { FormProps } from "./types";

const NewAPTSourceForm: FC = () => {
  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { createAPTSourceQuery, getAPTSourcesQuery } = useAPTSources();

  const { getGPGKeysQuery } = useGPGKeys();
  const { data: gpgKeysData, isLoading: isGettingGPGKeys } = getGPGKeysQuery();

  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsResponse, isLoading: isGettingAccessGroups } =
    getAccessGroupQuery();

  const accessGroupsOptions = (accessGroupsResponse?.data ?? []).map(
    (accessGroup) => ({
      label: accessGroup.title,
      value: accessGroup.name,
    }),
  );

  const gpgKeysOptions: SelectOption[] = (gpgKeysData?.data ?? []).map(
    ({ name }) => ({
      label: name,
      value: name,
    }),
  );

  const { mutateAsync } = createAPTSourceQuery;

  const { data: getAPTSourcesResponse } = getAPTSourcesQuery();

  const formik = useFormik<FormProps>({
    initialValues: INITIAL_VALUES,
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .required("This field is required")
        .test({
          test: testLowercaseAlphaNumeric.test,
          message: testLowercaseAlphaNumeric.message,
        })
        .test({
          params: { getAPTSourcesResponse },
          test: (value) => {
            return !(getAPTSourcesResponse?.data ?? [])
              .map(({ name }) => name)
              .includes(value);
          },
          message: "It must be unique within the account.",
        }),
      apt_line: Yup.string().required("This field is required"),
      gpg_key: Yup.string(),
      access_group: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        await mutateAsync(values);

        closeSidePanel();
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Name"
        required
        error={
          formik.touched.name && formik.errors.name
            ? formik.errors.name
            : undefined
        }
        {...formik.getFieldProps("name")}
      />

      <Input
        type="text"
        label={
          <>
            <span>APT Line</span>
            <Tooltip
              message={APT_LINE_TOOLTIP}
              positionElementClassName={classes.tooltipPositionElement}
            >
              <Icon name="help" aria-hidden />
              <span className="u-off-screen">Help</span>
            </Tooltip>
          </>
        }
        required
        error={
          formik.touched.apt_line && formik.errors.apt_line
            ? formik.errors.apt_line
            : undefined
        }
        {...formik.getFieldProps("apt_line")}
      />

      <Select
        label="GPG key"
        disabled={isGettingGPGKeys}
        options={[{ label: "Select GPG key", value: "" }, ...gpgKeysOptions]}
        {...formik.getFieldProps("gpg_key")}
        error={
          formik.touched.gpg_key && formik.errors.gpg_key
            ? formik.errors.gpg_key
            : undefined
        }
      />

      <Select
        label="Access group"
        disabled={isGettingAccessGroups}
        options={[
          { label: "Select access group", value: "" },
          ...accessGroupsOptions,
        ]}
        {...formik.getFieldProps("access_group")}
        error={
          formik.touched.access_group && formik.errors.access_group
            ? formik.errors.access_group
            : undefined
        }
      />
      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Add APT Source"
      />
    </Form>
  );
};

export default NewAPTSourceForm;
