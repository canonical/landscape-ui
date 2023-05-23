import { FC } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  CheckboxInput,
  Input,
  Select,
} from "@canonical/react-components";
import useSidePanel from "../../../../hooks/useSidePanel";
import useRepositoryProfiles from "../../../../hooks/useRepositoryProfiles";
import { RepositoryProfile } from "../../../../types/RepositoryProfile";
import useDebug from "../../../../hooks/useDebug";
import useAccessGroup from "../../../../hooks/useAccessGroup";

interface ProfileFormProps {
  accessGroupsOptions: { label: string; value: string }[];
  isGettingAccessGroups: boolean;
  profile?: RepositoryProfile;
}

const ProfileForm: FC<ProfileFormProps> = ({ profile }) => {
  console.log("profile: ", profile);

  const { getAccessGroupQuery } = useAccessGroup();
  const { data: accessGroupsResponse, isLoading: isGettingAccessGroups } =
    getAccessGroupQuery();

  const accessGroupsOptions = (accessGroupsResponse?.data ?? []).map(
    (accessGroup) => ({
      label: accessGroup.title,
      value: accessGroup.name,
    })
  );

  const validationSchema = Yup.object().shape({
    title: Yup.string().test("required", "This field is required.", (value) => {
      return !profile && !!value;
    }),
    description: Yup.string(),
    accessGroup: Yup.string().required("This field is required."),
    tags: Yup.array()
      .of(Yup.string().required())
      .required("This field is required. Tags have to be separated by coma."),
    allComputers: Yup.boolean(),
  });

  const initialValues: Yup.InferType<typeof validationSchema> = {
    title: "",
    description: "",
    accessGroup: "",
    tags: [],
    allComputers: false,
  };

  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const {
    createRepositoryProfileQuery,
    editRepositoryProfileQuery,
    associateRepositoryProfileQuery,
    disassociateRepositoryProfileQuery,
  } = useRepositoryProfiles();
  const { mutateAsync: createRepositoryProfile, isLoading: isCreating } =
    createRepositoryProfileQuery;
  const { mutateAsync: editRepositoryProfile, isLoading: isEditing } =
    editRepositoryProfileQuery;
  const { mutateAsync: associateRepositoryProfile, isLoading: isAssociating } =
    associateRepositoryProfileQuery;
  const {
    mutateAsync: disassociateRepositoryProfile,
    isLoading: isDisassociating,
  } = disassociateRepositoryProfileQuery;

  const formik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log(values);

        if (profile) {
          await editRepositoryProfile({
            name: profile.name,
            title: values.title,
            description: values.description,
          });

          if (profile.all_computers !== values.allComputers) {
            values.allComputers
              ? await associateRepositoryProfile({
                  name: profile.name,
                  all_computers: true,
                })
              : await disassociateRepositoryProfile({
                  name: profile.name,
                  all_computers: true,
                });
          }

          if (
            profile.tags.length &&
            (profile.tags.length !== values.tags.length ||
              !profile.tags.every((tag) => values.tags.includes(tag)))
          ) {
            const associateArr: string[] = [];
            const disassociateArr: string[] = [];

            profile.tags.forEach((tag) => {
              if (!values.tags.includes(tag)) {
                disassociateArr.push(tag);
              }
            });

            values.tags.forEach((tag) => {
              if (!profile.tags.includes(tag)) {
                associateArr.push(tag);
              }
            });

            await Promise.all([
              associateRepositoryProfile({
                name: profile.name,
                tags: associateArr,
              }),
              disassociateRepositoryProfile({
                name: profile.name,
                tags: disassociateArr,
              }),
            ]);
          }
        } else {
          const newProfile = (
            await createRepositoryProfile({
              title: values.title ?? "",
              description: values.description,
              access_group: values.accessGroup,
            })
          ).data;

          console.log("new profile: ", newProfile);

          if (values.allComputers) {
            await associateRepositoryProfile({
              name: decodeURI(newProfile.name),
              all_computers: true,
            });
          } else if (values.tags.length) {
            await associateRepositoryProfile({
              name: decodeURI(newProfile.name),
              tags: values.tags,
            });
          }
        }

        resetForm();
      } catch (error: unknown) {
        debug(error);
      }
    },
  });

  return (
    <>
      <h3>ProfileForm</h3>
      <form onSubmit={formik.handleSubmit}>
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
            error={formik.touched.accessGroup && formik.errors.accessGroup}
            disabled={isGettingAccessGroups}
            {...formik.getFieldProps("accessGroup")}
          />
        )}

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
          disabled={formik.values.allComputers}
        />

        <CheckboxInput
          label="All computers"
          {...formik.getFieldProps("allComputers")}
        />

        <div className="form-buttons">
          <Button
            type="submit"
            appearance="positive"
            disabled={
              isCreating || isEditing || isAssociating || isDisassociating
            }
          >
            Create profile
          </Button>
          <Button type="button" onClick={closeSidePanel}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProfileForm;
