export const SETTINGS_HELP_TEXT = {
  hashIndexing: `Provides repository index files (like Packages and Sources) via their hash sums instead of just their names. This prevents "Hash Sum Mismatch" errors on client machines if the repository is updated during an active apt-get update session.`,
  automaticInstallation: `This creates an exception to the "Limit Automatic Installation" rule. While new packages from this repository won't be installed automatically, any package already installed on a system will be upgraded whenever a newer version is published to this repository.`,
  automaticUpgrades: `This tells apt that packages in this repository should not be installed or upgraded automatically. Users must explicitly target this repository or specific package versions to install them.`,
};
