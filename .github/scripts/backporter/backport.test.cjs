const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const {
  BACKPORT_BRANCHES,
  isBackportTitle,
  isTrustedBackport,
  linkBackportEntry,
  linkOpenedBackport,
  parseBackportReleases,
} = require("./backport.cjs");

const read = (file) => fs.readFileSync(path.join(__dirname, file), "utf8");
const fixture = (name) => read(`fixtures/${name}.md`);
const body = (...entries) =>
  `## Releases this PR should be backported to\r\n\r\n${entries.join("\r\n")}`;
const repo = { owner: "canonical", repo: "landscape-ui" };
const url = "https://github.com/canonical/landscape-ui/pull/20";

test("only bare backport-section entries are actionable", () => {
  assert.deepEqual(parseBackportReleases(fixture("bare")), BACKPORT_BRANCHES);
  assert.deepEqual(parseBackportReleases(fixture("point")), [
    "point/26.10.2",
    "point/26.04.12",
  ]);
  assert.deepEqual(parseBackportReleases(fixture("legacy")), [
    "release/1.19.1",
    "release/1.23.1",
    "point/2026-04-14",
  ]);
  for (const name of ["linked", "ticked", "commented"]) {
    assert.deepEqual(parseBackportReleases(fixture(name)), [], name);
  }
});

test("parsing handles duplicates, boundaries, placeholders and missing bodies", () => {
  assert.deepEqual(
    parseBackportReleases(
      body(
        "- [ ] release/26.10",
        "* [ ] release/26.10",
        "## Other",
        "- [ ] point/26.04.2",
      ),
    ),
    ["release/26.10"],
  );
  for (const input of [null, "", body("- [ ] release/____", "- [ ] main")]) {
    assert.deepEqual(parseBackportReleases(input), []);
  }
});

test("linking changes only the matching line, preserving CRLF and other entries", () => {
  const original = body("- [ ] release/26.10", "- [ ] point/26.04.2");
  const linked = linkBackportEntry(original, "release/26.10", url);
  assert.equal(
    linked,
    original.replace("release/26.10", `release/26.10: ${url}`),
  );
  assert.deepEqual(parseBackportReleases(linked), ["point/26.04.2"]);
  assert.equal(linkBackportEntry(linked, "release/26.10", url), null);
  assert.equal(linkBackportEntry(null, "release/26.10", url), null);
  assert.equal(
    linkBackportEntry(
      "## Releases this PR should be backported to\n- [ ] release/26.10  ",
      "release/26.10",
      url,
    ),
    `## Releases this PR should be backported to\n- [ ] release/26.10: ${url}`,
  );
});

test("title suffixes must identify exactly the source PR", () => {
  assert.equal(isBackportTitle("fix: x (backport of #10)  ", 10), true);
  for (const title of [
    null,
    "x (backport of #100)",
    "x (backport of #10) extra",
  ]) {
    assert.equal(isBackportTitle(title, 10), false);
  }
});

const source = (extra = {}) => ({
  merged_at: "2026-10-28T00:00:00Z",
  base: { ref: "main" },
  body: fixture("bare"),
  ...extra,
});
const opened = (extra = {}) => ({
  number: 20,
  title: "fix: x (backport of #10)",
  html_url: url,
  base: { ref: "release/26.10" },
  head: { repo: { full_name: "contributor/landscape-ui" } },
  author_association: "MEMBER",
  ...extra,
});
function harness(initial = source()) {
  let pr = initial;
  const updates = [];
  const github = {
    rest: {
      pulls: {
        get: async () => ({ data: pr }),
        update: async (params) => {
          updates.push(params);
          pr = { ...pr, body: params.body };
        },
      },
    },
  };
  const logs = [];
  const core = { info: (message) => logs.push(message) };
  const link = (extra) =>
    linkOpenedBackport({
      github,
      core,
      context: { repo, payload: { pull_request: opened(extra) } },
    });
  return { link, updates };
}

test("same-repo heads and trusted fork associations may link", async () => {
  for (const extra of [
    { author_association: "OWNER" },
    { author_association: "COLLABORATOR" },
    { author_association: "MEMBER" },
    {
      author_association: "NONE",
      head: { repo: { full_name: "canonical/landscape-ui" } },
    },
  ]) {
    assert.equal(
      isTrustedBackport(opened(extra), "canonical", "landscape-ui"),
      true,
    );
    const { link, updates } = harness();
    assert.equal(await link(extra), true);
    assert.equal(updates[0].pull_number, 10);
    assert.equal(
      updates[0].body,
      linkBackportEntry(fixture("bare"), "release/26.10", url),
    );
  }
});

test("untrusted forks, malformed titles and non-allowlisted bases cannot link", async () => {
  for (const extra of [
    { author_association: "NONE" },
    { author_association: "CONTRIBUTOR" },
    { author_association: "NONE", head: { repo: null } },
    { title: "x (backport of #10) extra" },
    { title: "x" },
    { base: { ref: "main" } },
    { base: { ref: "release/1.19.1" } },
    { base: { ref: "point/2026-04-14" } },
    { base: { ref: "point/26.10.2" } },
  ]) {
    const { link, updates } = harness();
    assert.equal(await link(extra), false);
    assert.deepEqual(updates, []);
  }
});

test("sources must be merged into main and still have a bare entry", async () => {
  for (const pr of [
    source({ merged_at: null }),
    source({ base: { ref: "release/26.10" } }),
    source({ body: fixture("linked") }),
    source({ body: fixture("ticked") }),
  ]) {
    const { link, updates } = harness(pr);
    assert.equal(await link(), false);
    assert.deepEqual(updates, []);
  }
});

test("serialized sibling links retain both target URLs", async () => {
  const { link, updates } = harness();
  for (const release of BACKPORT_BRANCHES) {
    assert.equal(await link({ base: { ref: release } }), true);
  }
  assert.deepEqual(parseBackportReleases(updates.at(-1).body), []);
  assert.ok(
    BACKPORT_BRANCHES.every((release) =>
      updates.at(-1).body.includes(`${release}: ${url}`),
    ),
  );
});

test("API failures propagate instead of reporting successful linking", async () => {
  const error = new Error("Forbidden");
  await assert.rejects(
    linkOpenedBackport({
      github: {
        rest: {
          pulls: {
            get: async () => {
              throw error;
            },
          },
        },
      },
      context: { repo, payload: { pull_request: opened() } },
      core: { info: (message) => assert.equal(typeof message, "string") },
    }),
    /Forbidden/,
  );
});

test("allowlisted backport targets are CalVer release or point branches", () => {
  for (const branch of BACKPORT_BRANCHES) {
    assert.match(branch, /^(release\/\d{2}\.\d{2}|point\/\d{2}\.\d{2}\.\d+)$/);
  }
});
