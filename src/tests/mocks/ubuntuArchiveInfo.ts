import type { UbuntuArchiveInfo } from "@/features/mirrors";

export const ubuntuArchiveInfo = {
  label: "Ubuntu Archive",
  mirror_type: "archive",
  mirror_url: "https://archive.ubuntu.com/ubuntu/",
  distributions: [
    {
      slug: "trusty-backports",
      label: "trusty-backports",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
      ],
    },
    {
      slug: "trusty-proposed",
      label: "trusty-proposed",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
      ],
    },
    {
      slug: "trusty-security",
      label: "trusty-security",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
      ],
    },
    {
      slug: "trusty-updates",
      label: "trusty-updates",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
      ],
    },
    {
      slug: "xenial",
      label: "xenial",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "powerpc",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "xenial-backports",
      label: "xenial-backports",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "xenial-proposed",
      label: "xenial-proposed",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "xenial-security",
      label: "xenial-security",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "xenial-updates",
      label: "xenial-updates",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "bionic",
      label: "bionic",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "bionic-backports",
      label: "bionic-backports",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "bionic-proposed",
      label: "bionic-proposed",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "bionic-security",
      label: "bionic-security",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "bionic-updates",
      label: "bionic-updates",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "focal",
      label: "focal",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "focal-backports",
      label: "focal-backports",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "focal-proposed",
      label: "focal-proposed",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "focal-security",
      label: "focal-security",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "focal-updates",
      label: "focal-updates",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "jammy",
      label: "jammy",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "jammy-backports",
      label: "jammy-backports",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "jammy-proposed",
      label: "jammy-proposed",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "jammy-security",
      label: "jammy-security",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "jammy-updates",
      label: "jammy-updates",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "noble",
      label: "noble",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "noble-backports",
      label: "noble-backports",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "noble-proposed",
      label: "noble-proposed",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "noble-security",
      label: "noble-security",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "noble-updates",
      label: "noble-updates",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "plucky",
      label: "plucky",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "plucky-backports",
      label: "plucky-backports",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "plucky-proposed",
      label: "plucky-proposed",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "plucky-security",
      label: "plucky-security",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "plucky-updates",
      label: "plucky-updates",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "questing",
      label: "questing",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "amd64v3",
          preselected: false,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "questing-backports",
      label: "questing-backports",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "amd64v3",
          preselected: false,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "questing-proposed",
      label: "questing-proposed",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "amd64v3",
          preselected: false,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "questing-security",
      label: "questing-security",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "amd64v3",
          preselected: false,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "questing-updates",
      label: "questing-updates",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "amd64v3",
          preselected: false,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "resolute-backports",
      label: "resolute-backports",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "amd64v3",
          preselected: false,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "resolute-proposed",
      label: "resolute-proposed",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "amd64v3",
          preselected: false,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "resolute-security",
      label: "resolute-security",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "amd64v3",
          preselected: false,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "resolute-updates",
      label: "resolute-updates",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "amd64v3",
          preselected: false,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "resolute",
      label: "resolute",
      preselected: true,
      components: [
        {
          slug: "main",
          preselected: true,
        },
        {
          slug: "restricted",
          preselected: false,
        },
        {
          slug: "universe",
          preselected: false,
        },
        {
          slug: "multiverse",
          preselected: false,
        },
      ],
      architectures: [
        {
          slug: "amd64",
          preselected: true,
        },
        {
          slug: "amd64v3",
          preselected: false,
        },
        {
          slug: "arm64",
          preselected: false,
        },
        {
          slug: "armhf",
          preselected: false,
        },
        {
          slug: "i386",
          preselected: false,
        },
        {
          slug: "ppc64el",
          preselected: false,
        },
        {
          slug: "riscv64",
          preselected: false,
        },
        {
          slug: "s390x",
          preselected: false,
        },
      ],
    },
    {
      slug: "one-component-one-architecture",
      label: "one-component-one-architecture",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
      ],
      architectures: [
        {
          slug: "i386",
          preselected: false,
        },
      ],
    },
    {
      slug: "no-components",
      label: "no-components",
      preselected: false,
      components: [],
      architectures: [
        {
          slug: "i386",
          preselected: false,
        },
      ],
    },
    {
      slug: "no-architectures",
      label: "no-architectures",
      preselected: false,
      components: [
        {
          slug: "main",
          preselected: true,
        },
      ],
      architectures: [],
    },
  ],
} as const satisfies UbuntuArchiveInfo;

export const ubuntuESMInfo = [
  {
    label: "Infra",
    mirror_type: "infra",
    mirror_url: "https://esm.ubuntu.com/infra/ubuntu/",
    distributions: [
      {
        slug: "precise",
        label: "precise",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
        ],
      },
      {
        slug: "trusty-infra-security",
        label: "trusty-infra-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "trusty-infra-updates",
        label: "trusty-infra-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "trusty-security",
        label: "trusty-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "trusty-updates",
        label: "trusty-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "xenial-infra-security",
        label: "xenial-infra-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "xenial-infra-updates",
        label: "xenial-infra-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "bionic-infra-security",
        label: "bionic-infra-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "bionic-infra-updates",
        label: "bionic-infra-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "focal-infra-security",
        label: "focal-infra-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
      {
        slug: "focal-infra-updates",
        label: "focal-infra-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
      {
        slug: "jammy-infra-security",
        label: "jammy-infra-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
      {
        slug: "jammy-infra-updates",
        label: "jammy-infra-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
      {
        slug: "noble-infra-security",
        label: "noble-infra-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
      {
        slug: "noble-infra-updates",
        label: "noble-infra-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
      {
        slug: "resolute-infra-security",
        label: "resolute-infra-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
      {
        slug: "resolute-infra-updates",
        label: "resolute-infra-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
    ],
  },
  {
    label: "Apps",
    mirror_type: "apps",
    mirror_url: "https://esm.ubuntu.com/apps/ubuntu/",
    distributions: [
      {
        slug: "xenial-apps-security",
        label: "xenial-apps-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "xenial-apps-updates",
        label: "xenial-apps-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "bionic-apps-security",
        label: "bionic-apps-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "bionic-apps-updates",
        label: "bionic-apps-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "focal-apps-security",
        label: "focal-apps-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
      {
        slug: "focal-apps-updates",
        label: "focal-apps-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
      {
        slug: "jammy-apps-security",
        label: "jammy-apps-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
      {
        slug: "jammy-apps-updates",
        label: "jammy-apps-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
      {
        slug: "noble-apps-security",
        label: "noble-apps-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
      {
        slug: "noble-apps-updates",
        label: "noble-apps-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
      {
        slug: "resolute-apps-security",
        label: "resolute-apps-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
      {
        slug: "resolute-apps-updates",
        label: "resolute-apps-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "riscv64",
            preselected: false,
          },
        ],
      },
    ],
  },
  {
    label: "FIPS Updates",
    mirror_type: "fips-updates",
    mirror_url: "https://esm.ubuntu.com/fips-updates/ubuntu/",
    distributions: [
      {
        slug: "xenial-updates",
        label: "xenial-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
        ],
      },
      {
        slug: "bionic-updates",
        label: "bionic-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "focal-updates",
        label: "focal-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "jammy-updates",
        label: "jammy-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "noble-updates",
        label: "noble-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
    ],
  },
  {
    label: "CIS",
    mirror_type: "cis",
    mirror_url: "https://esm.ubuntu.com/cis/ubuntu/",
    distributions: [
      {
        slug: "xenial",
        label: "xenial",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
        ],
      },
      {
        slug: "bionic",
        label: "bionic",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
        ],
      },
      {
        slug: "focal",
        label: "focal",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
        ],
      },
      {
        slug: "jammy",
        label: "jammy",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "arm64",
            preselected: false,
          },
        ],
      },
      {
        slug: "noble",
        label: "noble",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "s390x",
            preselected: false,
          },
          {
            slug: "arm64",
            preselected: false,
          },
        ],
      },
    ],
  },
  {
    label: "Infra Legacy",
    mirror_type: "infra-legacy",
    mirror_url: "https://esm.ubuntu.com/infra-legacy/ubuntu/",
    distributions: [
      {
        slug: "trusty-infra-legacy-security",
        label: "trusty-infra-legacy-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "trusty-infra-legacy-updates",
        label: "trusty-infra-legacy-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "xenial-infra-legacy-security",
        label: "xenial-infra-legacy-security",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
      {
        slug: "xenial-infra-legacy-updates",
        label: "xenial-infra-legacy-updates",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "i386",
            preselected: false,
          },
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
          {
            slug: "armhf",
            preselected: false,
          },
          {
            slug: "armel",
            preselected: false,
          },
          {
            slug: "powerpc",
            preselected: false,
          },
          {
            slug: "ppc64el",
            preselected: false,
          },
          {
            slug: "s390x",
            preselected: false,
          },
        ],
      },
    ],
  },
  {
    label: "Realtime",
    mirror_type: "realtime",
    mirror_url: "https://esm.ubuntu.com/realtime/ubuntu/",
    distributions: [
      {
        slug: "jammy",
        label: "jammy",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
        ],
      },
      {
        slug: "noble",
        label: "noble",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "amd64",
            preselected: true,
          },
          {
            slug: "arm64",
            preselected: false,
          },
        ],
      },
    ],
  },
  {
    label: "Pro service with no valid distributions",
    mirror_type: "invalid",
    mirror_url: "https://esm.ubuntu.com/invalid/ubuntu/",
    distributions: [
      {
        slug: "jammy",
        label: "jammy",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [],
      },
    ],
  },
  {
    label: "Pro service with one of each",
    mirror_type: "one-of-each",
    mirror_url: "https://esm.ubuntu.com/one-of-each/ubuntu/",
    distributions: [
      {
        slug: "jammy",
        label: "jammy",
        preselected: true,
        components: [
          {
            slug: "main",
            preselected: true,
          },
        ],
        architectures: [
          {
            slug: "amd64",
            preselected: true,
          },
        ],
      },
    ],
  },
] as const satisfies UbuntuArchiveInfo[];
