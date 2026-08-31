import { lazy, type FC } from "react";
import SidePanel from "@/components/layout/SidePanel";
import InfoGrid from "@/components/layout/InfoGrid/InfoGrid";
import usePageParams from "@/hooks/usePageParams";
import useRoles from "@/hooks/useRoles";
import AccessGroupAdministratorsTable from "./AccessGroupAdministratorsTable/AccessGroupAdministratorsTable";
import Blocks from "@/components/layout/Blocks/Blocks";
import { Button, Icon } from "@canonical/react-components";
import { useBoolean } from "usehooks-ts";
import { DEFAULT_ACCESS_GROUP_NAME } from "@/constants";
import { ResponsiveButtons } from "@/components/ui";
import AccessGroupInstanceCountCell from "../AccessGroupInstanceCountCell";

const AccessGroupDeleteModal = lazy(
  async () => import("../AccessGroupDeleteModal"),
);

const ViewAccessGroupSidePanel: FC = () => {
  const { name, createPageParamsSetter } = usePageParams();
  const { getAccessGroupQuery } = useRoles();
  const { data: accessGroupsResponse, isLoading } = getAccessGroupQuery();

  const {
    value: isDeleteModalOpen,
    setTrue: openDeleteModal,
    setFalse: closeDeleteModal,
  } = useBoolean();

  if (isLoading) {
    return <SidePanel.LoadingState />;
  }

  const accessGroups = accessGroupsResponse?.data ?? [];
  const accessGroup = accessGroups.find((group) => group.name === name);

  if (!accessGroup) {
    throw new Error(`Access group "${name}" was not found`);
  }

  const isNotRootGroup = accessGroup.name !== DEFAULT_ACCESS_GROUP_NAME;

  const parentTitle =
    accessGroups.find((group) => group.name === accessGroup.parent)?.title ??
    accessGroup.parent;

  const childNames = accessGroup.children
    ? accessGroup.children.split(",").filter(Boolean)
    : [];

  return (
    <>
      <SidePanel.Header>{accessGroup.title}</SidePanel.Header>
      {isNotRootGroup && (
        <ResponsiveButtons
          buttons={[
            <Button
              key="delete"
              hasIcon
              type="button"
              onClick={openDeleteModal}
            >
              <Icon name="delete--negative" />
              <span className="u-text--negative">Delete</span>
            </Button>,
          ]}
        />
      )}
      <SidePanel.Content>
        <Blocks>
          <Blocks.Item title="Details">
            <InfoGrid dense>
              <InfoGrid.Item label="Title" value={accessGroup.title} />
              {isNotRootGroup && (
                <InfoGrid.Item
                  label="Parent"
                  value={
                    <Button
                      className="u-no-padding--top u-no-margin--bottom"
                      type="button"
                      appearance="link"
                      onClick={createPageParamsSetter({
                        name: accessGroup.parent,
                      })}
                    >
                      {parentTitle}
                    </Button>
                  }
                />
              )}
              <InfoGrid.Item
                label="Children"
                large
                value={
                  childNames.length > 0 ? (
                    <>
                      {childNames.map((childName, index) => {
                        const childTitle =
                          accessGroups.find((ag) => ag.name === childName)
                            ?.title ?? childName;
                        return (
                          <span key={childName}>
                            <Button
                              className="u-no-padding--top u-no-margin--bottom"
                              type="button"
                              appearance="link"
                              onClick={createPageParamsSetter({
                                name: childName,
                              })}
                            >
                              {childTitle}
                            </Button>
                            {index < childNames.length - 1 && ", "}
                          </span>
                        );
                      })}
                    </>
                  ) : null
                }
              />
              <InfoGrid.Item
                label="Associated instances"
                value={
                  <AccessGroupInstanceCountCell accessGroup={accessGroup} />
                }
              />
            </InfoGrid>
          </Blocks.Item>

          <Blocks.Item title="Used by">
            <AccessGroupAdministratorsTable
              accessGroupName={accessGroup.name}
            />
          </Blocks.Item>
        </Blocks>
      </SidePanel.Content>
      <AccessGroupDeleteModal
        accessGroup={accessGroup}
        opened={isDeleteModalOpen}
        close={closeDeleteModal}
        parentAccessGroupTitle={parentTitle}
      />
    </>
  );
};

export default ViewAccessGroupSidePanel;
