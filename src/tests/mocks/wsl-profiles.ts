/* eslint @typescript-eslint/no-magic-numbers: 0 */

import type { WslProfile } from "@/features/wsl-profiles";

export const wslProfiles = [
  {
    id: 2,
    name: "stock-ubuntu-2404",
    title: "Stock Ubuntu 24.04",
    instance_type: "WSL",
    description: "The image from the store",
    image_name: "Ubuntu-24.04",
    image_source: null,
    cloud_init_contents: null,
    cloud_init_secret_name: null,
    tags: [],
    all_computers: true,
    access_group: "global",
    computers: {
      constrained: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 21, 22, 23, 24, 27, 28, 29, 30, 31,
        32,
      ],
      "non-compliant": [27],
      pending: [6],
    },
    only_landscape_created: false,
  },
  {
    id: 1,
    name: "stuff",
    title: "stuff",
    instance_type: "WSL",
    description: "some stuff",
    image_name: "stuff",
    image_source: "https://example.com",
    cloud_init_contents: null,
    cloud_init_secret_name: null,
    tags: ["appservers"],
    all_computers: false,
    access_group: "global",
    computers: {
      constrained: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 21, 22, 23, 24, 27, 28, 29, 30, 31,
        32,
      ],
      "non-compliant": [27],
      pending: [6],
    },
    only_landscape_created: true,
  },
] as const satisfies WslProfile[];
