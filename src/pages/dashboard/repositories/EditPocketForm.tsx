import { FC, useEffect } from "react";
import { Series } from "../../../types/Series";
import { Distribution } from "../../../types/Distribution";
import useDebug from "../../../hooks/useDebug";
import useSidePanel from "../../../hooks/useSidePanel";
import { useFormik } from "formik";
import * as Yup from "yup";
import usePockets, {
  EditMirrorPocketParams,
  EditPullPocketParams,
  EditUploadPocketParams,
} from "../../../hooks/usePockets";
import {
  Button,
  CheckboxInput,
  Form,
  Input,
  Select,
} from "@canonical/react-components";
import classNames from "classnames";
import { ARCHITECTURE_OPTIONS, COMPONENT_OPTIONS } from "../../../data/series";
import useGPGKeys from "../../../hooks/useGPGKeys";
import { DEFAULT_MIRROR_URI } from "../../../constants";
import { Pocket } from "../../../types/Pocket";
import { assertNever } from "../../../utils/debug";

interface FormProps
  extends EditMirrorPocketParams,
    EditPullPocketParams,
    EditUploadPocketParams {}

const initialValues: FormProps = {
  series: "",
  distribution: "",
  name: "",
  architectures: [],
  components: [],
  gpg_key: "",
  include_udeb: false,
  mirror_uri: DEFAULT_MIRROR_URI,
  upload_allow_unsigned: false,
  mirror_suite: "",
  mirror_gpg_key: "",
};

const getEditPocketParams = (
  values: FormProps,
  mode: Pocket["mode"]
): EditMirrorPocketParams | EditPullPocketParams | EditUploadPocketParams => {
  switch (mode) {
    case "mirror":
      return {
        distribution: values.distribution,
        series: values.series,
        name: values.name,
        components: values.components,
        architectures: values.architectures,
        gpg_key: values.gpg_key,
        include_udeb: values.include_udeb,
        mirror_uri: values.mirror_uri,
        mirror_suite: values.mirror_suite,
        mirror_gpg_key: values.mirror_gpg_key,
      };
    case "upload":
      return {
        distribution: values.distribution,
        series: values.series,
        name: values.name,
        components: values.components,
        architectures: values.architectures,
        gpg_key: values.gpg_key,
        include_udeb: values.include_udeb,
        upload_allow_unsigned: values.upload_allow_unsigned,
      };
    case "pull":
      return {
        distribution: values.distribution,
        series: values.series,
        name: values.name,
        components: values.components,
        architectures: values.architectures,
        gpg_key: values.gpg_key,
        include_udeb: values.include_udeb,
      };
    default:
      return assertNever(mode, "pocket mode");
  }
};

interface EditPocketFormProps {
  pocket: Pocket;
  distribution: Distribution;
  series: Series;
}

const EditPocketForm: FC<EditPocketFormProps> = ({
  distribution,
  pocket,
  series,
}) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { editPocketQuery } = usePockets();
  const { getGPGKeysQuery } = useGPGKeys();

  const { mutateAsync: editPocket, isLoading: isEditing } = editPocketQuery;
  const { data: gpgKeysData } = getGPGKeysQuery();

  const gpgKeys = gpgKeysData?.data ?? [];

  const mode = pocket.mode;

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("This field is required"),
    distribution: Yup.string().required("This field is required"),
    series: Yup.string().required("This field is required"),
    components: Yup.array()
      .defined()
      .of(Yup.string().defined())
      .min(1, "Please choose at least one component")
      .test({
        name: "flat-mirror-sub-directory",
        message: "A single value must be passed",
        params: { mode },
        test: (value, context) => {
          const { mirror_suite } = context.parent;

          if ("mirror" === mode && /\/$/.test(mirror_suite)) {
            return 1 === value.length;
          }

          return true;
        },
      }),
    architectures: Yup.array()
      .defined()
      .of(Yup.string().defined())
      .min(1, "Please choose at least one architecture"),
    gpg_key: Yup.string(),
    include_udeb: Yup.boolean(),
    mirror_uri: Yup.string(),
    mirror_suite: Yup.string(),
    mirror_gpg_key: Yup.string(),
    upload_allow_unsigned: Yup.boolean(),
  });

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: async (values) => {
      try {
        await editPocket(getEditPocketParams(values, mode));

        closeSidePanel();
      } catch (error: unknown) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("distribution", distribution.name);
    formik.setFieldValue("series", series.name);
    formik.setFieldValue("name", pocket.name);
    formik.setFieldValue("components", pocket.components);
    formik.setFieldValue("architectures", pocket.architectures);
    formik.setFieldValue("gpg_key", pocket.gpg_key.name);
    formik.setFieldValue("include_udeb", pocket.include_udeb);
    formik.setFieldValue("mode", pocket.mode);

    if ("mirror" === pocket.mode) {
      formik.setFieldValue("mirror_uri", pocket.mirror_uri);
      formik.setFieldValue("mirror_suite", pocket.mirror_suite);
      if (pocket.mirror_gpg_key) {
        formik.setFieldValue("mirror_gpg_key", pocket.mirror_gpg_key);
      }
    } else if ("upload" === pocket.mode) {
      formik.setFieldValue(
        "upload_allow_unsigned",
        pocket.upload_allow_unsigned
      );
    }
  }, []);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Select
        label="GPG Key"
        options={[
          { label: "Select GPG key", value: "" },
          ...gpgKeys.map((item) => ({
            label: item.name,
            value: item.name,
          })),
        ]}
        {...formik.getFieldProps("gpg_key")}
        error={formik.touched.gpg_key && formik.errors.gpg_key}
      />

      {"mirror" === pocket.mode && (
        <>
          <Input
            type="text"
            label="Mirror URI"
            {...formik.getFieldProps("mirror_uri")}
            error={formik.touched.mirror_uri && formik.errors.mirror_uri}
          />

          <Input
            type="text"
            label="Mirror suite"
            {...formik.getFieldProps("mirror_suite")}
            error={formik.touched.mirror_suite && formik.errors.mirror_suite}
          />

          <Input
            type="text"
            label="Mirror GPG key"
            {...formik.getFieldProps("mirror_gpg_key")}
            error={
              formik.touched.mirror_gpg_key && formik.errors.mirror_gpg_key
            }
          />
        </>
      )}

      {"upload" === pocket.mode && (
        <CheckboxInput
          label="Allow uploaded packages to be unsigned"
          {...formik.getFieldProps("upload_allow_unsigned")}
          checked={formik.values.upload_allow_unsigned}
        />
      )}

      <fieldset
        className={classNames("checkbox-group", {
          "is-error": formik.touched.components && formik.errors.components,
        })}
      >
        <legend>Components</legend>

        {formik.touched.components && formik.errors.components && (
          <p className="p-form-validation__message">
            {formik.errors.components}
          </p>
        )}

        <div className="checkbox-group__inner">
          {COMPONENT_OPTIONS.map((option) => (
            <CheckboxInput
              key={option.value}
              label={option.label}
              {...formik.getFieldProps("components")}
              checked={formik.values.components.includes(option.value)}
              onChange={() =>
                formik.setFieldValue(
                  "components",
                  formik.values.components.includes(option.value)
                    ? formik.values.components.filter(
                        (item) => item !== option.value
                      )
                    : [...formik.values.components, option.value]
                )
              }
            />
          ))}
        </div>
      </fieldset>

      <fieldset
        className={classNames("checkbox-group", {
          "is-error":
            formik.touched.architectures && formik.errors.architectures,
        })}
      >
        <legend>Architectures</legend>

        {formik.touched.architectures && formik.errors.architectures && (
          <p className="p-form-validation__message">
            {formik.errors.architectures}
          </p>
        )}

        <div className="checkbox-group__inner">
          {ARCHITECTURE_OPTIONS.map((option) => (
            <CheckboxInput
              key={option.value}
              label={option.label}
              {...formik.getFieldProps("architectures")}
              checked={formik.values.architectures.includes(option.value)}
              onChange={() =>
                formik.setFieldValue(
                  "architectures",
                  formik.values.architectures.includes(option.value)
                    ? formik.values.architectures.filter(
                        (item) => item !== option.value
                      )
                    : [...formik.values.architectures, option.value]
                )
              }
            />
          ))}
        </div>
      </fieldset>

      <CheckboxInput
        label="Include .udeb packages (debian-installer)"
        {...formik.getFieldProps("include_udeb")}
        checked={formik.values.include_udeb}
      />

      <div className="form-buttons">
        <Button type="submit" appearance="positive" disabled={isEditing}>
          Edit
        </Button>
        <Button type="button" onClick={closeSidePanel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default EditPocketForm;
