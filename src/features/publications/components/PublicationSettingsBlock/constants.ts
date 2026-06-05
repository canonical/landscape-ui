export const HASH_INDEXING_HELP_TEXT = `Provides repository index files (like Packages and Sources) via their hash sums instead of just their names. This prevents "Hash Sum Mismatch" errors on client machines if the repository is updated during an active apt-get update session.`;

export const AUTOMATIC_DESCRIPTIONS = {
  automatic:
    "Allows packages to install and update seamlessly during standard OS runs.",
  autoUpgrades:
    "Lets packages upgrade automatically but forces new installations to be triggered manually.",
  manual:
    "Requires explicit admin intervention for both initial installation and any subsequent updates.",
};
