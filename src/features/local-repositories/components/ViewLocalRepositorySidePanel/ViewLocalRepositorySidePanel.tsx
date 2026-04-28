import { Suspense, useState, type FC } from "react";
import SidePanel from "@/components/layout/SidePanel";
import LoadingState from "@/components/layout/LoadingState";
import { Tabs } from "@canonical/react-components";
import classes from "./ViewLocalRepositorySidePanel.module.scss";
import ViewRepositoryActionsBlock from "./components/ViewRepositoryActionsBlock";
import ViewLocalRepositoryDetailsTab from "./components/ViewLocalRepositoryDetailsTab";
import LocalRepositoryPackagesList from "./components/LocalRepositoryPackagesList";
import { useGetPageLocalRepository } from "../../api/useGetPageLocalRepository";

const ViewLocalRepositorySidePanel: FC = () => {
  const [tabId, setTabId] = useState<"details" | "packages">("details");
  const { repository, isGettingRepository } = useGetPageLocalRepository();

  if (isGettingRepository) {
    return <SidePanel.LoadingState />;
  }

  const tabs: { label: string; id: "details" | "packages" }[] = [
    {
      label: "General details",
      id: "details",
    },
    {
      label: "Packages",
      id: "packages",
    },
  ];

  const links = tabs.map(({ label, id }) => ({
    label,
    active: tabId == id,
    onClick: () => {
      setTabId(id);
    },
  }));

  return (
    <>
      <SidePanel.Header>{repository.displayName}</SidePanel.Header>
      <SidePanel.Content>
        <ViewRepositoryActionsBlock repository={repository} />
        <Tabs listClassName={classes.marginBottom} links={links} />

        {tabId === "details" && (
          <Suspense fallback={<LoadingState />}>
            <ViewLocalRepositoryDetailsTab
              repository={repository}
              key="details"
            />
          </Suspense>
        )}

        {tabId === "packages" && (
          <Suspense fallback={<LoadingState />}>
            <LocalRepositoryPackagesList
              repository={repository}
              key="packages"
            />
          </Suspense>
        )}
      </SidePanel.Content>
    </>
  );
};

export default ViewLocalRepositorySidePanel;
