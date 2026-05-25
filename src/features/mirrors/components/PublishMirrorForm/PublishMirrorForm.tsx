import { RadioInput } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./PublishMirrorForm.module.scss";
import SidePanel from "@/components/layout/SidePanel";
import PublishMirrorNewForm from "./components/PublishMirrorNewForm";
import PublishMirrorExistingForm from "./components/PublishMirrorExistingForm";
import { useBoolean } from "usehooks-ts";
import {
  useGetMirror,
  useListPublications,
  useListPublicationTargets,
} from "../../api";
import usePageParams from "@/hooks/usePageParams";

const PublishMirrorForm: FC = () => {
  const { name } = usePageParams();

  const mirror = useGetMirror(name).data.data;

  const { publicationTargets = [] } = useListPublicationTargets({
    pageSize: 1000,
  }).data.data;

  const { publications = [] } = useListPublications({
    filter: `source="${name}"`,
    pageSize: 1000,
  }).data.data;

  const { value: useNewPublication, toggle } = useBoolean(
    !!publicationTargets.length,
  );

  return (
    <>
      <SidePanel.Header>Publish {mirror.displayName}</SidePanel.Header>
      <SidePanel.Content>
        <label>Publish to</label>
        <div className={classes.radio}>
          <RadioInput
            label="New publication"
            checked={useNewPublication}
            onChange={toggle}
            disabled={!publicationTargets.length}
          />
          <RadioInput
            label="Existing publication"
            checked={!useNewPublication}
            onChange={toggle}
            disabled={!publications.length}
          />
        </div>

        {useNewPublication ? (
          <PublishMirrorNewForm
            mirror={mirror}
            publicationTargets={publicationTargets}
          />
        ) : (
          <PublishMirrorExistingForm
            mirror={mirror}
            publications={publications}
          />
        )}
      </SidePanel.Content>
    </>
  );
};

export default PublishMirrorForm;
