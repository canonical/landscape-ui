import { useGPGKeys } from "@/features/gpg-keys";
import type { UseGPGKeysOptionsResult } from "../types/UseGPGKeysOptionsResult";

const useGPGKeysOptions = (): UseGPGKeysOptionsResult => {
  const { getGPGKeysQuery } = useGPGKeys();

  const { data: getGPGKeysQueryResult } = getGPGKeysQuery();

  const gpgKeys = getGPGKeysQueryResult?.data ?? [];

  return {
    privateGPGKeysOptions: gpgKeys
      .filter(({ has_secret }) => has_secret)
      .map((item) => ({
        label: item.name,
        value: item.name,
      })),
    publicGPGKeysOptions: gpgKeys
      .filter(({ has_secret }) => !has_secret)
      .map((item) => ({
        label: item.name,
        value: item.name,
      })),
  };
};

export default useGPGKeysOptions;
