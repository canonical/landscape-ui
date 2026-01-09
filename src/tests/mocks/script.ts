import type {
  Script,
  SingleScript,
  TruncatedScriptVersion,
} from "@/features/scripts";

export const scripts = [
  {
    id: 30,
    title: "new v2 script",
    version_number: 1,
    created_by: {
      id: 1,
      name: "John Smith",
    },
    created_at: "2025-04-10T07:01:39.062323",
    last_edited_by: {
      id: 1,
      name: "John Smith",
    },
    last_edited_at: "2025-04-10T07:01:39.062323",
    script_profiles: [
      {
        title: "abc",
        id: 12,
      },
    ],
    status: "ACTIVE",
    attachments: [],
    code: "\nls /tmp",
    interpreter: "/bin/bash",
    access_group: "global",
    time_limit: 300,
    username: "",
    is_redactable: true,
    is_editable: true,
    is_executable: true,
  },
  {
    id: 31,
    title: "new v2 script 1",
    version_number: 1,
    created_by: {
      id: 1,
      name: "John Smith",
    },
    created_at: "2025-04-10T23:20:44.869800",
    last_edited_by: {
      id: 1,
      name: "John Smith",
    },
    last_edited_at: "2025-04-10T23:20:44.869800",
    script_profiles: [
      {
        title: "script_profile_4",
        id: 4,
      },
      {
        title: "fdsasdf",
        id: 10,
      },
    ],
    status: "ACTIVE",
    attachments: [],
    code: "\nls /tmp",
    interpreter: "/bin/bash",
    access_group: "global",
    time_limit: 300,
    username: "",
    is_redactable: true,
    is_editable: true,
    is_executable: false,
  },
  {
    id: 32,
    title: "new v2 script 2",
    version_number: 1,
    created_by: {
      id: 1,
      name: "John Smith",
    },
    created_at: "2025-04-10T23:20:49.943179",
    last_edited_by: {
      id: 1,
      name: "John Smith",
    },
    last_edited_at: "2025-04-10T23:20:49.943179",
    script_profiles: [],
    status: "ACTIVE",
    attachments: [],
    code: "\nls /tmp",
    interpreter: "/bin/bash",
    access_group: "global",
    time_limit: 300,
    username: "",
    is_redactable: false,
    is_editable: true,
    is_executable: true,
  },
  {
    id: 33,
    title: "new v2 script 3",
    version_number: 1,
    created_by: {
      id: 1,
      name: "John Smith",
    },
    created_at: "2025-04-10T23:20:53.920360",
    last_edited_by: {
      id: 1,
      name: "John Smith",
    },
    last_edited_at: "2025-04-10T23:20:53.920360",
    script_profiles: [],
    status: "ACTIVE",
    attachments: [],
    code: "\nls /tmp",
    interpreter: "/bin/bash",
    access_group: "global",
    time_limit: 300,
    username: "",
    is_redactable: true,
    is_editable: false,
    is_executable: true,
  },
  {
    id: 34,
    title: "redacted script",
    version_number: 4,
    created_by: {
      id: 1,
      name: "John Smith",
    },
    created_at: "2025-04-10T23:20:57.681000",
    last_edited_by: {
      id: 1,
      name: "John Smith",
    },
    last_edited_at: "2025-04-10T23:23:59.882443",
    script_profiles: [
      {
        title: "script_profile_1",
        id: 1,
      },
      {
        title: "script_profile_6",
        id: 14,
      },
    ],
    status: "REDACTED",
    attachments: [],
    code: '\nURL="https://example.com"\n\nif curl -s --head "$URL" | grep "200 OK" > /dev/null; then\n  echo "\u2705 $URL is up."\nelse\n  echo "\u274c $URL seems down."\nfi\n\n# version 3\n',
    interpreter: "/bin/bash",
    access_group: "global",
    time_limit: 300,
    username: "",
    is_redactable: true,
    is_editable: true,
    is_executable: true,
  },
  {
    id: 35,
    title: "archived script",
    version_number: 1,
    created_by: {
      id: 1,
      name: "John Smith",
    },
    created_at: "2025-04-10T23:21:02.209514",
    last_edited_by: {
      id: 1,
      name: "John Smith",
    },
    last_edited_at: "2025-04-10T23:21:02.209514",
    script_profiles: [
      {
        title: "script_profile_5",
        id: 5,
      },
      {
        title: "Optics and Design",
        id: 17,
      },
      {
        title: "Test",
        id: 9,
      },
      {
        title: "zxcvsda",
        id: 11,
      },
    ],
    status: "ARCHIVED",
    attachments: [],
    code: "\nls /tmp",
    interpreter: "/bin/bash",
    access_group: "global",
    time_limit: 300,
    username: "",
    is_redactable: true,
    is_editable: true,
    is_executable: true,
  },
  {
    id: 40,
    title: "test 2",
    version_number: 1,
    created_by: {
      id: 1,
      name: "John Smith",
    },
    created_at: "2025-04-22T09:01:33.196083",
    last_edited_by: {
      id: 1,
      name: "John Smith",
    },
    last_edited_at: "2025-04-22T09:01:33.196083",
    script_profiles: [],
    status: "ACTIVE",
    attachments: [
      {
        filename: "test.py",
        id: 18,
      },
    ],
    code: 'print("test 2")',
    interpreter: "/bin/bash",
    access_group: "global",
    time_limit: 300,
    username: "",
    is_redactable: true,
    is_editable: true,
    is_executable: true,
  },
] as const satisfies Script[];

export const scriptCodes: {
  script_id: number;
  code: string;
}[] = [
  {
    script_id: 1,
    code: "#!/bin/shell\nls /tmp",
  },
  {
    script_id: 2,
    code: "#!/bin/shell\npython3 $LANDSCAPE_ATTACHMENTS/run.py \n// test",
  },
  {
    script_id: 3,
    code: '#!/usr/bin/python3\nimport json\nfrom os import environ\nlsvars = {}\nfor key, value in environ.items():\n    if key.startswith("LANDSCAPE_"):\n        lsvars[key] = value\nprint(json.dumps(lsvars))\n',
  },
  {
    script_id: 8,
    code: "#!/bin/shell\n<cool>yes<cool>",
  },
  {
    script_id: 9,
    code: '#!/bin/shell\nnic="$(ip -br a | grep enx | awk \'{print $1}\')"\nsleep 15\nfor i in /sys/bus/usb/devices/*/power/autosuspend; do echo 2 > $i; done\nfor foo in /sys/bus/usb/devices/*/power/control; do echo on > $foo; done\nethtool -K ${nic} sg off\nethtool -G ${nic} rx 4096\nethtool --set-eee ${nic} eee off\nlogger "USB Port power settings applied."',
  },
  {
    script_id: 11,
    code: '#!/usr/bin/env python3\n\nprint("I\'m a script")\n ',
  },
  {
    script_id: 14,
    code: "#!/bin/shell\n<cool>yes<cool>",
  },
];

export const scriptDetails: SingleScript = {
  ...scripts[0],
  status: "ARCHIVED",
  code: "#!/bin/shell\nls /tmp",
  version_number: 1,
  attachments: [
    {
      id: 1,
      filename: "run.py",
    },
    {
      id: 2,
      filename: "hello.py",
    },
    {
      id: 3,
      filename: "test.py",
    },
    {
      id: 4,
      filename: "test2.py",
    },
  ],
  script_profiles: [
    { id: 1, title: "Profile 1" },
    { id: 2, title: "Profile 2" },
    { id: 3, title: "Profile 3" },
    { id: 4, title: "Profile 4" },
    { id: 5, title: "Profile 5" },
  ],
};

export const activeScriptDetails: SingleScript = {
  ...scripts[0],
  status: "ACTIVE",
  code: "#!/bin/shell\nls /tmp",
  version_number: 1,
};

export const detailedScriptsData = [
  {
    ...scripts[0],
    status: "ACTIVE",
    code: "#!/bin/shell\nls /tmp",
    version_number: 1,
  },
  {
    ...scripts[1],
    status: "ARCHIVED",
    code: "#!/bin/shell\nls /tmp",
    version_number: 1,
  },
  {
    ...scripts[2],
    status: "REDACTED",
    code: "#!/bin/shell\nls /tmp",
    version_number: 1,
  },
] as const;

export const scriptVersions: TruncatedScriptVersion[] = [
  {
    code: "#!/bin/shell\nls /tmp",
    created_at: "2023-10-01T00:00:00Z",
    id: 1,
    interpreter: "shell",
    title: "List temporary files",
    version_number: 1,
    created_by: {
      id: 1,
      name: "John Smith",
    },
  },
  {
    code: "#!/bin/shell\nls /tmp",
    created_at: "2023-10-01T00:00:00Z",
    id: 2,
    interpreter: "shell",
    title: "List temporary files",
    version_number: 2,
    created_by: {
      id: 1,
      name: "John Smith",
    },
  },
  {
    code: "#!/bin/shell\nls /tmp",
    created_at: "2023-10-01T00:00:00Z",
    id: 3,
    interpreter: "shell",
    title: "List temporary files",
    version_number: 3,
    created_by: {
      id: 1,
      name: "John Smith",
    },
  },
  {
    code: "#!/bin/shell\nls /tmp",
    created_at: "2023-10-01T00:00:00Z",
    id: 4,
    interpreter: "shell",
    title: "List temporary files",
    version_number: 4,
    created_by: {
      id: 1,
      name: "John Smith",
    },
  },
  {
    code: "#!/bin/shell\nls /tmp",
    created_at: "2023-10-01T00:00:00Z",
    id: 5,
    interpreter: "shell",
    title: "List temporary files",
    version_number: 5,
    created_by: {
      id: 1,
      name: "John Smith",
    },
  },
];

export const scriptVersionsWithPagination: TruncatedScriptVersion[] = [
  ...scriptVersions,
  ...scriptVersions,
  ...scriptVersions,
  ...scriptVersions,
  ...scriptVersions,
  ...scriptVersions,
].map((version, index) => ({
  ...version,
  id: version.id + index * 5,
  version_number: version.version_number + index,
}));

export const scriptVersion = {
  id: 1,
  code: "ls /tmp",
  created_by: {
    name: "John Smith",
    id: 1,
  },
  created_at: "2023-10-01T00:00:00Z",
  version_number: 1,
  interpreter: "shell",
  title: "List temporary files",
};
