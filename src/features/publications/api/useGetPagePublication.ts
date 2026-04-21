import usePageParams from "@/hooks/usePageParams";
import type { Publication } from "../types";
import useGetPublication from "./useGetPublication";

const useGetPagePublication = ():
  | { publication: Publication; isGettingPublication: false }
  | { publication: undefined; isGettingPublication: true } => {
  const { name: publicationId } = usePageParams();

  const { publication, isGettingPublication, publicationError } =
    useGetPublication({ publicationName: publicationId });

  if (publicationError) {
    throw publicationError;
  }

  if (isGettingPublication) {
    return {
      publication: undefined,
      isGettingPublication: true,
    };
  }

  return {
    publication: publication as Publication,
    isGettingPublication: false,
  };
};

export default useGetPagePublication;
