import type { Script } from "../../features/scripts/types";

export const scripts: Script[] = [
  {
    id: 1,
    access_group: "global",
    creator: {
      name: "John Smith",
      email: "john@example.com",
      id: 1,
    },
    title: "List temporary files",
    time_limit: 10,
    username: "nobody",
    attachments: [],
    status: "active",
  },
  {
    id: 2,
    access_group: "server",
    creator: {
      name: "John Smith",
      email: "john@example.com",
      id: 1,
    },
    title: "Execute python attachment",
    time_limit: 20,
    username: "nobody",
    attachments: ["run.py"],
    status: "active",
  },
  {
    id: 3,
    access_group: "global",
    creator: {
      name: "John Smith",
      email: "john@example.com",
      id: 1,
    },
    title: "Show Landscape environment variables",
    time_limit: 20,
    username: "nobody",
    attachments: ["hello.txt"],
    status: "active",
  },
  {
    id: 8,
    access_group: "desktop",
    creator: {
      name: "John Smith",
      email: "john@example.com",
      id: 1,
    },
    title: "tesst",
    time_limit: 300,
    username: "",
    attachments: [],
    status: "active",
  },
  {
    id: 9,
    access_group: "global",
    creator: {
      name: "John Smith",
      email: "john@example.com",
      id: 1,
    },
    title: "Script-1",
    time_limit: 300,
    username: "root",
    attachments: [],
    status: "active",
  },
  {
    id: 11,
    access_group: "desktop",
    creator: {
      name: "John Smith",
      email: "john@example.com",
      id: 1,
    },
    title: "A new script",
    time_limit: 300,
    username: "",
    attachments: [],
    status: "active",
  },
  {
    id: 14,
    access_group: "server",
    creator: {
      name: "John Smith",
      email: "john@example.com",
      id: 1,
    },
    title: "test",
    time_limit: 300,
    username: "",
    attachments: [],
    status: "active",
  },
];

export const scriptCodes: {
  script_id: number;
  code: string;
}[] = [
  {
    script_id: 1,
    code: "#!/bin/bash\nls /tmp",
  },
  {
    script_id: 2,
    code: "#!/bin/bash\npython3 $LANDSCAPE_ATTACHMENTS/run.py \n// test",
  },
  {
    script_id: 3,
    code: '#!/usr/bin/python3\nimport json\nfrom os import environ\nlsvars = {}\nfor key, value in environ.items():\n    if key.startswith("LANDSCAPE_"):\n        lsvars[key] = value\nprint(json.dumps(lsvars))\n',
  },
  {
    script_id: 8,
    code: "#!/bin/bash\n<cool>yes<cool>",
  },
  {
    script_id: 9,
    code: '#!/bin/bash\nnic="$(ip -br a | grep enx | awk \'{print $1}\')"\nsleep 15\nfor i in /sys/bus/usb/devices/*/power/autosuspend; do echo 2 > $i; done\nfor foo in /sys/bus/usb/devices/*/power/control; do echo on > $foo; done\nethtool -K ${nic} sg off\nethtool -G ${nic} rx 4096\nethtool --set-eee ${nic} eee off\nlogger "USB Port power settings applied."',
  },
  {
    script_id: 11,
    code: '#!/usr/bin/env python3\n\nprint("I\'m a script")\n ',
  },
  {
    script_id: 14,
    code: "#!/bin/bash\n<cool>yes<cool>",
  },
];
