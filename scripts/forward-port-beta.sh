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
# source checkpoint as a trailer on its squash commit. The ancestor check
# prevents a checkpoint from another beta cut from truncating this range.
base=$main
checkpoints=$(git log "$main" --format='%(trailers:key=Landscape-Beta-Source,valueonly,unfold)' \
  --grep='^Landscape-Beta-Source: ')
while IFS= read -r checkpoint; do
  if [[ $checkpoint =~ ^[0-9a-f]{40}$ ]] && git merge-base --is-ancestor "$checkpoint" "$sha"; then
    base=$checkpoint
    break
  fi
done <<< "$checkpoints"

commits=$(git rev-list --reverse --first-parent "$sha" --not "$main" "$base")
git switch --create "beta-forward-port/$version" "$main"
while IFS= read -r commit; do
  [[ -n "$commit" ]] || continue
  # Replay the changes that landed on the beta branch, including a merge
  # commit's net change if the branch was prepared outside GitHub.
  if ! git cherry-pick --empty=drop -m 1 "$commit"; then
    echo "Forward-port conflict at $commit. Replay the missing commits in a manual PR to main." >&2
    echo "Keep this trailer in the squash commit: Landscape-Beta-Source: $sha" >&2
    exit 1
  fi
done <<< "$commits"
