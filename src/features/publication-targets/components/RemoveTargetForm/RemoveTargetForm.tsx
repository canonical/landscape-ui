import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Form, Icon } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { usePublicationTargets } from "../../hooks";
import type { PublicationTargetWithPublications } from "../../types";
import PublicationsTable from "../PublicationsTable/PublicationsTable";

interface RemoveTargetFormProps {
  readonly target: PublicationTargetWithPublications;
}

const PAGE_SIZE = 5;

const RemoveTargetForm: FC<RemoveTargetFormProps> = ({ target }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { removePublicationTargetQuery } = usePublicationTargets();
  const { mutateAsync: removeTarget, isPending: isRemoving } =
    removePublicationTargetQuery;

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
      <hr />
      {hasPublications && (
        <>
          <p>
            This publication target is currently being used by the following
            publications:
          </p>
          <PublicationsTable publications={target.publications} pageSize={PAGE_SIZE} />
        </>
      )}
      <p>
        Removing this publication target will cause publications to no longer be
        able to publish to it. <b>This action is irreversible</b>.
      </p>
      <hr />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
        <Button
          type="button"
          appearance="base"
          onClick={closeSidePanel}
          disabled={isRemoving}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          appearance="negative"
          hasIcon
          disabled={isRemoving}
          loading={isRemoving}
        >
          <Icon light={true} name="delete" />
          <span>Remove target</span>
        </Button>
      </div>
    </Form>
  );
};

export default RemoveTargetForm;

