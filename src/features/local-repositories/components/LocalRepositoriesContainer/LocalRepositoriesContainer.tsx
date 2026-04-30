import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import LocalRepositoriesList from "../LocalRepositoriesList";
import AddLocalRepositoryButton from "../AddLocalRepositoryButton";
import EmptyState from "@/components/layout/EmptyState";
import type { Local } from "@canonical/landscape-openapi";
import usePageParams from "@/hooks/usePageParams";

interface LocalRepositoriesContainerProps {
  readonly isPending: boolean;
  readonly repositories: Local[];
}

const LocalRepositoriesContainer: FC<LocalRepositoriesContainerProps> = ({
  isPending,
  repositories,
}) => {
  const { search } = usePageParams();

  if (isPending) {
    return <LoadingState />;
  }

  if (!search && !repositories.length) {
    return (
      <EmptyState
        title="You don't have any local repositories yet"
        body={
          <>
            <p className="u-no-margin--bottom">
              Use local repositories to host internal packages and distribute
              them to your fleet, either through publications or via repository
              profiles.
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
        cta={[<AddLocalRepositoryButton key="add-local-repository" />]}
      />
    );
  }

  return (
    <>
      <HeaderWithSearch />
      <LocalRepositoriesList repositories={repositories} />
    </>
  );
};

export default LocalRepositoriesContainer;
