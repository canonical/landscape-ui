const SECTION_HEADING = /Releases this PR should be backported to/i;
const ACTIONABLE_ENTRY =
  /^\s*[-*]\s+\[ \]\s+((?:release|point)\/[a-zA-Z0-9][a-zA-Z0-9./-]*)\s*$/;
const BACKPORT_BRANCHES = Object.freeze(["release/26.10", "point/26.04.2"]);
const BACKPORT_TITLE = /\(backport of #(\d+)\)\s*$/;
const TRUSTED_ASSOCIATIONS = new Set(["OWNER", "MEMBER", "COLLABORATOR"]);
const FAILURE_HEADLINE = /^Backport to `([^`\r\n]+)` failed$/;
const WORKFLOW_MARKER = "<!-- gh-aw-workflow-id: backporter -->";
const JIRA_URL =
  /https:\/\/warthogs\.atlassian\.net\/browse\/[A-Z][A-Z0-9]+-\d+/;
const SWEEP_DAYS = 30;

function stripHtmlComments(text) {
  // Preserve line offsets for byte-preserving link-back edits.
  return text.replace(/<!--[\s\S]*?-->/g, (comment) =>
    comment.replace(/[^\n]/g, " "),
  );
}

function actionableEntries(body) {
  const lines = stripHtmlComments(body || "").split("\n");
  const start = lines.findIndex(
    (line) => /^\s*#/.test(line) && SECTION_HEADING.test(line),
  );
  const entries = [];
  if (start === -1) {
    return entries;
  }
  for (let i = start + 1; i < lines.length; i++) {
    if (/^\s*##\s/.test(lines[i])) {
      break;
    }
    const match = ACTIONABLE_ENTRY.exec(lines[i].replace(/\r$/, ""));
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
    // Match gh-aw v0.88.7 generate_footer.cjs matchesWorkflowId, not custom HTML.
    const fromWorkflow =
      !text.includes("<!-- gh-aw-comment-type: reaction -->") &&
      (text.includes(WORKFLOW_MARKER) ||
        (text.includes("<!-- gh-aw-agentic-workflow:") &&
          (text.includes("workflow_id: backporter,") ||
            text.includes("workflow_id: backporter -->"))));
    // gh-aw prepends a blockquote alert when threat detection warns.
    const firstLine = stripHtmlComments(text)
      .split(/\r?\n/)
      .find((line) => line.trim() && !/^\s*>/.test(line));
    const headline = FAILURE_HEADLINE.exec(firstLine || "");
    if (fromWorkflow && headline) {
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
    const { data } =
      await github.rest.repos.listPullRequestsAssociatedWithCommit({
        owner,
        repo,
        commit_sha: context.sha,
      });
    return data.filter((pr) => pr.merge_commit_sha === context.sha);
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
  const { owner, repo } = context.repo;
  const todo = [];
  const linkOnly = [];
  for (const pr of await candidatePullRequests({ github, context, core })) {
    if (!pr.merged_at || pr.base.ref !== "main") {
      core.info(`#${pr.number}: not merged into main, skipping`);
      continue;
    }
    const failed =
      context.eventName === "workflow_dispatch"
        ? new Set()
        : await failedReleases(github, owner, repo, pr.number);
    for (const release of parseBackportReleases(pr.body)) {
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
            "Fix or remove the source checklist entry.",
            "",
            "Conflicting files: none.",
            "",
            `${context.serverUrl}/${owner}/${repo}/actions/runs/${context.runId}`,
            "",
            WORKFLOW_MARKER,
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
  for (const { number, release, backport_url: url } of linkOnly) {
    await linkEntry({ github, core, owner, repo, number, release, url });
  }
  core.info(`todo: ${JSON.stringify(todo)}`);
  core.info(`link_only: ${JSON.stringify(linkOnly)}`);
  core.setOutput("todo", JSON.stringify(todo));
  core.setOutput("has_todo", todo.length ? "true" : "false");
  return { todo, linkOnly };
}

module.exports = {
  BACKPORT_BRANCHES,
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
