import HeaderActions from "@/components/layout/HeaderActions";
import useAuth from "@/hooks/useAuth";
import useSidePanel from "@/hooks/useSidePanel";
import type { FC } from "react";
import React, { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import DetachTokenModal from "../DetachTokenModal";
import LoadingState from "@/components/layout/LoadingState";
import { getComputerIdFromParams } from "../../helpers";
import { useParams } from "react-router";
import type { UrlParams } from "@/types/UrlParams";
import type { Instance } from "@/types/Instance";

const ReplaceTokenForm = lazy(() => import("../ReplaceTokenForm"));

interface UbuntuProHeaderProps {
  readonly instance: Instance;
}

const UbuntuProHeader: FC<UbuntuProHeaderProps> = ({ instance }) => {
  const { instanceId, childInstanceId } = useParams<UrlParams>();
  const { isFeatureEnabled } = useAuth();
  const { setSidePanelContent } = useSidePanel();

  const {
    value: showDetachModal,
    setTrue: openDetachModal,
    setFalse: closeDetachModal,
  } = useBoolean(false);

  const handleEditToken = () => {
    setSidePanelContent(
      "Replace Ubuntu Pro Token",
      <Suspense fallback={<LoadingState />}>
        <ReplaceTokenForm selectedInstances={[instance]} />
      </Suspense>,
    );
  };

  return (
    <>
      <HeaderActions
        title={
          <div>
            <span className="p-heading--5 u-no-margin--bottom">
              Account information
            </span>{" "}
            <span style={{ display: "inline" }}>
              <span className="u-text--muted">listed from </span>
              <a
                href="https://ubuntu.com/pro/dashboard"
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                Ubuntu Pro Dashboard
              </a>
            </span>
          </div>
        }
        actions={{
          nondestructive: [
            { icon: "edit", label: "Edit token", onClick: handleEditToken },
          ],
          destructive: [
            {
              icon: "delete",
              label: "Detach token",
              onClick: openDetachModal,
              excluded: !isFeatureEnabled("ubuntu_pro_licensing"),
            },
          ],
        }}
      />
      <DetachTokenModal
        isOpen={showDetachModal}
        onClose={closeDetachModal}
        computerIds={getComputerIdFromParams({ instanceId, childInstanceId })}
        instanceTitle={instance.title}
      />
    </>
  );
};

export default UbuntuProHeader;
