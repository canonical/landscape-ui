import AssociationBlock from "@/components/form/AssociationBlock";
import ReadOnlyField from "@/components/form/ReadOnlyField";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import { getFormikError } from "@/utils/formikErrors";
import { getTitleByName } from "@/utils/_helpers";
import { Form, Input, Notification } from "@canonical/react-components";
import { useFormik } from "formik";
import { type FC } from "react";
import { useEditWslProfile } from "../../../../api";
import type { WslProfile } from "../../../../types";
import { getCloudInitValue, getValidationSchema } from "./helpers";
import classes from "./WslProfileEditForm.module.scss";

interface WslProfileEditFormProps {
  readonly profile: WslProfile;
}

interface FormProps {
  title: string;
  description: string;
  all_computers: boolean;
  tags: string[];
}

const WslProfileEditForm: FC<WslProfileEditFormProps> = ({ profile }) => {
  const debug = useDebug();
  const { popSidePathUntilClear, closeSidePanel } = usePageParams();
  const { notify } = useNotify();
  const { getAccessGroupQuery } = useRoles();

  const { editWslProfile } = useEditWslProfile();
  const { data: accessGroupsData } = getAccessGroupQuery();

  const rootfsImageValue = profile.image_source
    ? "From URL"
    : profile.image_name;

  const cloudInitValue = getCloudInitValue(profile);
  const complianceValue = profile.only_landscape_created
    ? "Uninstall non-Landscape instances"
    : "Ignore non-Landscape instances";

  const handleSubmit = async (values: FormProps) => {
    try {
      await editWslProfile({
        name: profile.name,
        title: values.title,
        description: values.description,
        all_computers: values.all_computers,
        tags: values.tags,
      });

      closeSidePanel();

      notify.success({
        title: "WSL profile updated",
        message: `WSL profile "${profile.title}" updated successfully`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: profile.title,
      description: profile.description ?? "",
      all_computers: profile.all_computers,
      tags: profile.tags,
    },
    onSubmit: handleSubmit,
    validationSchema: getValidationSchema(),
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Notification severity="caution" title="Editing unavailable">
        <span>
          You cannot edit access group, rootfs image, cloud-init file, or
          compliance settings. To modify these fields, create a new profile.
        </span>
      </Notification>

      <Input
        type="text"
        label="Title"
        required
        {...formik.getFieldProps("title")}
        error={getFormikError(formik, "title")}
      />

      <Input
        type="text"
        label="Description"
        required
        {...formik.getFieldProps("description")}
        error={getFormikError(formik, "description")}
      />

      <ReadOnlyField
        label="Access group"
        value={getTitleByName(profile.access_group, accessGroupsData)}
        tooltipMessage="You can't change the access group after the WSL profile has been created"
      />

      <div className={classes.block}>
        <ReadOnlyField
          label="rootfs image"
          value={rootfsImageValue}
          tooltipMessage="You can't change the rootfs image after the WSL profile has been created"
        />

        {profile.image_source && (
          <>
            <ReadOnlyField
              label="Image name"
              value={profile.image_name}
              tooltipMessage="You can't change the image name after the WSL profile has been created"
            />
            <ReadOnlyField
              label="rootfs image URL"
              value={profile.image_source}
              tooltipMessage="You can't change the rootfs image URL after the WSL profile has been created"
            />
          </>
        )}

        <ReadOnlyField
          label="cloud-init"
          value={cloudInitValue}
          tooltipMessage="You can't change the cloud-init value after the WSL profile has been created"
        />

        <ReadOnlyField
          label="Compliance settings"
          value={complianceValue}
          tooltipMessage="You can't change the compliance settings after the WSL profile has been created"
        />
      </div>

      <AssociationBlock formik={formik} />

      <SidePanelFormButtons
        submitButtonText="Save changes"
        submitButtonDisabled={formik.isSubmitting}
        onCancel={popSidePathUntilClear}
      />
    </Form>
  );
};

export default WslProfileEditForm;
