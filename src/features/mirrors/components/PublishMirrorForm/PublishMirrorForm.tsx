import { RadioInput } from "@canonical/react-components";
import type { FC } from "react";
import classes from "./PublishMirrorForm.module.scss";
import SidePanel from "@/components/layout/SidePanel";
import PublishMirrorNewForm from "./components/PublishMirrorNewForm";
import PublishMirrorExistingForm from "./components/PublishMirrorExistingForm";
import { useBoolean } from "usehooks-ts";
import { useGetMirror } from "../../api";
import usePageParams from "@/hooks/usePageParams";
import { useGetPublicationsBySource } from "@/features/publications";
import { useGetPublicationTargets } from "@/features/publication-targets";

const PublishMirrorForm: FC = () => {
  const { name } = usePageParams();

  const mirror = useGetMirror(name).data.data;
  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets();
  const { publications, isGettingPublications } =
    useGetPublicationsBySource(name);

  const { value: useNewPublication, toggle } = useBoolean(true);

  if (isGettingPublicationTargets || isGettingPublications) {
    return <SidePanel.LoadingState />;
  }

  return (
    <>
      <SidePanel.Header>Publish {mirror.displayName}</SidePanel.Header>
      <SidePanel.Content>
        {!!publications.length && (
          <>
            <label>Publish to</label>
            <div className={classes.radio}>
              <RadioInput
                label="New publication"
                checked={useNewPublication}
                onChange={toggle}
              />
              <RadioInput
                label="Existing publication"
                checked={!useNewPublication}
                onChange={toggle}
              />
            </div>
          </>
        )}

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
