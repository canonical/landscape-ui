const SECTION_HEADING = /Releases this PR should be backported to/i;
const ACTIONABLE_ENTRY =
  /^\s*[-*]\s+\[ \]\s+((?:release|point)\/[a-zA-Z0-9][a-zA-Z0-9./-]*)\s*$/;
const BACKPORT_BRANCHES = Object.freeze(["release/26.10", "point/26.04.2"]);
const BACKPORT_TITLE = /\(backport of #(\d+)\)\s*$/;
const TRUSTED_ASSOCIATIONS = new Set(["OWNER", "MEMBER", "COLLABORATOR"]);

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

module.exports = {
  BACKPORT_BRANCHES,
  isBackportTitle,
  isTrustedBackport,
  linkBackportEntry,
  linkEntry,
  linkOpenedBackport,
  parseBackportReleases,
};
