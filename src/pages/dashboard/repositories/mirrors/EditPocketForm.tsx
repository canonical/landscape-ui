import { FC, useEffect } from "react";
import { Series } from "../../../../types/Series";
import { Distribution } from "../../../../types/Distribution";
import useDebug from "../../../../hooks/useDebug";
import useSidePanel from "../../../../hooks/useSidePanel";
import { useFormik } from "formik";
import * as Yup from "yup";
import usePockets, {
  EditMirrorPocketParams,
  EditPullPocketParams,
  EditUploadPocketParams,
} from "../../../../hooks/usePockets";
import {
  Button,
  CheckboxInput,
  Form,
  Input,
  Select,
  Textarea,
} from "@canonical/react-components";
import classNames from "classnames";
import {
  ARCHITECTURE_OPTIONS,
  COMPONENT_OPTIONS,
} from "../../../../data/series";
import useGPGKeys from "../../../../hooks/useGPGKeys";
import { DEFAULT_MIRROR_URI } from "../../../../constants";
import { Pocket } from "../../../../types/Pocket";
import { assertNever } from "../../../../utils/debug";
import { AxiosResponse } from "axios";

interface FormProps
  extends EditMirrorPocketParams,
    EditPullPocketParams,
    EditUploadPocketParams {
  filters: string[];
  upload_gpg_keys: string[];
}

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
  filters: [],
  upload_gpg_keys: [],
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
  distributionName: Distribution["name"];
  seriesName: Series["name"];
}

const EditPocketForm: FC<EditPocketFormProps> = ({
  distributionName,
  pocket,
  seriesName,
}) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const {
    editPocketQuery,
    addPackageFiltersToPocketQuery,
    removePackageFiltersFromPocketQuery,
    addUploaderGPGKeysToPocketQuery,
    removeUploaderGPGKeysFromPocketQuery,
  } = usePockets();
  const { getGPGKeysQuery } = useGPGKeys();

  const { mutateAsync: editPocket, isLoading: isEditing } = editPocketQuery;
  const {
    mutateAsync: addPackageFiltersToPocket,
    isLoading: isAddingPackageFiltersToPocket,
  } = addPackageFiltersToPocketQuery;
  const {
    mutateAsync: removePackageFiltersFromPocket,
    isLoading: isRemovingPackageFiltersFromPocket,
  } = removePackageFiltersFromPocketQuery;
  const {
    mutateAsync: addUploaderGPGKeysToPocket,
    isLoading: isAddingUploaderGPGKeysToPocket,
  } = addUploaderGPGKeysToPocketQuery;
  const {
    mutateAsync: removeUploaderGPGKeysFromPocket,
    isLoading: isRemovingUploaderGPGKeysFromPocket,
  } = removeUploaderGPGKeysFromPocketQuery;
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
        message: "A single component must be passed",
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
    filters: Yup.array().of(Yup.string()),
    upload_gpg_keys: Yup.array().of(Yup.string()),
  });

  const formik = useFormik<FormProps>({
    validationSchema,
    initialValues,
    onSubmit: async (values) => {
      try {
        const promises: Promise<AxiosResponse<Pocket>>[] = [];

        promises.push(editPocket(getEditPocketParams(values, mode)));

        if ("pull" === pocket.mode) {
          if (pocket.filter_type) {
            const deletedPackages = pocket.filters.filter(
              (originalPackage) => !values.filters.includes(originalPackage)
            );
            const addedPackages = values.filters
              .filter((x) => x)
              .filter((newPackage) => !pocket.filters.includes(newPackage));

            if (deletedPackages.length) {
              promises.push(
                removePackageFiltersFromPocket({
                  name: values.name,
                  distribution: values.distribution,
                  series: values.series,
                  packages: deletedPackages,
                })
              );
            }

            if (addedPackages.length) {
              promises.push(
                addPackageFiltersToPocket({
                  name: values.name,
                  distribution: values.distribution,
                  series: values.series,
                  packages: addedPackages,
                })
              );
            }
          }
        } else if ("upload" === pocket.mode) {
          const pocketUploadGPGKeyNames = pocket.upload_gpg_keys.map(
            ({ name }) => name
          );

          const addedUploaderGPGKeys = values.upload_gpg_keys.filter(
            (gpgKey) => !pocketUploadGPGKeyNames.includes(gpgKey)
          );

          const removedUploaderGPGKeys = pocketUploadGPGKeyNames.filter(
            (gpgKey) => !values.upload_gpg_keys.includes(gpgKey)
          );

          if (addedUploaderGPGKeys.length) {
            promises.push(
              addUploaderGPGKeysToPocket({
                name: values.name,
                series: values.series,
                distribution: values.distribution,
                gpg_keys: addedUploaderGPGKeys,
              })
            );
          }

          if (removedUploaderGPGKeys.length) {
            promises.push(
              removeUploaderGPGKeysFromPocket({
                name: values.name,
                series: values.series,
                distribution: values.distribution,
                gpg_keys: removedUploaderGPGKeys,
              })
            );
          }
        }

        await Promise.all(promises);

        closeSidePanel();
      } catch (error: unknown) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("distribution", distributionName);
    formik.setFieldValue("series", seriesName);
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
    } else {
      formik.setFieldValue("filters", pocket.filters);
    }
  }, []);

  return (
    <Form onSubmit={formik.handleSubmit}>
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

      <Select
        label="GPG Key"
        options={[
          { label: "Select GPG key", value: "" },
          ...gpgKeys
            .filter(({ has_secret }) => has_secret)
            .map((item) => ({
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
        <>
          <CheckboxInput
            label="Allow uploaded packages to be unsigned"
            {...formik.getFieldProps("upload_allow_unsigned")}
            checked={formik.values.upload_allow_unsigned}
          />

          <Input
            type="text"
            label="Uploader GPG keys"
            {...formik.getFieldProps("upload_gpg_keys")}
            onChange={(event) => {
              formik.setFieldValue(
                "upload_gpg_keys",
                event.target.value.replace(/\s/g, "").split(",")
              );
            }}
            help="List GPG keys separated by commas"
            value={formik.values.upload_gpg_keys.join(",")}
            error={
              formik.touched.upload_gpg_keys && formik.errors.upload_gpg_keys
            }
          />
        </>
      )}

      {"pull" === pocket.mode && pocket.filter_type && (
        <Textarea
          label="Filter packages"
          rows={3}
          help="List packages to filter separated by commas"
          {...formik.getFieldProps("filters")}
          onChange={(event) => {
            formik.setFieldValue(
              "filters",
              event.target.value.replace(/\s/g, "").split(",")
            );
          }}
          value={formik.values.filters.join(",")}
          error={formik.touched.filters && formik.errors.filters}
        />
      )}

      <CheckboxInput
        label="Include .udeb packages (debian-installer)"
        {...formik.getFieldProps("include_udeb")}
        checked={formik.values.include_udeb}
      />

      <div className="form-buttons">
        <Button
          type="submit"
          appearance="positive"
          disabled={
            isEditing ||
            isAddingPackageFiltersToPocket ||
            isRemovingPackageFiltersFromPocket ||
            isAddingUploaderGPGKeysToPocket ||
            isRemovingUploaderGPGKeysFromPocket
          }
        >
          Save changes
        </Button>
        <Button type="button" onClick={closeSidePanel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default EditPocketForm;
