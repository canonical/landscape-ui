import type { AutoinstallFile } from "@/features/autoinstall-files";

export const autoinstallFiles: AutoinstallFile[] = [
  {
    id: 1,
    contents: "echo 'Hello World'",
    version: 3,
    filename: "default-autoinstall.yaml",
    is_default: true,
    created_at: "2025-02-02T17:55:23.806269",
    last_modified_at: "2025-02-07T17:55:23.806269",
  },
  {
    id: 2,
    contents: "echo 'Hello World'",
    version: 3,
    filename: "web-engineer-autoinstall.yaml",
    is_default: false,
    created_at: "2025-02-02T17:55:23.806269",
    last_modified_at: "2025-02-07T17:55:23.806269",
  },
  {
    id: 3,
    contents: "echo 'Hello World'",
    version: 3,
    filename: "backend-engineer-autoinstall.yaml",
    is_default: false,
    created_at: "2025-02-02T17:55:23.806269",
    last_modified_at: "2025-02-07T17:55:23.806269",
  },
];

export const autoinstallFileCode = `#cloud-config
autoinstall:
  version: 1
  locale: en_US
  keyboard:
    layout: us
  
  identity:
    hostname: ubuntu-server
    Employeename: ubuntu
    # Generated with: mkpasswd -m sha-512
    password: "$6$xyz$UGe4v.Qp3/Vvhn0KkqgMe9L6nqwcD.bkFRLdG1H.ZFGS/rpm4CGJZt0Xq4/VxKNeq.f6GxwaxoZBWYVGg.1G5/"
  
  storage:
    layout:
      name: direct
    swap:
      size: 0
  
  network:
    network:
      version: 2
      ethernets:
        ens33:
          dhcp4: true
  
  ssh:
    install-server: true
    allow-pw: true
  
  packages:
    - vim
    - curl
    - wget
    - unzip
    - git
    - htop
  
  updates:
    update: true
    upgrade: true
  
  late-commands:
    - echo 'ubuntu ALL=(ALL) NOPASSWD:ALL' > /target/etc/sudoers.d/ubuntu
    - chmod 440 /target/etc/sudoers.d/ubuntu
  
  user-data:
    disable_root: true
    timezone: UTC
    package_update: true
    package_upgrade: true
    
  apt:
    primary:
      - arches: [amd64]
        uri: "http://archive.ubuntu.com/ubuntu"
    
  snap:
    commands:
      - snap install core`;
