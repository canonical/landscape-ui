import { FC } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  CheckboxInput,
  Form,
  Input,
  Select,
} from "@canonical/react-components";
import useSidePanel from "../../../../hooks/useSidePanel";
import useRepositoryProfiles from "../../../../hooks/useRepositoryProfiles";
import { RepositoryProfile } from "../../../../types/RepositoryProfile";
import useDebug from "../../../../hooks/useDebug";
import { SelectOption } from "../../../../types/SelectOption";

interface AddProfileFormProps {
  accessGroupsOptions: SelectOption[];
  isGettingAccessGroups: boolean;
  profile?: RepositoryProfile;
}

const AddProfileForm: FC<AddProfileFormProps> = ({
  profile,
  accessGroupsOptions,
  isGettingAccessGroups,
}) => {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("This field is required."),
    description: Yup.string().required("This field is required."),
    access_group: Yup.string().required("This field is required."),
    tags: Yup.array()
      .of(Yup.string().required())
      .required("This field is required. Tags have to be separated by coma."),
    all_computers: Yup.boolean(),
  });

  const initialValues: Yup.InferType<typeof validationSchema> = {
    title: "",
    description: "",
    access_group: "",
    tags: [],
    all_computers: false,
  };

  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { createRepositoryProfileQuery, associateRepositoryProfileQuery } =
    useRepositoryProfiles();
  const { mutateAsync: createRepositoryProfile, isLoading: isCreating } =
    createRepositoryProfileQuery;
  const { mutateAsync: associateRepositoryProfile, isLoading: isAssociating } =
    associateRepositoryProfileQuery;

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: async (values) => {
      try {
        const newProfile = (
          await createRepositoryProfile({
            title: values.title ?? "",
            description: values.description,
            access_group: values.access_group,
          })
        ).data;

        if (values.all_computers) {
          await associateRepositoryProfile({
            name: newProfile.name,
            all_computers: true,
          });
        } else if (values.tags.length) {
          await associateRepositoryProfile({
            name: newProfile.name,
            tags: values.tags,
          });
        }
      } catch (error: unknown) {
        debug(error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Input
        type="text"
        label="Title"
        error={formik.touched.title && formik.errors.title}
        {...formik.getFieldProps("title")}
      />

      <Input
        type="text"
        label="Description"
        error={formik.touched.description && formik.errors.description}
        {...formik.getFieldProps("description")}
      />

      {!profile && (
        <Select
          label="Access group"
          options={[
            { label: "Select access group", value: "" },
            ...accessGroupsOptions,
          ]}
          error={formik.touched.access_group && formik.errors.access_group}
          disabled={isGettingAccessGroups}
          {...formik.getFieldProps("access_group")}
        />
      )}

      <CheckboxInput
        label="All computers"
        {...formik.getFieldProps("all_computers")}
      />

      <Input
        type="text"
        label="Tags"
        error={
          formik.touched.tags && formik.errors.tags
            ? formik.errors.tags
            : undefined
        }
        {...formik.getFieldProps("tags")}
        value={formik.values.tags.join(",")}
        onChange={(event) => {
          formik.setFieldValue(
            "tags",
            event.target.value.replace(/ */g, "").split(",")
          );
        }}
        disabled={formik.values.all_computers}
      />

      <div className="form-buttons">
        <Button
          type="submit"
          appearance="positive"
          disabled={isCreating || isAssociating}
        >
          {profile ? "Edit profile" : "Create profile"}
        </Button>
        <Button type="button" onClick={closeSidePanel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default AddProfileForm;
