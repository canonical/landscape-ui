import { GPGKey } from "@/features/gpg-keys";

export const gpgKeys: GPGKey[] = [
  {
    id: 2,
    name: "sign-key",
    key_id: "A44242B38D396F93",
    fingerprint: "f44d:cc48:31ec:d85d:013f:22f3:a442:42b3:8d39:6f93",
    has_secret: true,
  },
  {
    id: 26,
    name: "test-public",
    key_id: "FEE21E73307CA6EF",
    fingerprint: "e971:59de:e2e9:b4aa:ffcc:4dc4:fee2:1e73:307c:a6ef",
    has_secret: false,
  },
];
