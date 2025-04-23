import type {
  Script,
  ScriptVersion,
  SingleScript,
} from "../../features/scripts";

export const scripts: Script[] = [
  {
    id: 1,
    access_group: "global",
    title: "List temporary files",
    time_limit: 10,
    username: "nobody",
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
    status: "ACTIVE",
    created_by: {
      name: "John Smith",
      id: 1,
    },
    created_at: "2023-10-01T00:00:00Z",
    last_edited_by: {
      name: "John Smith",
      id: 1,
    },
    last_edited_at: "2023-11-01T00:00:00Z",
    script_profiles: [
      { id: 1, title: "Profile 1" },
      { id: 2, title: "Profile 2" },
      { id: 3, title: "Profile 3" },
      { id: 4, title: "Profile 4" },
      { id: 5, title: "Profile 5" },
    ],
    code: "",
    interpreter: "",
    is_redactable: false,
    is_editable: false,
    is_executable: false,
  },
  {
    id: 2,
    access_group: "server",
    title: "Execute python attachment",
    time_limit: 20,
    username: "nobody",
    attachments: [
      {
        id: 1,
        filename: "run.py",
      },
    ],
    status: "ACTIVE",
    created_by: {
      name: "John Smith",
      id: 1,
    },
    created_at: "2023-10-01T00:00:00Z",
    last_edited_by: {
      name: "John Smith",
      id: 1,
    },
    last_edited_at: "2023-11-01T00:00:00Z",
    script_profiles: [],
    code: "",
    interpreter: "",
    is_redactable: false,
    is_editable: false,
    is_executable: false,
  },
  {
    id: 3,
    access_group: "global",
    title: "Show Landscape environment variables",
    time_limit: 20,
    username: "nobody",
    attachments: [
      {
        id: 1,
        filename: "run.py",
      },
    ],
    status: "ACTIVE",
    created_by: {
      name: "John Smith",
      id: 1,
    },
    created_at: "2023-10-01T00:00:00Z",
    last_edited_by: {
      name: "John Smith",
      id: 1,
    },
    last_edited_at: "2023-11-01T00:00:00Z",
    script_profiles: [],
    code: "",
    interpreter: "",
    is_redactable: false,
    is_editable: false,
    is_executable: false,
  },
  {
    id: 8,
    access_group: "desktop",
    title: "tesst",
    time_limit: 300,
    username: "",
    attachments: [],
    status: "ACTIVE",
    created_by: {
      name: "John Smith",
      id: 1,
    },
    created_at: "2023-10-01T00:00:00Z",
    last_edited_by: {
      name: "John Smith",
      id: 1,
    },
    last_edited_at: "2023-11-01T00:00:00Z",
    script_profiles: [],
    code: "",
    interpreter: "",
    is_redactable: false,
    is_editable: false,
    is_executable: false,
  },
  {
    id: 9,
    access_group: "global",
    title: "Script-1",
    time_limit: 300,
    username: "root",
    attachments: [],
    status: "ACTIVE",
    created_by: {
      name: "John Smith",
      id: 1,
    },
    created_at: "2023-10-01T00:00:00Z",
    last_edited_by: {
      name: "John Smith",
      id: 1,
    },
    last_edited_at: "2023-11-01T00:00:00Z",
    script_profiles: [],
    code: "",
    interpreter: "",
    is_redactable: false,
    is_editable: false,
    is_executable: false,
  },
  {
    id: 11,
    access_group: "desktop",
    title: "A new script",
    time_limit: 300,
    username: "",
    attachments: [],
    status: "ACTIVE",
    created_by: {
      name: "John Smith",
      id: 1,
    },
    created_at: "2023-10-01T00:00:00Z",
    last_edited_by: {
      name: "John Smith",
      id: 1,
    },
    last_edited_at: "2023-11-01T00:00:00Z",
    script_profiles: [],
    code: "",
    interpreter: "",
    is_redactable: false,
    is_editable: false,
    is_executable: false,
  },
  {
    id: 14,
    access_group: "server",
    title: "test",
    time_limit: 300,
    username: "",
    attachments: [],
    status: "ACTIVE",
    created_by: {
      name: "John Smith",
      id: 1,
    },
    created_at: "2023-10-01T00:00:00Z",
    last_edited_by: {
      name: "John Smith",
      id: 1,
    },
    last_edited_at: "2023-11-01T00:00:00Z",
    script_profiles: [],
    code: "",
    interpreter: "",
    is_redactable: false,
    is_editable: false,
    is_executable: false,
  },
];

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

export const scriptVersions: ScriptVersion[] = [
  {
    account_id: 1,
    code: "#!/bin/shell\nls /tmp",
    created_at: "2023-10-01T00:00:00Z",
    creator_id: 1,
    creator_name: "John Smith",
    id: 1,
    interpreter: "shell",
    script_id: 1,
    title: "List temporary files",
    version_number: 1,
  },
  {
    account_id: 1,
    code: "#!/bin/shell\nls /tmp",
    created_at: "2023-10-01T00:00:00Z",
    creator_id: 1,
    creator_name: "John Smith",
    id: 2,
    interpreter: "shell",
    script_id: 1,
    title: "List temporary files",
    version_number: 2,
  },
  {
    account_id: 1,
    code: "#!/bin/shell\nls /tmp",
    created_at: "2023-10-01T00:00:00Z",
    creator_id: 1,
    creator_name: "John Smith",
    id: 3,
    interpreter: "shell",
    script_id: 1,
    title: "List temporary files",
    version_number: 3,
  },
];

export const scriptVersion = {
  id: 1,
  code: "#!/bin/shell\nls /tmp",
  created_by: {
    name: "John Smith",
    id: 1,
  },
  created_at: "2023-10-01T00:00:00Z",
  version_number: 1,
  interpreter: "shell",
  title: "List temporary files",
};
