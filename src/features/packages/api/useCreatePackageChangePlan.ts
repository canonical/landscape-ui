import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { PackageChangePlan } from "../types/PackageChangePlan";

export enum Category {
  CATEGORY_UNSPECIFIED = 0,
  ALL = 1,
  ALL_SECURITY = 2,
}

export interface ByIds {
  package_ids?: number[];
}

export interface ByNames {
  package_names?: string[];
}

export interface ByCategory {
  category: Category;
  excluded_package_ids?: number[];
}

export interface VersionChange {
  current_package_id?: number;
  new_package_id?: number;
}

export type InstallConfig =
  | {
      by_ids: ByIds;
    }
  | {
      latest_by_names: ByNames;
    };

export type RemoveConfig =
  | {
      by_ids: ByIds;
    }
  | {
      any_version_by_names: ByNames;
    };

export type HoldConfig = ByIds;

export type UnholdConfig = ByIds;

export type UpgradeConfig =
  | {
      select_by_ids: ByIds;
    }
  | { select_by_category: ByCategory };

export interface ChangeVersionConfig {
  version_changes?: VersionChange[];
}

export type ActionConfig =
  | {
      install_config: InstallConfig;
    }
  | {
      remove_config: RemoveConfig;
    }
  | {
      hold_config: HoldConfig;
    }
  | {
      unhold_config: UnholdConfig;
    }
  | {
      upgrade_config: UpgradeConfig;
    }
  | {
      change_version_config: ChangeVersionConfig;
    };

export type CreatePackageChangePlanRequest = {
  computer_query: string;
} & ActionConfig;

export default function useCreatePackageChangePlan() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<PackageChangePlan>,
    AxiosError<ApiError>,
    CreatePackageChangePlanRequest
  >({
    mutationFn: async (params) =>
      authFetch.post("package-change-plans", params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["packageChangePlans"],
      });
    },
  });
}
