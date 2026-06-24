import { useGetLocalRepository } from "./useGetLocalRepository";
import usePageParams from "@/hooks/usePageParams";
import type { Local } from "@canonical/landscape-openapi";

export const useGetPageLocalRepository = (): Local => {
  const { name } = usePageParams();
  return useGetLocalRepository(`locals/${name}`);
};
