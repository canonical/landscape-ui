"""Local beta release rehearsal: python3 scripts/test-beta-release.py."""

import os
from configparser import MissingSectionHeaderError
from pathlib import Path
import runpy
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import Mock, patch


SCRIPTS = Path(__file__).resolve().parent
LP = runpy.run_path(str(SCRIPTS / "launchpad-beta.py"))
Publication = LP["Publication"]
GLOBALS = Publication.upload.__globals__
BASE = "27.04-beta.3"
DEBIAN = "27.04~beta.3-0landscape0"
MARKER = "Landscape-UI-Beta:1:built"


class AuthorizationEngine:
    def __init__(self, service_root, application_name):
        self.application_name = application_name


def stanza(version):
    return (
        f"landscape-dashboard ({version}) jammy; urgency=medium\n\n"
        "  * Release test.\n\n"
        " -- Landscape Team <landscape-team@canonical.com>  Fri, 20 Nov 2026 10:00:00 +0000\n\n"
    )


class BetaRepo(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.root = Path(directory.name)
        for folder in (".changeset", "debian", "scripts"):
            (self.root / folder).mkdir()
        for name in ("calculate-version", "beta-release-version", "beta-version-update", "manual-version-update"):
            shutil.copyfile(SCRIPTS / (name + ".cjs"), self.root / "scripts" / (name + ".cjs"))
        self.write("package.json", '{"version":"26.10.0.0"}\n')
        self.write("CHANGELOG.md", "## 26.10.0.0\n\nOld notes.\n")
        self.write("debian/changelog", stanza("26.10.0.0-0landscape0"))
        self.git("init", "-qb", "main")
        self.git("config", "user.name", "Beta Test")
        self.git("config", "user.email", "test@example.org")

    def cmd(self, *args, **kwargs):
        return subprocess.run(args, cwd=self.root, text=True, capture_output=True, check=True, **kwargs).stdout.strip()

    def git(self, *args):
        return self.cmd("git", *args)

    def write(self, file, text):
        (self.root / file).write_text(text)

    def commit(self, title):
        self.git("add", ".")
        self.git("commit", "-qm", title)

    def version(self, branch):
        return self.cmd("node", "scripts/calculate-version.cjs", env=dict(os.environ, GITHUB_REF_NAME=branch, RELEASED_BRANCHES=""))

    def stamp(self, ui, deb, heading=None):
        self.write("package.json", f'{{"version":"{ui}"}}\n')
        self.write("CHANGELOG.md", f"## {heading or ui}\n\n" + (self.root / "CHANGELOG.md").read_text())
        self.write("debian/changelog", stanza(deb) + (self.root / "debian/changelog").read_text())


class VersionsAndRouting(BetaRepo):
    def test_exact_metadata_and_server_floor(self):
        self.commit("cut")
        self.assertEqual(self.version(f"beta/{BASE}"), "")
        self.assertEqual(self.version("release/27.04"), "27.04.0.0-rc")
        self.assertEqual(self.version("point/27.04.2"), "27.04.2.0-rc")
        for ui, deb in ((BASE, DEBIAN), (BASE + ".1", "27.04~beta.3.1-0landscape0")):
            self.stamp(ui, deb)
            self.assertEqual(self.version(f"beta/{BASE}"), ui)
            self.cmd("dpkg", "--compare-versions", deb, "ge", "27.04~beta.3")
        for ui, deb, heading, error in (
            (BASE, BASE + "-0landscape0", None, "upstream version"),
            (BASE + ".1", DEBIAN, None, "upstream version"),
            (BASE, "27.04~beta.3-0landscape1", None, "revision"),
            ("27.04~beta.3", DEBIAN, None, "dash-form"),
            (BASE, DEBIAN, "27.04~beta.3", "heading"),
        ):
            self.stamp(ui, deb, heading)
            with self.assertRaises(subprocess.CalledProcessError) as failed:
                self.version(f"beta/{BASE}")
            self.assertIn(error, failed.exception.stderr)

    def test_beta_push_routing(self):
        self.commit("cut")
        self.git("remote", "add", "origin", str(self.root))
        self.git("switch", "-qc", f"beta/{BASE}")
        self.write("fix", "A later push before preparation.\n")
        self.commit("fix before prep")

        def route(run_id="17", *args):
            output = self.root / "workflow-output"
            output.write_text("")
            env = dict(os.environ, GITHUB_REF_NAME=f"beta/{BASE}", GITHUB_RUN_ID=run_id, GITHUB_OUTPUT=str(output))
            self.cmd("node", "scripts/beta-release-version.cjs", *args, env=env)
            return dict(line.split("=", 1) for line in output.read_text().splitlines())

        self.assertEqual(route(), {"decision": "prepare"})
        version = BASE + ".2"
        deb = "27.04~beta.3.2-0landscape0"
        self.stamp(version, deb)
        self.write(".changeset/notes.md", '---\n"landscape-ui": patch\n---\n\nPending release notes.\n')
        self.commit("prepared beta with pending release notes")
        with self.assertRaises(subprocess.CalledProcessError) as failed:
            route()
        self.assertIn("pending Changeset(s) with release notes", failed.exception.stderr)
        self.write(".changeset/notes.md", "---\n---\n")
        self.commit("respin after earlier runs failed")
        built = self.git("rev-parse", "HEAD")
        publication = dict(decision="publish", version=version, sha=built, marker=f"Landscape-UI-Beta:17:{built}",
                           ppa="landscape/self-hosted-beta")
        publication["deb-version"] = deb
        self.assertEqual(route(), publication)
        self.assertEqual(route(), publication)
        self.assertNotEqual(route("18")["marker"], publication["marker"])
        self.git("tag", "-am", "First successful release", version, built)
        self.write("fix", "A later push with an already-tagged version.\n")
        self.write(".changeset/notes.md", '---\n"landscape-ui": patch\n---\n\nLater release notes.\n')
        self.commit("push with an already-tagged version")
        self.assertEqual(route(), {"decision": "skip", "version": version})
        self.assertEqual(self.git("tag", "--list"), version)
        self.assertEqual(self.git("rev-parse", version + "^{commit}"), built)
        rehearsal = route("17", "--rehearsal")
        self.assertEqual(rehearsal["ppa"], "landscape/self-hosted-daily")
        self.assertEqual(rehearsal["deb-version"], "0~rehearsal.17-0landscape0")
        self.assertEqual(rehearsal["sha"], self.git("rev-parse", "HEAD"))
        self.assertEqual(route("17", "--rehearsal"), rehearsal)

    def test_asset_publication_fails_if_beta_advances_during_preparation(self):
        workflow = (SCRIPTS.parent / ".github/workflows/beta-release.yml").read_text()
        _, _, step = workflow.partition("      - name: Publish beta assets\n")
        _, _, script = step.partition("        run: |\n")
        script = script.split("\n\n  sbom:", 1)[0]
        self.commit("beta tip")
        built = self.git("rev-parse", "HEAD")
        self.git("branch", f"beta/{BASE}")
        self.git("remote", "add", "origin", str(self.root))
        self.write("fix", "new beta tip")
        self.commit("advance beta")
        current = self.git("rev-parse", "HEAD")
        (self.root / "dist").mkdir()
        self.write("dist/index.html", "dashboard")
        # Move the branch after the first tip check, when the step fetches dist.
        git_hook = f'''
git() {{
  if [[ "$1" == fetch ]]; then
    command git branch -f "beta/{BASE}" "{current}"
  fi
  command git "$@"
}}
'''
        env = dict(os.environ, BUILD_SHA=built, VERSION=BASE,
                   GITHUB_REF=f"refs/heads/beta/{BASE}", GITHUB_REF_NAME=f"beta/{BASE}")
        with self.assertRaises(subprocess.CalledProcessError) as failed:
            self.cmd("bash", "-eo", "pipefail", "-c", git_hook + script, env=env)
        self.assertIn(f"Beta branch tip is {current}, expected {built}", failed.exception.stdout)
        self.assertEqual(self.git("branch", "--list", f"ppa-build-{BASE}"), "")


class ForwardPortHistory(BetaRepo):
    def test_second_respin_is_first_tag(self):
        self.write(".changeset/cut.md", '---\n"landscape-ui": patch\n---\n\nOriginal cut note.\n')
        self.write(".changeset/README.md", "Keep this.\n")
        self.commit("cut")
        self.git("switch", "-qc", f"beta/{BASE}")
        self.cmd("node", "scripts/beta-version-update.cjs", f"beta/{BASE}")
        self.commit("prepare original beta")
        for respin in (1, 2):
            self.write(f"fix-{respin}", f"Fix {respin}\n")
            self.stamp(f"{BASE}.{respin}", f"27.04~beta.3.{respin}-0landscape0")
            self.commit(f"fix and stamp respin {respin}")
        version = self.version(f"beta/{BASE}")
        built = self.git("rev-parse", "HEAD")
        self.git("tag", version, built)
        self.git("switch", "-q", "main")
        self.write(".changeset/later.md", "Later main work.\n")
        self.commit("later main work")
        self.cmd("bash", str(SCRIPTS / "forward-port-beta.sh"), version, built, "main")
        self.assertEqual(self.git("tag", "--list"), BASE + ".2")
        self.assertEqual(self.git("rev-parse", version), built)
        self.assertEqual(self.git("log", "--reverse", "--format=%s", "main..HEAD").splitlines(), [
            "prepare original beta", "fix and stamp respin 1", "fix and stamp respin 2",
        ])
        self.assertEqual(self.git("diff", "--name-status", "main", "--", ".changeset"), "D\t.changeset/cut.md")
        self.assertEqual(self.git("diff", "--exit-code", built, "HEAD", "--", "CHANGELOG.md", "debian/changelog", "package.json", "fix-1", "fix-2"), "")
        self.assertIn("Original cut note.", (self.root / "CHANGELOG.md").read_text())

        self.git("switch", "-q", "main")
        self.git("merge", "--squash", f"beta-forward-port/{version}")
        self.git("commit", "-qm", f"forward-port\n\nLandscape-Beta-Source: {built}")
        self.git("switch", "-q", f"beta/{BASE}")
        self.stamp(f"{BASE}.3", "27.04~beta.3.3-0landscape0")
        self.commit("respin after squash")
        self.git("tag", f"{BASE}.3")
        self.cmd("bash", str(SCRIPTS / "forward-port-beta.sh"), f"{BASE}.3", self.git("rev-parse", "HEAD"), "main")
        self.assertEqual(self.git("log", "--format=%s", "main..HEAD"), "respin after squash")

        # A retry for an older tag must not replay over a newer checkpoint.
        older = self.git("rev-parse", f"{BASE}.2~1")
        self.git("tag", f"{BASE}.1", older)
        self.cmd("bash", str(SCRIPTS / "forward-port-beta.sh"), f"{BASE}.1", older, "main")
        self.assertEqual(self.git("rev-parse", "HEAD"), self.git("rev-parse", "main"))

    def test_conflict_leaves_tag_and_reports_manual_checkpoint(self):
        self.commit("cut")
        self.git("switch", "-qc", f"beta/{BASE}")
        self.stamp(BASE, DEBIAN)
        self.commit("prepare beta")
        built = self.git("rev-parse", "HEAD")
        self.git("tag", BASE, built)
        self.git("switch", "-q", "main")
        self.write("package.json", '{"version":"26.10.0.1"}\n')
        self.commit("independent main version edit")
        main = self.git("rev-parse", "main")
        with self.assertRaises(subprocess.CalledProcessError) as failed:
            self.cmd("bash", str(SCRIPTS / "forward-port-beta.sh"), BASE, built, "main")
        self.assertIn(f"Landscape-Beta-Source: {built}", failed.exception.stderr)
        self.assertEqual(self.git("rev-parse", BASE), built)
        self.assertEqual(self.git("rev-parse", "main"), main)

    def test_coauthor_trailer_empty_commit_short_sha_and_out_of_order_checkpoints(self):
        self.commit("cut")
        self.git("switch", "-qc", f"beta/{BASE}")
        self.stamp(BASE, DEBIAN)
        self.commit("prepare beta")
        first = self.git("rev-parse", "HEAD")
        self.git("commit", "--allow-empty", "-qm", "retrigger CI")
        self.write("fix-between", "Fix between\n")
        self.commit("fix before respin 1")
        between = self.git("rev-parse", "HEAD")
        self.stamp(f"{BASE}.1", "27.04~beta.3.1-0landscape0")
        self.commit("respin 1")
        second = self.git("rev-parse", "HEAD")
        self.git("tag", f"{BASE}.1", second)

        # Replay with an originally empty commit on the beta branch.
        self.cmd("bash", str(SCRIPTS / "forward-port-beta.sh"), f"{BASE}.1", second, "main")
        self.assertEqual(
            self.git("log", "--reverse", "--format=%s", "main..HEAD").splitlines(),
            ["prepare beta", "fix before respin 1", "respin 1"],
        )

        # GitHub squash-merge appends a Co-authored-by paragraph after the trailer,
        # and a hand-written recovery PR may record a short SHA.
        self.git("switch", "-q", "main")
        self.git("merge", "--squash", f"beta-forward-port/{BASE}.1")
        short_second = second[:12]
        self.git(
            "commit", "-qm",
            f"forward-port\n\nLandscape-Beta-Source: {short_second}\n\n"
            "---------\n\nCo-authored-by: Dev <dev@example.org>",
        )

        # Simulate an out-of-order merge on main that records an older checkpoint
        # after the newer checkpoint.
        self.git("commit", "--allow-empty", "-qm", f"late merge\n\nLandscape-Beta-Source: {first}")

        # A later respin must still pick the furthest-along checkpoint (second), not first.
        self.git("switch", "-q", f"beta/{BASE}")
        self.stamp(f"{BASE}.2", "27.04~beta.3.2-0landscape0")
        self.commit("respin 2")
        third = self.git("rev-parse", "HEAD")
        self.git("tag", f"{BASE}.2", third)
        self.cmd("bash", str(SCRIPTS / "forward-port-beta.sh"), f"{BASE}.2", third, "main")
        self.assertEqual(self.git("log", "--format=%s", "main..HEAD"), "respin 2")

        # Retrying an older tag strictly between first and second must scan past
        # the late first checkpoint and recognize it is already incorporated via second.
        self.git("tag", BASE, between)
        self.cmd("bash", str(SCRIPTS / "forward-port-beta.sh"), BASE, between, "main")
        self.assertEqual(self.git("rev-parse", "HEAD"), self.git("rev-parse", "main"))


class LaunchpadRehearsal(unittest.TestCase):
    def setUp(self):
        self.publication = Publication("landscape/self-hosted-daily", "0~rehearsal.17-0landscape0", MARKER)

    def test_daily_copy_uses_same_archive_and_skips_pending_or_verified_destinations(self):
        archive = Mock()
        person = Mock()
        person.getPPAByName.return_value = archive
        login = Mock()
        login.login_with.return_value.people = {"landscape": person}
        modules = {
            "launchpadlib.credentials": Mock(RequestTokenAuthorizationEngine=AuthorizationEngine),
            "launchpadlib.launchpad": Mock(Launchpad=login),
            "lazr.restfulclient.errors": Mock(CredentialsFileError=ValueError),
        }
        published = {"jammy": "jammy-build"}

        def copy(**kwargs):
            self.assertEqual(kwargs["version"], self.publication.version)
            self.assertEqual(kwargs["from_series"], "jammy")
            self.assertIs(kwargs["from_archive"], archive)
            self.assertTrue(kwargs["include_binaries"])
            published[kwargs["to_series"]] = "jammy-build"

        def wait(check, _, description):
            if description.startswith("noble copied"):
                published["noble"] = "jammy-build"  # An existing pending copy finishes.
            result = check()
            self.assertTrue(result, description)
            return result

        archive.copyPackage.side_effect = copy
        with patch.object(self.publication, "accepted", return_value=True), \
                patch.object(self.publication, "binary_build", side_effect=published.get), \
                patch.object(self.publication, "sources", side_effect=lambda s, status: iter([{"self_link": "pending"}] if (s, status) == ("noble", "Pending") else [])), \
                patch.dict(GLOBALS, {"wait_for": wait}), patch.dict(sys.modules, modules), \
                patch.dict(os.environ, {"LAUNCHPAD_COPY_CREDENTIALS": "test"}):
            self.publication.copy_missing()
            self.publication.copy_missing()  # A retry recognizes both verified copies.
        person.getPPAByName.assert_called_once_with(name="self-hosted-daily")
        self.assertEqual(archive.copyPackage.call_count, 1)
        self.assertEqual(archive.copyPackage.call_args.kwargs["to_series"], "resolute")

    def test_invalid_copy_credentials_do_not_prompt_for_authorization(self):
        def reauthorize(*args, authorization_engine, **kwargs):
            authorization_engine(None, None)

        login = Mock()
        login.login_with.side_effect = reauthorize
        modules = {
            "launchpadlib.credentials": Mock(RequestTokenAuthorizationEngine=AuthorizationEngine),
            "launchpadlib.launchpad": Mock(Launchpad=login),
            "lazr.restfulclient.errors": Mock(CredentialsFileError=ValueError),
        }
        with tempfile.TemporaryDirectory() as cache, patch.dict(sys.modules, modules):
            with self.assertRaisesRegex(RuntimeError, "renew LAUNCHPAD_COPY_CREDENTIALS"):
                LP["copy_archive"]("landscape", "self-hosted-daily", "invalid", cache)
        login.login_with.assert_called_once()
        login.login_with.side_effect = MissingSectionHeaderError("credentials", 1, "secret contents")
        with tempfile.TemporaryDirectory() as cache, patch.dict(sys.modules, modules):
            with self.assertRaisesRegex(RuntimeError, "renew LAUNCHPAD_COPY_CREDENTIALS") as failed:
                LP["copy_archive"]("landscape", "self-hosted-daily", "invalid", cache)
        self.assertTrue(failed.exception.__suppress_context__)

    def test_terminal_jammy_states_report_the_launchpad_link(self):
        source = {"self_link": "jammy-source"}
        for state in ("Cancelled build", "Build for superseded Source"):
            build = {"buildstate": state, "web_link": "jammy-build"}
            with self.subTest(state=state), \
                    patch.object(self.publication, "sources", side_effect=lambda _, status: iter([source] if status == "Pending" else [])), \
                    patch.dict(GLOBALS, {"collection": Mock(return_value=[build])}), \
                    self.assertRaisesRegex(RuntimeError, f"{state}.*jammy-build"):
                self.publication.binary_build("jammy")
        with patch.object(self.publication, "sources", side_effect=lambda _, status: iter([source] if status == "Superseded" else [])), \
                self.assertRaisesRegex(RuntimeError, "superseded.*jammy-source"):
            self.publication.binary_build("jammy")

    def test_retry_resumes_accepted_upload_without_signing_again(self):
        with patch.object(self.publication, "accepted", return_value=True), \
                patch("subprocess.run") as run:
            self.publication.upload(Path("artifacts"))
        run.assert_not_called()

    def test_copy_does_not_start_before_exact_acceptance(self):
        with patch.object(self.publication, "accepted", side_effect=RuntimeError("different run")), \
                patch.object(self.publication, "copy_targets") as copy:
            with self.assertRaisesRegex(RuntimeError, "different run"):
                self.publication.copy_missing()
        copy.assert_not_called()

    def test_manual_verification_rejects_unrelated_build(self):
        with patch.object(self.publication, "binary_build", return_value="unrelated-build"), \
                self.assertRaisesRegex(RuntimeError, "not copied from the verified Jammy build"):
            self.publication.verified_copy("noble", "jammy-build")

    def test_manual_copy_does_not_require_credentials_once_verified(self):
        published = {"jammy": "jammy-build"}
        with patch.object(self.publication, "binary_build", side_effect=published.get), \
                patch.object(self.publication, "sources", return_value=iter([])), \
                patch.dict(os.environ, {"LAUNCHPAD_COPY_CREDENTIALS": ""}):
            with self.assertRaisesRegex(RuntimeError, "Copy existing binaries"):
                self.publication.copy_targets("jammy-build", "unused-cache")
            published.update(noble="jammy-build", resolute="jammy-build")
            self.publication.copy_targets("jammy-build", "unused-cache")


if __name__ == "__main__":
    unittest.main()
