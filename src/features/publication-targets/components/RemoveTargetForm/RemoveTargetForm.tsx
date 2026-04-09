import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Form } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { usePublicationTargets } from "../../hooks";
import type { PublicationTargetWithPublications } from "../../types";

interface RemoveTargetFormProps {
  readonly target: PublicationTargetWithPublications;
}

const RemoveTargetForm: FC<RemoveTargetFormProps> = ({ target }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { removePublicationTargetQuery } = usePublicationTargets();
  const { mutateAsync: removeTarget } = removePublicationTargetQuery;

  const hasPublications = target.publications.length > 0;

  const formik = useFormik({
    initialValues: {},
    onSubmit: async () => {
      try {
        await removeTarget({ name: target.name });
        notify.success({
          message: `"${target.display_name}" publication target removed successfully`,
          title: "Publication target removed",
        });
        closeSidePanel();
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      {hasPublications ? (
        <>
          <p>
            This publication target has the following associated publications:
          </p>
          <ul>
            {target.publications.map((pub) => (
              <li key={pub.publication_id}>{pub.display_name}</li>
            ))}
          </ul>
          <p>
            Deleting this target will also remove its associated publications.
            <br />
            This action is <b>irreversible</b>.
          </p>
        </>
      ) : (
        <p>
          Removing this publication target will cause publications to no longer
          be able to publish to it. <b>This action is irreversible</b>.
        </p>
      )}
      <SidePanelFormButtons
        submitButtonAppearance="negative"
        submitButtonDisabled={formik.isSubmitting}
        submitButtonLoading={formik.isSubmitting}
        submitButtonText={
          hasPublications ? "Delete target and publications" : "Remove target"
        }
      />
    </Form>
  );
};

export default RemoveTargetForm;
