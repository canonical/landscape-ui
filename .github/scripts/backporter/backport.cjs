const fs = require("node:fs");
const path = require("node:path");

const SECTION_HEADING = /Releases this PR should be backported to/i;
// Up to 3 leading spaces: 4 or more is an indented code block.
const ACTIONABLE_ENTRY =
  /^ {0,3}[-*]\s+\[ \]\s+((?:release|point)\/[a-zA-Z0-9][a-zA-Z0-9./-]*)\s*$/;
const ATX_HEADING = /^ {0,3}(#{1,6})(?:\s|$)/;
const SETEXT_UNDERLINE = /^ {0,3}(?:=+|-+)\s*$/;
const FENCE = /^ {0,3}(`{3,}|~{3,})(.*)$/;
const BACKPORT_BRANCHES = Object.freeze(["release/26.10", "point/26.04.2"]);
const BACKPORT_TITLE = /\(backport of #([1-9]\d*)\)\s*$/;
const TRUSTED_ASSOCIATIONS = new Set(["OWNER", "MEMBER", "COLLABORATOR"]);
const FAILURE_HEADLINE = /^Backport to `([^`\r\n]+)` failed$/;
const JIRA_URL =
  /https:\/\/warthogs\.atlassian\.net\/browse\/[A-Z][A-Z0-9]+-\d+/;
const SWEEP_DAYS = 30;

function stripHtmlComments(text) {
  // Preserve line offsets for byte-preserving link-back edits. GitHub hides
  // everything after an unclosed comment, so it runs to the end of the body.
  return text.replace(/<!--[\s\S]*?(?:-->|$)/g, (comment) =>
    comment.replace(/[^\n]/g, " "),
  );
}

function headingLevel(lines, i) {
  const atx = ATX_HEADING.exec(lines[i]);
  if (atx) {
    return atx[1].length;
  }
  const previous = i > 0 ? lines[i - 1] : "";
  if (
    SETEXT_UNDERLINE.test(lines[i]) &&
    previous.trim() !== "" &&
    !ATX_HEADING.test(previous)
  ) {
    return lines[i].trim().startsWith("=") ? 1 : 2;
  }
  return 0;
}

function actionableEntries(body) {
  const lines = stripHtmlComments(body || "")
    .split("\n")
    .map((line) => line.replace(/\r$/, ""));
  const entries = [];
  let sectionLevel = 0;
  let fence = null;
  for (let i = 0; i < lines.length; i++) {
    const marker = FENCE.exec(lines[i]);
    if (fence) {
      if (
        marker &&
        marker[1][0] === fence[0] &&
        marker[1].length >= fence.length &&
        !marker[2].trim()
      ) {
        fence = null;
      }
      continue;
    }
    if (marker) {
      fence = marker[1];
      continue;
    }
    const level = headingLevel(lines, i);
    if (!sectionLevel) {
      if (level && SECTION_HEADING.test(lines[i])) {
        sectionLevel = level;
      }
      continue;
    }
    if (level && level <= sectionLevel) {
      break;
    }
    const match = ACTIONABLE_ENTRY.exec(lines[i]);
    if (match) {
      entries.push({ line: i, release: match[1] });
    }
  }
  return entries;
}

function parseBackportReleases(body) {
  return [...new Set(actionableEntries(body).map((entry) => entry.release))];
}

function linkBackportEntry(body, release, url) {
  const entry = actionableEntries(body).find(
    (candidate) => candidate.release === release,
  );
  if (!entry) {
    return null;
  }
  const lines = body.split("\n");
  const carriageReturn = lines[entry.line].endsWith("\r") ? "\r" : "";
  lines[entry.line] =
    `${lines[entry.line].replace(/\s+$/, "")}: ${url}${carriageReturn}`;
  return lines.join("\n");
}

function isBackportTitle(title, number) {
  return (title || "").trimEnd().endsWith(`(backport of #${number})`);
}

function isTrustedBackport(pr, owner, repo) {
  const sameRepo = Boolean(
    pr.head && pr.head.repo && pr.head.repo.full_name === `${owner}/${repo}`,
  );
  return sameRepo || TRUSTED_ASSOCIATIONS.has(pr.author_association);
}

async function linkEntry({ github, core, owner, repo, number, release, url }) {
  const { data: pr } = await github.rest.pulls.get({
    owner,
    repo,
    pull_number: number,
  });
  const body = linkBackportEntry(pr.body, release, url);
  if (body === null) {
    core.info(`#${number} -> ${release}: entry already linked or removed`);
    return false;
  }
  await github.rest.pulls.update({ owner, repo, pull_number: number, body });
  core.info(`#${number} -> ${release}: linked ${url}`);
  return true;
}

async function linkOpenedBackport({ github, context, core }) {
  const { owner, repo } = context.repo;
  const pr = context.payload.pull_request;
  const release = pr.base.ref;
  const title = BACKPORT_TITLE.exec(pr.title || "");
  if (!BACKPORT_BRANCHES.includes(release) || !title) {
    core.info(`#${pr.number}: not an enabled backport PR`);
    return false;
  }
  if (pr.state !== "open") {
    core.info(`#${pr.number}: backport is ${pr.state}, not linking`);
    return false;
  }
  if (!isTrustedBackport(pr, owner, repo)) {
    core.info(
      `#${pr.number}: author association ${pr.author_association} is not trusted`,
    );
    return false;
  }
  const number = Number(title[1]);
  const { data: source } = await github.rest.pulls.get({
    owner,
    repo,
    pull_number: number,
  });
  if (!source.merged_at || source.base.ref !== "main") {
    core.info(`#${number}: not merged into main, not linking`);
    return false;
  }
  return linkEntry({
    github,
    core,
    owner,
    repo,
    number,
    release,
    url: pr.html_url,
  });
}

function backportBranchName(number, release) {
  return `backport/${number}-${release.replaceAll("/", "-")}`;
}

async function branchExists(github, owner, repo, branch) {
  try {
    await github.rest.repos.getBranch({ owner, repo, branch });
    return true;
  } catch (error) {
    if (error.status === 404) {
      return false;
    }
    throw error;
  }
}

async function findExistingBackport(github, owner, repo, number, release) {
  const items = await github.paginate(
    github.rest.search.issuesAndPullRequests,
    {
      q: `repo:${owner}/${repo} is:pr base:${release} in:title "(backport of #${number})"`,
      per_page: 100,
    },
  );
  for (const item of items) {
    if (
      !isBackportTitle(item.title, number) ||
      (item.state !== "open" && !item.pull_request?.merged_at)
    ) {
      continue;
    }
    const { data: pr } = await github.rest.pulls.get({
      owner,
      repo,
      pull_number: item.number,
    });
    if (
      pr.base.ref === release &&
      isBackportTitle(pr.title, number) &&
      (pr.state === "open" || pr.merged_at) &&
      isTrustedBackport(pr, owner, repo)
    ) {
      return pr.html_url;
    }
  }
  return null;
}

async function failedReleases(github, owner, repo, number) {
  const comments = await github.paginate(github.rest.issues.listComments, {
    owner,
    repo,
    issue_number: number,
    per_page: 100,
  });
  const failed = new Set();
  for (const comment of comments) {
    if (
      !TRUSTED_ASSOCIATIONS.has(comment.author_association) &&
      comment.user?.type !== "Bot"
    ) {
      continue;
    }
    const text = comment.body || "";
    const firstLine = stripHtmlComments(text)
      .split(/\r?\n/)
      .find((line) => line.trim());
    const headline = FAILURE_HEADLINE.exec(firstLine || "");
    if (headline) {
      failed.add(headline[1]);
    }
  }
  return failed;
}

async function candidatePullRequests({ github, context, core }) {
  const { owner, repo } = context.repo;
  if (context.eventName === "workflow_dispatch") {
    const input = context.payload.inputs?.pr_number;
    const number = Number(input);
    if (!/^[1-9]\d*$/.test(input || "") || !Number.isSafeInteger(number)) {
      core.setFailed(
        "workflow_dispatch needs a positive numeric pr_number input",
      );
      return [];
    }
    const { data } = await github.rest.pulls.get({
      owner,
      repo,
      pull_number: number,
    });
    return [data];
  }
  if (context.eventName === "push") {
    // The merge queue can land several PRs in one push.
    const shas = new Set([
      ...(context.payload.commits || []).map((commit) => commit.id),
      context.sha,
    ]);
    const pulls = new Map();
    for (const sha of shas) {
      const { data } =
        await github.rest.repos.listPullRequestsAssociatedWithCommit({
          owner,
          repo,
          commit_sha: sha,
        });
      for (const pr of data) {
        if (pr.merge_commit_sha === sha) {
          pulls.set(pr.number, pr);
        }
      }
    }
    return [...pulls.values()];
  }
  const since = new Date(Date.now() - SWEEP_DAYS * 86400000)
    .toISOString()
    .slice(0, 10);
  const items = await github.paginate(
    github.rest.search.issuesAndPullRequests,
    {
      q: `repo:${owner}/${repo} is:pr is:merged base:main merged:>=${since}`,
      per_page: 100,
    },
  );
  const pulls = [];
  for (const item of items) {
    if (parseBackportReleases(item.body).length) {
      const { data } = await github.rest.pulls.get({
        owner,
        repo,
        pull_number: item.number,
      });
      pulls.push(data);
    }
  }
  return pulls;
}

async function findBackports({ github, context, core }) {
  const todo = [];
  const linkOnly = [];
  const errors = [];
  for (const pr of await candidatePullRequests({ github, context, core })) {
    // One PR's API error must not drop other PRs' links or todo items.
    try {
      await discoverPullRequest({ github, context, core, pr, todo, linkOnly });
    } catch (error) {
      errors.push(`#${pr.number}: ${error.message}`);
      core.error(`#${pr.number}: discovery failed: ${error.message}`);
    }
  }
  core.info(`todo: ${JSON.stringify(todo)}`);
  core.info(`link_only: ${JSON.stringify(linkOnly)}`);
  core.setOutput("todo", JSON.stringify(todo));
  core.setOutput("has_todo", todo.length ? "true" : "false");
  if (errors.length) {
    core.setFailed(`Backporter discovery failed for ${errors.join("; ")}`);
  }
  return { todo, linkOnly };
}

async function discoverPullRequest({
  github,
  context,
  core,
  pr,
  todo,
  linkOnly,
}) {
  const { owner, repo } = context.repo;
  if (!pr.merged_at || pr.base.ref !== "main") {
    core.info(`#${pr.number}: not merged into main, skipping`);
    return;
  }
  const releases = parseBackportReleases(pr.body);
  if (!releases.length) {
    return;
  }
  const failed =
    context.eventName === "workflow_dispatch"
      ? new Set()
      : await failedReleases(github, owner, repo, pr.number);
  for (const release of releases) {
    if (failed.has(release)) {
      core.info(
        `#${pr.number} -> ${release}: failed before; dispatch to retry`,
      );
      continue;
    }
    const enabled = BACKPORT_BRANCHES.includes(release);
    if (!enabled || !(await branchExists(github, owner, repo, release))) {
      const reason = enabled
        ? `Branch \`${release}\` does not exist in ${owner}/${repo}.`
        : `Branch \`${release}\` is not enabled for backports.`;
      await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: pr.number,
        body: [
          `Backport to \`${release}\` failed`,
          "",
          reason,
          "Fix or remove the source checklist entry. Automatic runs now skip",
          `this target; after fixing it, run the Backporter workflow with pr_number ${pr.number}.`,
          "",
          "Conflicting files: none.",
          "",
          `${context.serverUrl}/${owner}/${repo}/actions/runs/${context.runId}`,
        ].join("\n"),
      });
      core.info(`#${pr.number} -> ${release}: reported invalid target`);
      continue;
    }
    const existing = await findExistingBackport(
      github,
      owner,
      repo,
      pr.number,
      release,
    );
    if (existing) {
      await linkEntry({
        github,
        core,
        owner,
        repo,
        number: pr.number,
        release,
        url: existing,
      });
      linkOnly.push({ number: pr.number, release, backport_url: existing });
      continue;
    }
    const jira = JIRA_URL.exec(pr.body || "");
    todo.push({
      number: pr.number,
      release,
      backport_branch: backportBranchName(pr.number, release),
      title: pr.title,
      url: pr.html_url,
      merge_commit_sha: pr.merge_commit_sha,
      author: pr.user?.login || "",
      jira_url: jira ? jira[0] : "",
    });
  }
}

class BackportFailure extends Error {
  constructor(message, files = []) {
    super(message);
    this.files = files;
  }
}

async function applyBackports({ github, context, core, exec, todo }) {
  const { owner, repo } = context.repo;
  const results = [];
  const unexpectedErrors = [];
  const git = async (args, allowFailure = false) => {
    const output = await exec.getExecOutput("git", args, {
      ignoreReturnCode: true,
      silent: true,
    });
    if (output.exitCode !== 0 && !allowFailure) {
      throw new Error(
        `git ${args[0]} failed: ${output.stderr.trim() || output.stdout.trim() || `exit ${output.exitCode}`}`,
      );
    }
    return output;
  };
  const pickInProgress = async () => {
    const state = await git(
      ["rev-parse", "-q", "--verify", "CHERRY_PICK_HEAD"],
      true,
    );
    if (state.exitCode !== 0 && state.exitCode !== 1) {
      throw new Error(`Cannot inspect cherry-pick state: ${state.stderr}`);
    }
    return state.exitCode === 0;
  };
  await exec.exec("git", ["config", "user.name", "github-actions[bot]"]);
  await exec.exec("git", [
    "config",
    "user.email",
    "41898282+github-actions[bot]@users.noreply.github.com",
  ]);

  for (const item of todo) {
    const {
      number,
      release,
      backport_branch,
      merge_commit_sha,
      title,
      jira_url,
    } = item;
    let createdBranch = false;
    let emptyChangeset = false;
    let createdChangeset = null;
    let stagedChangeset = false;
    let pushed = false;
    try {
      await git(["fetch", "origin", release]);
      const remote = await git(
        ["ls-remote", "--exit-code", "--heads", "origin", backport_branch],
        true,
      );
      if (remote.exitCode === 0) {
        throw new BackportFailure("branch already exists");
      }
      if (remote.exitCode !== 2) {
        throw new Error(`Remote branch check failed: ${remote.stderr}`);
      }
      await git(["switch", "-c", backport_branch, `origin/${release}`]);
      createdBranch = true;
      const parents = await git([
        "rev-list",
        "--parents",
        "-n",
        "1",
        merge_commit_sha,
      ]);
      const parentCount = parents.stdout.trim().split(/\s+/).length - 1;
      const pick = await git(
        [
          "cherry-pick",
          "-x",
          ...(parentCount === 2 ? ["-m", "1"] : []),
          merge_commit_sha,
        ],
        true,
      );
      if (pick.exitCode !== 0) {
        const conflicted = await git([
          "diff",
          "--name-only",
          "--diff-filter=U",
        ]);
        const files = conflicted.stdout.split(/\r?\n/).filter(Boolean);
        if (files.length) {
          throw new BackportFailure("conflicts", files);
        }
        if (await pickInProgress()) {
          const staged = await git(["diff", "--cached", "--quiet"], true);
          if (staged.exitCode === 0) {
            throw new BackportFailure(
              `change already present on \`${release}\``,
            );
          }
          if (staged.exitCode !== 1) {
            throw new Error(`Cannot inspect staged changes: ${staged.stderr}`);
          }
        }
        throw new Error(
          `Cherry-pick failed: ${pick.stderr.trim() || pick.stdout.trim()}`,
        );
      }
      const added = await git([
        "diff",
        "--name-only",
        "--diff-filter=A",
        `origin/${release}...HEAD`,
        "--",
        ".changeset/*.md",
      ]);
      if (
        !added.stdout
          .split(/\r?\n/)
          .some((file) => file && file !== ".changeset/README.md")
      ) {
        const changeset = path.join(".changeset", `backport-${number}.md`);
        try {
          fs.writeFileSync(changeset, "---\n---\n", { flag: "wx" });
          createdChangeset = changeset;
        } catch (error) {
          if (error.code === "EEXIST") {
            throw new BackportFailure(`changeset ${changeset} already exists`);
          }
          throw error;
        }
        await git(["add", changeset]);
        stagedChangeset = true;
        await git([
          "commit",
          "-m",
          `chore: add empty changeset for backport of #${number}`,
        ]);
        emptyChangeset = true;
      }
      await git(["push", "origin", backport_branch]);
      pushed = true;
      const { data: pr } = await github.rest.pulls.create({
        owner,
        repo,
        base: release,
        head: backport_branch,
        title: `${title} (backport of #${number})`,
        body: [
          jira_url,
          `Backport of ${owner}/${repo}#${number} to \`${release}\`. Clean cherry-pick with \`git cherry-pick -x ${merge_commit_sha}\`; no differences from the source.`,
          emptyChangeset
            ? "An empty changeset was added to satisfy the Changeset check."
            : "",
          "See the source PR for testing instructions.",
        ]
          .filter(Boolean)
          .join("\n\n"),
      });
      // The PR exists now, so metadata errors must not report the backport as failed.
      for (const [what, request] of [
        [
          "labels",
          () =>
            github.rest.issues.addLabels({
              owner,
              repo,
              issue_number: pr.number,
              labels: ["backport", "automation"],
            }),
        ],
        [
          "reviewers",
          () =>
            github.rest.pulls.requestReviewers({
              owner,
              repo,
              pull_number: pr.number,
              team_reviewers: ["landscape-ui"],
            }),
        ],
      ]) {
        try {
          await request();
        } catch (error) {
          core.warning(
            `#${number} -> ${release}: could not add ${what} to ${pr.html_url}: ${error.message}`,
          );
        }
      }
      results.push({
        number,
        release,
        status: "success",
        url: pr.html_url,
        empty_changeset: emptyChangeset,
      });
      core.info(`#${number} -> ${release}: opened ${pr.html_url}`);
    } catch (error) {
      const files = error instanceof BackportFailure ? error.files : [];
      if (!(error instanceof BackportFailure)) {
        unexpectedErrors.push(error.message);
        core.error(`#${number} -> ${release}: ${error.message}`);
      }
      results.push({
        number,
        release,
        status: "failed",
        reason: error.message,
        conflicting_files: files,
      });
      // ls-remote proved this run created the branch, so a retry needs it gone.
      let orphaned = false;
      if (pushed) {
        const deleted = await git(
          ["push", "origin", "--delete", backport_branch],
          true,
        );
        orphaned = deleted.exitCode !== 0;
        if (orphaned) {
          unexpectedErrors.push(
            `could not delete ${backport_branch}: ${deleted.stderr.trim()}`,
          );
        }
      }
      try {
        await github.rest.issues.createComment({
          owner,
          repo,
          issue_number: number,
          body: [
            `Backport to \`${release}\` failed`,
            "",
            error.message,
            ...(orphaned
              ? [
                  "",
                  `Branch \`${backport_branch}\` was pushed; delete it before retrying.`,
                ]
              : []),
            "",
            `Conflicting files: ${files.length ? files.join(", ") : "none"}`,
            "",
            `${context.serverUrl}/${owner}/${repo}/actions/runs/${context.runId}`,
          ].join("\n"),
        });
      } catch (commentError) {
        unexpectedErrors.push(commentError.message);
        core.error(
          `#${number} -> ${release}: failure comment failed: ${commentError.message}`,
        );
      }
      try {
        if (await pickInProgress()) {
          await git(["cherry-pick", "--abort"]);
        }
        if (createdChangeset && !emptyChangeset) {
          if (stagedChangeset) {
            await git(["restore", "--staged", "--", createdChangeset]);
          }
          fs.unlinkSync(createdChangeset);
        }
        await git(["switch", "--detach", `origin/${release}`]);
        if (createdBranch) {
          await git(["branch", "-D", backport_branch]);
        }
      } catch (cleanupError) {
        unexpectedErrors.push(cleanupError.message);
        core.error(
          `#${number} -> ${release}: cleanup failed: ${cleanupError.message}`,
        );
        break;
      }
    }
  }
  if (unexpectedErrors.length) {
    core.setFailed(
      `Backporter encountered unexpected errors: ${unexpectedErrors.join("; ")}`,
    );
  }
  return results;
}

module.exports = {
  BACKPORT_BRANCHES,
  applyBackports,
  backportBranchName,
  failedReleases,
  findBackports,
  isBackportTitle,
  isTrustedBackport,
  linkBackportEntry,
  linkEntry,
  linkOpenedBackport,
  parseBackportReleases,
};
