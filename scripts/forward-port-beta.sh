#!/usr/bin/env bash
set -euo pipefail

version=$1
sha=$2
main=${3:-origin/main}
if [[ $(git rev-parse "refs/tags/${version}^{commit}") != "$sha" ]]; then
  echo "Tag $version does not point to $sha." >&2
  exit 1
fi

# Main and beta use squash merges. A merged forward-port records the exact
# source checkpoint as a trailer on its squash commit. Read the full commit
# body because GitHub may append a Co-authored-by paragraph after the trailer.
# Check all checkpoints before choosing the furthest-along ancestor of $sha.
base=$main
checkpoints=$(git log "$main" --format=%B --grep='^Landscape-Beta-Source: ' \
  | sed -n 's/^Landscape-Beta-Source:[[:space:]]*\([^[:space:]]*\)[[:space:]]*$/\1/p')
while IFS= read -r checkpoint; do
  [[ -n "$checkpoint" ]] || continue
  if [[ ! $checkpoint =~ ^[0-9a-fA-F]{7,40}$ ]]; then
    echo "Warning: ignoring invalid Landscape-Beta-Source checkpoint '$checkpoint'." >&2
    continue
  fi
  resolved=$(git rev-parse --verify -q "${checkpoint}^{commit}" || true)
  if [[ -z "$resolved" ]]; then
    echo "Warning: ignoring unresolved Landscape-Beta-Source checkpoint '$checkpoint'." >&2
    continue
  fi
  if git merge-base --is-ancestor "$sha" "$resolved"; then
    echo "Main already incorporates $version via checkpoint $resolved."
    git switch --create "beta-forward-port/$version" "$main"
    exit 0
  fi
  if git merge-base --is-ancestor "$resolved" "$sha"; then
    if [[ "$base" == "$main" ]] || git merge-base --is-ancestor "$base" "$resolved"; then
      base=$resolved
    fi
  fi
done <<< "$checkpoints"

commits=$(git rev-list --reverse --first-parent "$sha" --not "$main" "$base")
git switch --create "beta-forward-port/$version" "$main"
while IFS= read -r commit; do
  [[ -n "$commit" ]] || continue
  # Skip commits that are already empty (e.g., --allow-empty or no-op merges),
  # since cherry-pick --empty=drop exits nonzero on originally empty commits.
  if git rev-parse --verify -q "${commit}^1" > /dev/null \
    && git diff --quiet "${commit}^1" "$commit"; then
    continue
  fi
  # Replay the changes that landed on the beta branch, including a merge
  # commit's net change if the branch was prepared outside GitHub.
  if ! git cherry-pick --empty=drop -m 1 "$commit"; then
    echo "Forward-port conflict at $commit. Replay the missing commits in a manual PR to main." >&2
    echo "Keep this trailer in the squash commit: Landscape-Beta-Source: $sha" >&2
    exit 1
  fi
done <<< "$commits"
