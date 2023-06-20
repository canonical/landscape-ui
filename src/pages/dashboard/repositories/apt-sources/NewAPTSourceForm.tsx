import { FC, useEffect } from "react";
import { Button, Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import useDebug from "../../../../hooks/useDebug";
import useSidePanel from "../../../../hooks/useSidePanel";
import * as Yup from "yup";
import useAPTSources from "../../../../hooks/useAPTSources";
import useNotify from "../../../../hooks/useNotify";
import AppNotification from "../../../../components/layout/AppNotification";
import useGPGKeys from "../../../../hooks/useGPGKeys";
import { SelectOption } from "../../../../types/SelectOption";
import useAccessGroup from "../../../../hooks/useAccessGroup";
import { testLowercaseAlphaNumeric } from "../../../../utils/tests";

interface FormProps {
  name: string;
  apt_line: string;
  gpg_key?: string;
  access_group?: string;
}

const NewAPTSourceForm: FC = () => {
  const { closeSidePanel } = useSidePanel();
  const debug = useDebug();
  const { createAPTSourceQuery, getAPTSourcesQuery } = useAPTSources();

  const { getGPGKeysQuery } = useGPGKeys();
  const { data: gpgKeysData, isLoading: isGettingGPGKeys } = getGPGKeysQuery();

  const { getAccessGroupQuery } = useAccessGroup();
  const { data: accessGroupsResponse, isLoading: isGettingAccessGroups } =
    getAccessGroupQuery();

  const notify = useNotify();

  const accessGroupsOptions = (accessGroupsResponse?.data ?? []).map(
    (accessGroup) => ({
      label: accessGroup.title,
      value: accessGroup.name,
    })
  );

  const gpgKeysOptions: SelectOption[] = (gpgKeysData?.data ?? []).map(
    ({ name }) => ({
      label: name,
      value: name,
    })
  );

  const { mutateAsync, isLoading } = createAPTSourceQuery;

  const { data: getAPTSourcesResponse, error: getAPTSourcesError } =
    getAPTSourcesQuery();

  if (getAPTSourcesError) {
    debug(getAPTSourcesError);
  }

  const formik = useFormik<FormProps>({
    initialValues: {
      name: "",
      apt_line: "",
      gpg_key: "",
      access_group: "",
    },
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
      } catch (error: any) {
        debug(error);
      }
    },
  });

  useEffect(() => notify.clear, []);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Input
        type="text"
        label="* Name"
        error={
          formik.touched.name && formik.errors.name
            ? formik.errors.name
            : undefined
        }
        {...formik.getFieldProps("name")}
      />

      <Input
        type="text"
        label="* APT Line"
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
        error={formik.touched.gpg_key && formik.errors.gpg_key}
      />

      <Select
        label="Access group"
        disabled={isGettingAccessGroups}
        options={[
          { label: "Select access group", value: "" },
          ...accessGroupsOptions,
        ]}
        {...formik.getFieldProps("access_group")}
        error={formik.touched.access_group && formik.errors.access_group}
      />

      {notify && <AppNotification notify={notify} />}

      <div className="form-buttons">
        <Button type="submit" appearance="positive" disabled={isLoading}>
          Create APT Source
        </Button>
        <Button type="button" onClick={closeSidePanel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default NewAPTSourceForm;
