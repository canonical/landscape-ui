import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import { Link } from "@canonical/react-components";
import { useState, type FC } from "react";
import type { APTSource } from "../../types";
import { useGetRepositoryProfile } from "../../api";
import RepositoryProfileForm from "../RepositoryProfileForm";
import RepositoryProfileSourceForm from "../RepositoryProfileSourceForm";

const RepositoryProfileEditForm: FC = () => {
  const { name, lastSidePathSegment, popSidePath, createSidePathPusher } =
    usePageParams();
  const { data: profile } = useGetRepositoryProfile(name);

  const [aptSources, setAptSources] = useState<APTSource[]>(
    profile.apt_sources ?? [],
  );
  const [sourceToEdit, setSourceToEdit] = useState<APTSource | null>(null);

  const isSourceStep =
    lastSidePathSegment === "add-source" ||
    lastSidePathSegment === "edit-source";

  const panelTitle = `Edit ${profile.title}`;

  const handleSourceSuccess = (source: APTSource) => {
    if (lastSidePathSegment === "add-source") {
      setAptSources((prev) => [...prev, { ...source, id: 0 }]);
    } else if (sourceToEdit) {
      setAptSources((prev) =>
        prev.map((s) => {
          const matches =
            s.id !== 0
              ? s.id === sourceToEdit.id
              : s.name === sourceToEdit.name;
          return matches ? { ...source, id: 0 } : s;
        }),
      );
    }
    popSidePath();
  };

  return (
    <>
      <SidePanel.Header>
        {isSourceStep ? (
          <>
            <Link className="u-no-margin--bottom" onClick={popSidePath}>
              {panelTitle}
            </Link>
            {lastSidePathSegment === "add-source"
              ? " / Add source"
              : " / Edit source"}
          </>
        ) : (
          panelTitle
        )}
      </SidePanel.Header>
      <SidePanel.Content>
        <div style={{ display: isSourceStep ? "none" : undefined }}>
          <RepositoryProfileForm
            action="edit"
            profile={profile}
            aptSources={aptSources}
            onAptSourcesChange={setAptSources}
            onAddSourceClick={createSidePathPusher("add-source")}
            onEditSourceClick={(source) => {
              setSourceToEdit(source);
              createSidePathPusher("edit-source")();
            }}
          />
        </div>
        {isSourceStep && (
          <RepositoryProfileSourceForm
            initialValues={
              lastSidePathSegment === "edit-source" && sourceToEdit
                ? {
                    name: sourceToEdit.name,
                    deb_line: sourceToEdit.line,
                    gpg_key_name: sourceToEdit.gpg_key ?? "",
                  }
                : undefined
            }
            onSuccess={handleSourceSuccess}
            onBack={popSidePath}
          />
        )}
      </SidePanel.Content>
    </>
  );
};

export default RepositoryProfileEditForm;
