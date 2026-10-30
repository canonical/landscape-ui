const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const {
  BACKPORT_BRANCHES,
  backportBranchName,
  failedReleases,
  findBackports,
} = require("./backport.cjs");
const read = (file) => fs.readFileSync(path.join(__dirname, file), "utf8");
const standalone = "<!-- gh-aw-workflow-id: backporter -->";
const combined =
  "<!-- gh-aw-agentic-workflow: Backporter, engine: copilot, workflow_id: backporter, run: https://github.com/canonical/landscape-ui/actions/runs/123 -->";
const headline = "Backport to `release/26.10` failed";
const body = (...branches) =>
  `https://warthogs.atlassian.net/browse/LNDENG-5610\n\n## Releases this PR should be backported to\n${branches.map((branch) => `- [ ] ${branch}`).join("\n")}`;
const source = (extra = {}) => ({
  number: 10,
  title: "fix: change 10",
  html_url: "https://github.com/canonical/landscape-ui/pull/10",
  merged_at: "2026-10-28T00:00:00Z",
  merge_commit_sha: "sha10",
  base: { ref: "main" },
  user: { login: "contributor" },
  body: body(...BACKPORT_BRANCHES),
  ...extra,
});
const context = (eventName = "push") => ({
  eventName,
  sha: "sha10",
  repo: { owner: "canonical", repo: "landscape-ui" },
  serverUrl: "https://github.com",
  runId: 123,
  payload: { inputs: { pr_number: "10" } },
});
function harness({
  pr = source(),
  comments = [],
  searchItems = [],
  pulls = {},
  branches = BACKPORT_BRANCHES,
  branchError,
  commentError,
} = {}) {
  const updates = [],
    posted = [],
    queries = [],
    outputs = {};
  const storedPulls = { 10: pr, ...pulls };
  const github = {
    paginate: async (method, params) => {
      const { data } = await method(params);
      return Array.isArray(data) ? data : data.items;
    },
    rest: {
      pulls: {
        get: async ({ pull_number }) => ({ data: storedPulls[pull_number] }),
        update: async (params) => {
          updates.push(params);
          storedPulls[params.pull_number].body = params.body;
        },
      },
      issues: {
        listComments: async () => ({ data: comments }),
        createComment: async (params) => {
          if (commentError) throw commentError;
          posted.push(params);
          comments.push({ body: params.body, user: { type: "Bot" } });
          return { data: { id: posted.length } };
        },
      },
      repos: {
        getBranch: async ({ branch }) => {
          if (branchError) throw branchError;
          if (!branches.includes(branch)) {
            throw Object.assign(new Error("Not Found"), { status: 404 });
          }
          return { data: {} };
        },
        listPullRequestsAssociatedWithCommit: async () => ({ data: [pr] }),
      },
      search: {
        issuesAndPullRequests: async ({ q }) => {
          queries.push(q);
          const base = /base:(\S+)/.exec(q)[1];
          return {
            data: {
              items:
                base === "main"
                  ? [{ number: pr.number, body: pr.body }]
                  : searchItems.filter((item) => item.base === base),
            },
          };
        },
      },
    },
  };
  const core = {
    info: (message) => assert.equal(typeof message, "string"),
    setOutput: (name, value) => {
      outputs[name] = value;
    },
    setFailed: (message) => {
      outputs.failed = message;
    },
  };
  return {
    updates,
    posted,
    queries,
    outputs,
    github,
    core,
    run: (event = context()) => findBackports({ github, core, context: event }),
  };
}

test("todo has only enabled, existing targets with one slash-safe branch mapping", async () => {
  const h = harness();
  const { todo } = await h.run();
  assert.deepEqual(todo[0], {
    number: 10,
    release: "release/26.10",
    backport_branch: "backport/10-release-26.10",
    title: "fix: change 10",
    url: source().html_url,
    merge_commit_sha: "sha10",
    author: "contributor",
    jira_url: "https://warthogs.atlassian.net/browse/LNDENG-5610",
  });
  assert.equal(
    backportBranchName(10, "point/26.04.2"),
    "backport/10-point-26.04.2",
  );
  assert.equal(h.outputs.todo, JSON.stringify(todo));
  assert.equal(h.outputs.has_todo, "true");
  assert.deepEqual(h.posted, []);
});

test("agent comments with either gh-aw marker suppress automatic retries, not dispatch", async () => {
  for (const marker of [
    standalone,
    combined,
    "<!-- gh-aw-agentic-workflow: Backporter, workflow_id: backporter -->",
  ]) {
    for (const author of [
      { author_association: "OWNER" },
      { author_association: "MEMBER" },
      { author_association: "COLLABORATOR" },
      {
        author_association: "NONE",
        user: { login: "custom-app[bot]", type: "Bot" },
      },
    ]) {
      const make = () =>
        harness({
          comments: [
            { body: `\n${headline}\n\nReason.\n${marker}\nFooter.`, ...author },
          ],
        });
      assert.deepEqual(
        (await make().run()).todo.map((item) => item.release),
        ["point/26.04.2"],
      );
      assert.equal(
        (await make().run(context("workflow_dispatch"))).todo.length,
        2,
      );
    }
  }
  const h = harness({
    comments: [
      {
        body: read("fixtures/failure.md"),
        user: { type: "Bot" },
      },
    ],
  });
  assert.deepEqual(
    (await h.run()).todo.map((item) => item.release),
    ["release/26.10"],
  );
});

test("gh-aw threat-detection prefixes do not hide agent failure headlines", async () => {
  for (const prefix of [
    "> [!CAUTION]\n> agentic threat detected\n>\n> <details>\n> <summary>Details</summary>\n> </details>",
    "> [!WARNING]\n> **Threat Detection Engine Failure** — The analysis engine could not complete.",
  ]) {
    const h = harness({
      comments: [
        {
          body: `${prefix}\n\n${headline}\n\nConflicting files: none.\n\n${combined}`,
          user: { type: "Bot" },
        },
      ],
    });
    assert.deepEqual(
      (await h.run()).todo.map((item) => item.release),
      ["point/26.04.2"],
      prefix,
    );
  }
});

test("untrusted non-bot users cannot suppress retries with copied workflow text", async () => {
  const h = harness({
    comments: [
      {
        body: `${headline}\n\n${combined}`,
        author_association: "NONE",
        user: { type: "User", login: "github-actions[bot]" },
      },
    ],
  });
  assert.equal((await h.run()).todo.length, 2);
});

test("headlines must be the first visible non-empty line, never quoted or fenced", async () => {
  for (const text of [
    `> ${headline}`,
    `\`\`\`markdown\n${headline}\n\`\`\``,
    `~~~\n${headline}\n~~~`,
    `Example:\n${headline}`,
    `    ${headline}`,
    `${headline}: additional text`,
  ]) {
    const h = harness({
      comments: [
        {
          body: `${text}\n\n${standalone}`,
          user: { type: "Bot" },
        },
      ],
    });
    assert.equal((await h.run()).todo.length, 2, text);
  }
  const h = harness({
    comments: [
      {
        body: `<!-- hidden -->\n\n${headline}\n\n${combined}`,
        user: { type: "Bot" },
      },
    ],
  });
  assert.equal((await h.run()).todo.length, 1);
});

test("marker matching follows gh-aw v0.88.7, including reaction exclusion", async () => {
  for (const marker of [
    "",
    "<!-- gh-aw-workflow-id: another -->",
    "<!-- gh-aw-agentic-workflow: Backporter, workflow_id: backporter-extra, run: x -->",
    `${standalone}\n<!-- gh-aw-comment-type: reaction -->`,
  ]) {
    const h = harness({
      comments: [
        {
          body: `${headline}\n\n${marker}`,
          author_association: "MEMBER",
        },
      ],
    });
    assert.deepEqual(
      [...(await failedReleases(h.github, "canonical", "landscape-ui", 10))],
      [],
    );
    assert.equal((await h.run()).todo.length, 2);
  }
});

test("invalid targets are commented once by discovery and never enter todo", async () => {
  for (const [branch, refs] of [
    ["release/1.19.1", ["release/1.19.1"]],
    ["release/26.04", ["release/26.04"]],
    ["point/26.10.2", ["point/26.10.2"]],
    ["release/26.10", []],
  ]) {
    const h = harness({ pr: source({ body: body(branch) }), branches: refs });
    assert.deepEqual((await h.run(context("schedule"))).todo, []);
    assert.equal(h.outputs.has_todo, "false");
    assert.equal(h.posted.length, 1);
    assert.equal(h.posted[0].issue_number, 10);
    assert.ok(
      h.posted[0].body.startsWith(`Backport to \`${branch}\` failed\n`),
    );
    assert.ok(h.posted[0].body.includes(standalone));
    assert.match(
      h.posted[0].body,
      /https:\/\/github.com\/canonical\/landscape-ui\/actions\/runs\/123/,
    );
    assert.match(h.posted[0].body, /not enabled|does not exist/);
    await h.run(context("schedule"));
    assert.equal(h.posted.length, 1);
    await h.run(context("workflow_dispatch"));
    assert.equal(h.posted.length, 2);
  }
});

test("invalid-comment and unexpected branch API failures propagate", async () => {
  await assert.rejects(
    harness({
      pr: source({ body: body("release/1.19.1") }),
      commentError: new Error("Cannot comment"),
    }).run(),
    /Cannot comment/,
  );
  await assert.rejects(
    harness({
      branchError: Object.assign(new Error("Forbidden"), { status: 403 }),
    }).run(),
    /Forbidden/,
  );
});

test("discovery links trusted existing backports but rejects untrusted or closed ones", async () => {
  for (const [association, state, expected] of [
    ["MEMBER", "open", 1],
    ["NONE", "open", 0],
    ["MEMBER", "closed", 0],
  ]) {
    const backport = {
      number: 20,
      title: "fix: change 10 (backport of #10)",
      state,
      html_url: "https://github.com/canonical/landscape-ui/pull/20",
      base: { ref: "release/26.10" },
      author_association: association,
      head: { repo: { full_name: "fork/landscape-ui" } },
    };
    const h = harness({
      searchItems: [{ ...backport, base: "release/26.10" }],
      pulls: { 20: backport },
    });
    const result = await h.run();
    assert.equal(result.linkOnly.length, expected);
    assert.equal(h.updates.length, expected);
    assert.equal(result.todo.length, 2 - expected);
  }
});

test("unmerged sources, other bases and unrelated push commits are skipped", async () => {
  for (const extra of [
    { merged_at: null },
    { base: { ref: "release/26.10" } },
    { merge_commit_sha: "other" },
  ]) {
    const h = harness({ pr: source(extra) });
    assert.deepEqual((await h.run()).todo, []);
    assert.deepEqual(h.posted, []);
  }
});

test("scheduled discovery covers 30 days and manual input is validated", async () => {
  const h = harness();
  assert.equal((await h.run(context("schedule"))).todo.length, 2);
  const since = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  assert.equal(
    h.queries[0],
    `repo:canonical/landscape-ui is:pr is:merged base:main merged:>=${since}`,
  );
  for (const value of ["", "abc", "-1", "1.5"]) {
    const event = context("workflow_dispatch");
    event.payload.inputs.pr_number = value;
    const bad = harness();
    assert.deepEqual((await bad.run(event)).todo, []);
    assert.match(bad.outputs.failed, /pr_number/);
  }
});

test("safe outputs match the script allowlist; discovery joins the link writer lock", () => {
  const workflow = read("../../workflows/backporter.md");
  const allowed = JSON.parse(
    /allowed-base-branches:\s*(\[[\s\S]*?\])/
      .exec(workflow)[1]
      .replace(/,\s*\]$/, "]"),
  );
  assert.deepEqual(allowed, BACKPORT_BRANCHES);
  assert.match(
    workflow,
    /group: backporter-source-body\s+cancel-in-progress: false/,
  );
  assert.doesNotMatch(workflow, /BACKPORTER_BOT_LOGIN/);
  assert.match(
    read("../../agents/backporter.agent.md"),
    /Backport to `<release>` failed/,
  );
  assert.doesNotMatch(
    read("../../agents/backporter.agent.md"),
    /invalid_branch|backporter:failed:/,
  );
});
