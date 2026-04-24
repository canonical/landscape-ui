import type { Local } from "../types";
import { useGetLocalRepository } from "./useGetLocalRepository";
import usePageParams from "@/hooks/usePageParams";

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
    const { repository: repositoryId } = usePageParams();
    const { repository, isGettingRepository, repositoryError } =
      useGetLocalRepository(`locals/${repositoryId}`);

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
