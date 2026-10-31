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

module.exports = {
  BACKPORT_BRANCHES,
  isBackportTitle,
  isTrustedBackport,
  linkBackportEntry,
  linkEntry,
  linkOpenedBackport,
  parseBackportReleases,
};
