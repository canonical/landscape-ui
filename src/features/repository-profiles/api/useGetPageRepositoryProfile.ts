import usePageParams from "@/hooks/usePageParams";
import { useGetRepositoryProfile } from "./useGetRepositoryProfile";
import type { RepositoryProfile } from "../types";

const useGetPageRepositoryProfile = ():
  | {
      repositoryProfile: RepositoryProfile;
      isGettingRepositoryProfile: false;
    }
  | { repositoryProfile: undefined; isGettingRepositoryProfile: true } => {
  const { profile: repositoryProfileName } = usePageParams();

  const {
    isGettingRepositoryProfile,
    repositoryProfile,
    repositoryProfileError,
  } = useGetRepositoryProfile(repositoryProfileName);

  if (repositoryProfileError) {
    throw repositoryProfileError;
  }

  if (isGettingRepositoryProfile) {
    return {
      repositoryProfile: undefined,
      isGettingRepositoryProfile: true,
    };
  }

  return {
    repositoryProfile: repositoryProfile as RepositoryProfile,
    isGettingRepositoryProfile: false,
  };
};

export default useGetPageRepositoryProfile;
