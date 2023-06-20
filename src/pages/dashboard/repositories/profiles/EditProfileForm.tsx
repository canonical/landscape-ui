import { FC, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  CheckboxInput,
  Form,
  Input,
} from "@canonical/react-components";
import useSidePanel from "../../../../hooks/useSidePanel";
import useRepositoryProfiles from "../../../../hooks/useRepositoryProfiles";
import { RepositoryProfile } from "../../../../types/RepositoryProfile";
import useDebug from "../../../../hooks/useDebug";
import { AxiosResponse } from "axios";
import { testLowercaseAlphaNumeric } from "../../../../utils/tests";

interface FormProps {
  name: string;
  title: string;
  description: string;
  tags: string[];
  all_computers: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  title: Yup.string().test({
    test: (value) =>
      undefined === value || testLowercaseAlphaNumeric.test(value),
    message: testLowercaseAlphaNumeric.message,
  }),
  description: Yup.string().required("This field is required."),
  tags: Yup.array()
    .of(Yup.string().required())
    .required("This field is required. Tags have to be separated by coma."),
  all_computers: Yup.boolean(),
});

const initialValues: FormProps = {
  name: "",
  title: "",
  description: "",
  tags: [],
  all_computers: false,
};

interface EditProfileFormProps {
  profile: RepositoryProfile;
}

const EditProfileForm: FC<EditProfileFormProps> = ({ profile }) => {
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const {
    editRepositoryProfileQuery,
    associateRepositoryProfileQuery,
    disassociateRepositoryProfileQuery,
  } = useRepositoryProfiles();
  const { mutateAsync: editRepositoryProfile, isLoading: isEditing } =
    editRepositoryProfileQuery;
  const { mutateAsync: associateRepositoryProfile, isLoading: isAssociating } =
    associateRepositoryProfileQuery;
  const {
    mutateAsync: disassociateRepositoryProfile,
    isLoading: isDisassociating,
  } = disassociateRepositoryProfileQuery;

  const formik = useFormik<FormProps>({
    validationSchema,
    initialValues,
    onSubmit: async (values) => {
      try {
        const promises: Promise<AxiosResponse<RepositoryProfile>>[] = [];

        if (
          ("" !== values.title && profile.title !== values.title) ||
          profile.description !== values.description
        ) {
          promises.push(
            editRepositoryProfile({
              name: values.name,
              title: values.title,
              description: values.description,
            })
          );
        }

        if (profile.all_computers !== values.all_computers) {
          promises.push(
            values.all_computers
              ? associateRepositoryProfile({
                  name: values.name,
                  all_computers: true,
                })
              : disassociateRepositoryProfile({
                  name: values.name,
                  all_computers: true,
                })
          );
        }

        if (
          profile.tags.length &&
          (profile.tags.length !== values.tags.length ||
            !profile.tags.every((tag) => values.tags.includes(tag)))
        ) {
          const associateArray: string[] = [];
          const disassociateArray: string[] = [];

          profile.tags.forEach((tag) => {
            if (!values.tags.includes(tag)) {
              disassociateArray.push(tag);
            }
          });

          values.tags.forEach((tag) => {
            if (!profile.tags.includes(tag)) {
              associateArray.push(tag);
            }
          });

          promises.push(
            associateRepositoryProfile({
              name: values.name,
              tags: associateArray,
            }),
            disassociateRepositoryProfile({
              name: values.name,
              tags: disassociateArray,
            })
          );

          await Promise.all(promises);
        }

        closeSidePanel();
      } catch (error: unknown) {
        debug(error);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("all_computers", profile.all_computers);
    formik.setFieldValue("description", profile.description);
    formik.setFieldValue("tags", profile.tags);
    formik.setFieldValue("title", profile.title);
    formik.setFieldValue("name", profile.name);
  }, []);

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

      <CheckboxInput
        label="All computers"
        {...formik.getFieldProps("all_computers")}
        checked={formik.values.all_computers}
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
          disabled={isEditing || isAssociating || isDisassociating}
        >
          Edit profile
        </Button>
        <Button type="button" onClick={closeSidePanel}>
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default EditProfileForm;
