"""Local beta release rehearsal: python3 scripts/test-beta-release.py."""

import os
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


def stanza(version):
    return (
        f"landscape-dashboard ({version}) jammy; urgency=medium\n\n"
        "  * Release test.\n\n"
        " -- Landscape Team <landscape-team@canonical.com>  Fri, 20 Nov 2026 10:00:00 +0000\n\n"
    )


class VersionsAndHistory(unittest.TestCase):
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
        self.commit("push with an already-tagged version")
        self.assertEqual(route(), {"decision": "skip", "version": version})
        self.assertEqual(self.git("tag", "--list"), version)
        self.assertEqual(self.git("rev-parse", version + "^{commit}"), built)
        rehearsal = route("17", "--rehearsal")
        self.assertEqual(rehearsal["ppa"], "landscape/self-hosted-daily")
        self.assertEqual(rehearsal["deb-version"], "0~rehearsal.17-0landscape0")
        self.assertEqual(rehearsal["sha"], self.git("rev-parse", "HEAD"))
        self.assertEqual(route("17", "--rehearsal"), rehearsal)


class LaunchpadRehearsal(unittest.TestCase):
    def setUp(self):
        self.publication = Publication("landscape/self-hosted-daily", "0~rehearsal.17-0landscape0", MARKER)

    def test_daily_copy_uses_same_archive_and_skips_pending_or_verified_destinations(self):
        archive = Mock()
        person = Mock()
        person.getPPAByName.return_value = archive
        login = Mock()
        login.login_with.return_value.people = {"landscape": person}
        modules = {"launchpadlib.launchpad": Mock(Launchpad=login)}
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
