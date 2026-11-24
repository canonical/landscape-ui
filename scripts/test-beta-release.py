"""Local beta release rehearsal: python3 scripts/test-beta-release.py."""

from contextlib import contextmanager
from email.message import EmailMessage
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
GLOBALS = LP["upload"].__globals__
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

        def route(run_id="17"):
            output = self.root / "workflow-output"
            output.write_text("")
            env = dict(os.environ, GITHUB_REF_NAME=f"beta/{BASE}", GITHUB_RUN_ID=run_id, GITHUB_OUTPUT=str(output))
            self.cmd("node", "scripts/beta-release-version.cjs", env=env)
            return dict(line.split("=", 1) for line in output.read_text().splitlines())

        self.assertEqual(route(), {"decision": "prepare"})
        version = BASE + ".2"
        deb = "27.04~beta.3.2-0landscape0"
        self.stamp(version, deb)
        self.commit("respin after earlier runs failed")
        built = self.git("rev-parse", "HEAD")
        publication = dict(decision="publish", version=version, sha=built, marker=f"Landscape-UI-Beta:17:{built}")
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


class LaunchpadRehearsal(unittest.TestCase):
    def rejection(self, attempt, reason):
        message = EmailMessage()
        message["X-Launchpad-Archive"] = "~landscape/ubuntu/self-hosted-beta"
        message["X-Katie"] = "Launchpad actually"
        message["Subject"] = f"[~landscape/ubuntu/self-hosted-beta] landscape-dashboard_{DEBIAN}_source.changes (Rejected)"
        message.set_content(f"Rejected:\n{reason}\n\nlandscape-dashboard ({DEBIAN}) noble; urgency=medium\n\n  * {attempt}\n")
        return message

    def test_direct_and_fallback_publication(self):
        for fallback in (False, True):
            with self.subTest(fallback=fallback):
                self.rehearse_publication(fallback)

    def rehearse_publication(self, fallback):
        accepted = {}
        published = {}
        events = []
        messages = {}

        def source_upload(path, attempt):
            series = path.parent.name
            if series != "jammy":
                self.assertEqual(accepted.get("jammy"), DEBIAN)
            events.append(f"upload {series}")
            self.assertEqual(path.name, f"landscape-dashboard_{DEBIAN}_source.changes")
            if fallback and series == "noble":
                reason = (f"The source landscape-dashboard - {DEBIAN} is already accepted in ubuntu/jammy and you "
                          "cannot upload the same version within the same distribution. You have to modify the source version and re-upload.")
                messages[attempt] = self.rejection(attempt, reason)
            else:
                accepted[series] = DEBIAN
                if series != "jammy":
                    published[series] = DEBIAN

        @contextmanager
        def mailbox():
            yield Mock(response=Mock(return_value=("UIDNEXT", [b"1"])))

        def check_mail(_, attempt, version, series, first_uid):
            message = messages.get(attempt)
            return LP["rejection_reason"](message, attempt, version, series) if message else None

        def is_published(series, version):
            events.append(f"check publication {series}")
            return "jammy-build" if published.get(series) == version else None

        def copy(**kwargs):
            self.assertEqual(published.get(kwargs["from_series"]), kwargs["version"])
            events.append(f"copy {kwargs['to_series']}")
            self.assertTrue(kwargs["include_binaries"])
            self.assertNotIn(kwargs["to_series"], published)
            published[kwargs["to_series"]] = kwargs["version"]

        archive = Mock()
        archive.copyPackage.side_effect = copy
        login = Mock()
        login.login_with.return_value.people = {"landscape": Mock()}
        login.login_with.return_value.people["landscape"].getPPAByName.return_value = archive
        modules = {"launchpadlib.launchpad": Mock(Launchpad=login)}

        def sources(series, version, status):
            return [{"source_package_version": version}] if status == "Published" and published.get(series) == version else []

        def wait(check, _, description):
            result = check()
            if not result and description == "Jammy binary publication":
                published["jammy"] = accepted["jammy"]
                result = check()
            self.assertTrue(result, description)
            return result

        with patch.dict(GLOBALS, {
            "accepted": lambda series, version, _: accepted.get(series) == version,
            "sign_and_upload": source_upload, "rejection_mailbox": mailbox,
            "check_mail": check_mail, "binary_build": is_published,
            "sources": sources, "wait_for": wait,
        }), patch.dict(os.environ, {"LAUNCHPAD_COPY_CREDENTIALS": "test", "LAUNCHPAD_VERIFY_REJECTION_EMAIL": str(fallback).lower()}), patch.dict(sys.modules, modules):
            results = {series: LP["upload"](series, DEBIAN, MARKER, Path("artifacts")) for series in LP["SERIES"]}
            targets = [series for series, result in results.items() if result == "copy"]
            if targets:
                LP["copy_missing"](DEBIAN, [*targets, "resolute"])  # Already published: leave it alone.
                self.assertEqual(events.count("copy noble"), 1)
                self.assertLess(events.index("check publication jammy"), events.index("copy noble"))
                self.assertNotIn("copy resolute", events)
            else:
                published["jammy"] = accepted["jammy"]
                login.login_with.assert_not_called()
            self.assertEqual(published, dict.fromkeys(LP["SERIES"], DEBIAN))

    def test_failures_do_not_trigger_copy(self):
        attempt = f"{MARKER}:noble:attempt-2"
        reason = "Signature verification failed."
        self.assertEqual(LP["rejection_reason"](self.rejection(attempt, reason), attempt, DEBIAN, "noble"), "rejected")
        self.assertIsNone(LP["rejection_reason"](self.rejection(attempt, reason), attempt + "stale", DEBIAN, "noble"))

        @contextmanager
        def mailbox():
            yield Mock(response=Mock(return_value=("UIDNEXT", [b"1"])))

        read_mail = Mock()
        with patch.dict(GLOBALS, {
            "accepted": Mock(return_value=False), "rejection_mailbox": mailbox,
            "sources": Mock(return_value=[]),
            "sign_and_upload": Mock(side_effect=subprocess.CalledProcessError(1, "debsign or dput")),
            "check_mail": read_mail,
        }), patch.dict(os.environ, {"LAUNCHPAD_VERIFY_REJECTION_EMAIL": "true"}):
            with self.assertRaises(subprocess.CalledProcessError):
                LP["upload"]("noble", DEBIAN, MARKER, Path("artifacts"))
        read_mail.assert_not_called()

    def test_retry_resumes_an_accepted_upload_without_signing_again(self):
        sign = Mock()
        with patch.dict(GLOBALS, {"accepted": Mock(return_value=True), "sign_and_upload": sign}):
            self.assertEqual(LP["upload"]("jammy", DEBIAN, MARKER, Path("artifacts")), "accepted")
            GLOBALS["accepted"].assert_called_once_with("jammy", DEBIAN, f"{MARKER}:jammy")
        sign.assert_not_called()

    def test_manual_copy_recovery_checks_jammy_build_identity(self):
        sign = Mock()
        builds = {"jammy": "jammy-build", "noble": "unrelated-build"}
        with patch.dict(GLOBALS, {
            "accepted": lambda series, version, marker: series == "jammy" and marker == f"{MARKER}:jammy",
            "sources": lambda *_: [{"source_package_version": DEBIAN}],
            "sign_and_upload": sign,
            "binary_build": lambda series, version: builds[series],
        }):
            with self.assertRaisesRegex(RuntimeError, "not copied from the verified Jammy build"):
                LP["upload"]("noble", DEBIAN, MARKER, Path("artifacts"))
            builds["noble"] = builds["jammy"]
            self.assertEqual(LP["upload"]("noble", DEBIAN, MARKER, Path("artifacts")), "accepted")
        sign.assert_not_called()

    def test_mime_rejection_is_matched_after_decoding(self):
        attempt = f"Landscape-UI-Beta:12345678901:{'a' * 40}:noble:attempt-2"
        reason = (f"The source landscape-dashboard - {DEBIAN} is already accepted in ubuntu/jammy and you "
                  "cannot upload the same version within the same distribution. You have to modify the source version and re-upload.")
        message = self.rejection(attempt, reason)
        message.set_content(message.get_content(), cte="quoted-printable")
        raw = message.as_bytes()
        self.assertNotIn(attempt.encode(), raw)
        mailbox = Mock()
        mailbox.uid.side_effect = [("OK", [b"1 2"]), ("OK", [(b"2", raw)])]
        self.assertEqual(LP["check_mail"](mailbox, attempt, DEBIAN, "noble", 2), "copy")
        self.assertNotIn(attempt, mailbox.uid.call_args_list[0].args)


if __name__ == "__main__":
    unittest.main()
