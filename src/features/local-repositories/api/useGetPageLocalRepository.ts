import { useGetLocalRepository } from "./useGetLocalRepository";
import usePageParams from "@/hooks/usePageParams";
import type { Local } from "@canonical/landscape-openapi";

type GetPageLocalRepositoryReturnType =
  | {
      repository: Local;
      isGettingRepository: false;
    }
  | {
      repository: undefined;
      isGettingRepository: true;
    };

export const useGetPageLocalRepository =
  (): GetPageLocalRepositoryReturnType => {
    const { name } = usePageParams();
    const { repository, isGettingRepository, repositoryError } =
      useGetLocalRepository(`locals/${name}`);

    if (repositoryError) {
      throw repositoryError;
    }

    if (isGettingRepository) {
      return {
        repository: undefined,
        isGettingRepository: true,
      };
    }

    return {
      repository: repository as Local,
      isGettingRepository: false,
    };
  };
