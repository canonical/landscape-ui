import type { GPGKey } from "@/features/gpg-keys";
import { useGPGKeys } from "@/features/gpg-keys";
import type { SelectOption } from "@/types/SelectOption";

const useGPGKeysOptions = (): {
  privateGPGKeysOptions: SelectOption[];
  publicGPGKeysOptions: SelectOption[];
} => {
  const { getGPGKeysQuery } = useGPGKeys();

  const { data: { data: gpgKeys } = { data: [] as GPGKey[] } } =
    getGPGKeysQuery();

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
