import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import LocalRepositoriesList from "../LocalRepositoriesList";
import AddLocalRepositoryButton from "../AddLocalRepositoryButton";
import EmptyState from "@/components/layout/EmptyState";
import type { LocalRepository } from "../../types";

interface LocalRepositoriesContainerProps {
  readonly isPending: boolean,
  readonly items: LocalRepository[];
}

const LocalRepositoriesContainer: FC<LocalRepositoriesContainerProps> = ({
  isPending,
  items,
}) => {

  if (isPending) {
    return <LoadingState />;
  }

  if (!items.length) {
    return (
      <EmptyState
        title="You don't have any local repositories yet"
        body={
          <>
            <p className="u-no-margin--bottom">
              Use local repositories to host internal packages and distribute them to your fleet, either through publications or via repository profiles.
            </p>
            <a
              href="https://ubuntu.com/landscape/docs/repositories"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              Learn more about repository mirroring
            </a>
          </>
        }
        cta={[<AddLocalRepositoryButton key="add-local-repository"/>]}
      />
    );
  }

  return (
    <>
      <HeaderWithSearch />
      <LocalRepositoriesList items={items} />
    </>
  );
};

export default LocalRepositoriesContainer;
