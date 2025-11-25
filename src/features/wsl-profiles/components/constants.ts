export const MAX_FILE_SIZE_MB = 1;

export const CLOUD_INIT_OPTIONS = [
  {
    label: "Select",
    value: "",
  },
  {
    label: "From a file",
    value: "file",
  },
  {
    label: "Plain text",
    value: "text",
  },
];

export const FILE_INPUT_HELPER_TEXT =
  "You can use a cloud-init configuration YAML file under 1MB to register new WSL instances. cloud-init streamlines the setup by automating installation and configuration tasks.";

export const RESERVED_PATTERNS = [
  /^ubuntu$/,
  /^ubuntu-preview$/,
  /^ubuntu-[0-9]{2}\.[0-9]{2}$/,
];
