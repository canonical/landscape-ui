#!/usr/bin/env python3
"""Upload, verify and, on a confirmed cross-series rejection, copy a beta."""

import argparse
from contextlib import contextmanager
from email import policy
from email.parser import BytesParser
import imaplib
import json
import os
from pathlib import Path
import re
import secrets
import ssl
import subprocess
import tempfile
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


API = "https://api.launchpad.net/devel"
PPA = "landscape/self-hosted-beta"
ARCHIVE = f"{API}/~landscape/+archive/ubuntu/self-hosted-beta"
ARCHIVE_REFERENCE = "~landscape/ubuntu/self-hosted-beta"
PACKAGE = "landscape-dashboard"
SERIES = ("jammy", "noble", "resolute")  # Keep aligned with landscape-server.
OLDEST = SERIES[0]


def collection(url, **params):
    url = f"{url}?{urlencode(params)}"
    while url:
        with fresh(url) as response:
            page = json.load(response)
        yield from page["entries"]
        url = page.get("next_collection_link")


def fresh(url):
    return urlopen(Request(url, headers={"Cache-Control": "no-cache"}), timeout=30)


def sources(series, version, status):
    return collection(
        ARCHIVE, **{"ws.op": "getPublishedSources"}, source_name=PACKAGE,
        version=version, exact_match="true", distro_series=f"{API}/ubuntu/{series}",
        pocket="Release", status=status,
    )


def accepted(series, version, marker):
    for upload in collection(
        f"{API}/ubuntu/{series}", **{"ws.op": "getPackageUploads"}, archive=ARCHIVE,
        pocket="Release", name=PACKAGE, version=version, exact_match="true",
    ):
        if (upload["status"] not in ("Accepted", "Done") or not upload["contains_source"]
                or upload["package_version"] != version):
            continue
        with fresh(upload["changes_file_url"]) as response:
            changes = response.read().decode("utf-8")
        if f"   * {marker}\n" not in changes:
            raise RuntimeError(f"{series} already accepted {version} from a different run")
        return True
    return False


def preflight(version, marker):
    # Never rebuild an accepted version, even on a full rerun. Superseded or
    # removed versions still have upload records.
    for series in SERIES:
        if accepted(series, version, f"{marker}:{series}"):
            raise RuntimeError(f"{series} already accepted {version}; re-run only failed jobs")
        for status in ("Pending", "Published", "Superseded", "Deleted", "Obsolete"):
            if any(source["source_package_version"] == version for source in sources(series, version, status)):
                raise RuntimeError(f"{series} already has {version}; recover the original run or use a respin")


def rejection_subjects(version, series):
    filename = f"{PACKAGE}_{version}_source.changes"
    return (
        f"[{ARCHIVE_REFERENCE}] {filename} (Rejected)",
        f"[{ARCHIVE_REFERENCE}/{series}] {PACKAGE} {version} (Rejected)",
    )


def rejection_reason(message, attempt_marker, version, series):
    if (str(message["X-Launchpad-Archive"]) != ARCHIVE_REFERENCE
            or str(message["X-Katie"]) != "Launchpad actually"
            or str(message["Subject"]) not in rejection_subjects(version, series)):
        return None
    body = message.get_body(preferencelist=("plain",))
    if body is None:
        return None
    text = body.get_content()
    if not re.search(rf"^\s*\* {re.escape(attempt_marker)}\s*$", text, re.M):
        return None
    # Parse only the summary, never changelog text quoted below it. Use the
    # queue.py rejection for an already accepted exact source/version.
    summary = text.lstrip().removeprefix("Rejected:\n").lstrip().split("\n\n", 1)[0]
    for existing in SERIES:
        expected = (
            f"The source {PACKAGE} - {version} is already accepted in ubuntu/{existing} and you "
            "cannot upload the same version within the same distribution. "
            "You have to modify the source version and re-upload."
        )
        if existing != series and " ".join(summary.split()) == expected:
            return "copy"
    return "rejected"


@contextmanager
def rejection_mailbox():
    with imaplib.IMAP4_SSL(os.environ["LAUNCHPAD_IMAP_HOST"], timeout=30,
                          ssl_context=ssl.create_default_context()) as mailbox:
        mailbox.login(os.environ["LAUNCHPAD_IMAP_USER"], os.environ["LAUNCHPAD_IMAP_PASSWORD"])
        status, _ = mailbox.select(readonly=True)
        if status != "OK":
            raise RuntimeError("Cannot select Launchpad rejection inbox")
        yield mailbox


def check_mail(mailbox, attempt, version, series, first_uid):
    # Match the attempt only after MIME decoding. Quoted-printable can wrap
    # the marker across physical lines, so a literal IMAP BODY search can miss it.
    early, named = rejection_subjects(version, series)
    status, messages = mailbox.uid("search", None, "UID", f"{first_uid}:*", "OR",
                                   "SUBJECT", f'"{early}"', "SUBJECT", f'"{named}"')
    if status != "OK":
        raise RuntimeError("Cannot search Launchpad rejection inbox")
    for uid in reversed(messages[0].split()):
        if int(uid) < first_uid:
            continue  # IMAP's * can be smaller than the requested first UID.
        status, parts = mailbox.uid("fetch", uid, "(BODY.PEEK[])")
        if status != "OK":
            raise RuntimeError("Cannot fetch Launchpad rejection notification")
        for part in parts:
            if isinstance(part, tuple):
                result = rejection_reason(BytesParser(policy=policy.default).parsebytes(part[1]), attempt, version, series)
                if result:
                    return result
    return None


def wait_for(check, seconds, description):
    deadline = time.monotonic() + seconds
    while True:
        try:
            result = check()
            if result:
                return result
        except HTTPError as error:
            if error.code not in (408, 429, 500, 502, 503, 504):
                raise
            print(f"Launchpad returned HTTP {error.code}; retrying {description}")
        except (URLError, TimeoutError):
            print(f"Launchpad read failed; retrying {description}")
        if time.monotonic() >= deadline:
            raise RuntimeError(f"Timed out waiting for {description}")
        time.sleep(20)


def sign_and_upload(path, attempt):
    with tempfile.TemporaryDirectory() as keyring:
        env = dict(os.environ, GNUPGHOME=keyring)
        subprocess.run(["gpg", "--batch", "--import"], check=True, env=env,
                       input=os.environ["GPG_PRIVATE_KEY"], text=True)
        keys = subprocess.check_output(
            ["gpg", "--batch", "--list-secret-keys", "--with-colons"], env=env, text=True,
        )
        key, = re.findall(r"^sec:[^\n]*\nfpr:::::::::([A-F0-9]+):", keys, re.M)
        changes = path.read_text().replace("Changes:\n", f"Changes:\n   * {attempt}\n", 1)
        path.write_text(changes)
        subprocess.run(["debsign", "-k" + key, path.name], cwd=path.parent, env=env, check=True)
        # A nonzero dput result can occur after Launchpad receives the files.
        result = subprocess.run(["dput", "ppa:" + PPA, path.name], cwd=path.parent, env=env)
        if result.returncode:
            print(f"dput exited {result.returncode}; checking Launchpad for source acceptance")


def upload(series, version, marker, directory):
    series_marker = f"{marker}:{series}"
    if accepted(series, version, series_marker):
        return "accepted"
    # A release owner may have copied the exact Jammy build since the last
    # attempt. Confirm Jammy belongs to this run before resuming after a copy.
    if series != OLDEST and any(
        source["source_package_version"] == version
        for status in ("Pending", "Published")
        for source in sources(series, version, status)
    ):
        if accepted(OLDEST, version, f"{marker}:{OLDEST}"):
            wait_for(lambda: binary_published(series, version), 600, f"{series} copied binary")
            return "accepted"
        raise RuntimeError(f"{series} already has {version} without this run's Jammy source")
    attempt = f"{series_marker}:attempt-{secrets.token_hex(16)}"
    path = directory / series / f"{PACKAGE}_{version}_source.changes"
    if series == OLDEST or os.environ.get("LAUNCHPAD_VERIFY_REJECTION_EMAIL") != "true":
        sign_and_upload(path, attempt)
        description = f"{series} source acceptance"
        if series != OLDEST:
            description += "; inspect the Launchpad rejection before manually copying Jammy and rerunning failed jobs"
        wait_for(lambda: accepted(series, version, series_marker), 600, description)
        return "accepted"

    with rejection_mailbox() as mailbox:
        _, values = mailbox.response("UIDNEXT")
        if not values or values[0] is None:
            raise RuntimeError("Launchpad rejection inbox did not return UIDNEXT")
        first_uid = int(values[0])
        sign_and_upload(path, attempt)

        def result():
            if accepted(series, version, series_marker):
                return "accepted"
            rejected = check_mail(mailbox, attempt, version, series, first_uid)
            if rejected == "rejected":
                raise RuntimeError(f"Launchpad rejected the {series} upload; inspect the signer inbox")
            return rejected

        return wait_for(result, 600, f"{series} source acceptance or rejection")


def binary_published(series, version):
    for source in sources(series, version, "Published"):
        if source["source_package_version"] != version:
            continue
        binaries = collection(source["self_link"], **{"ws.op": "getPublishedBinaries"}, active_binaries_only="true")
        if any(b["status"] == "Published" and b["binary_package_name"] == PACKAGE
               and b["distro_arch_series_link"].startswith(f"{API}/ubuntu/{series}/")
               and b["binary_package_version"] == version for b in binaries):
            return True
        if series == OLDEST:
            for build in collection(source["self_link"], **{"ws.op": "getBuilds"}):
                if build["buildstate"] in ("Failed to build", "Chroot problem", "Failed to upload", "Dependency wait"):
                    raise RuntimeError(f"Jammy build: {build['buildstate']}. See {build['web_link']}")
    return False


def copy_missing(version, targets):
    wait_for(lambda: binary_published(OLDEST, version), 3600, "Jammy binary publication")
    with tempfile.TemporaryDirectory() as cache:
        copy_targets(version, targets, cache)


def copy_targets(version, targets, cache):
    archive = None
    for series in targets:
        if not any(
            source["source_package_version"] == version
            for status in ("Pending", "Published")
            for source in sources(series, version, status)
        ):
            if archive is None:
                from launchpadlib.launchpad import Launchpad

                path = Path(cache) / "credentials"
                path.touch(mode=0o600)
                path.write_text(os.environ["LAUNCHPAD_COPY_CREDENTIALS"])
                lp = Launchpad.login_with("landscape-ui-beta-copy", "production", cache,
                                          credentials_file=str(path), version="devel")
                archive = lp.people["landscape"].getPPAByName(name="self-hosted-beta")
            archive.copyPackage(source_name=PACKAGE, version=version, from_archive=archive,
                                from_series=OLDEST, to_series=series, from_pocket="Release",
                                to_pocket="Release", include_binaries=True)
        wait_for(lambda: binary_published(series, version), 1200, f"{series} binary publication")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("preflight", "upload", "copy"))
    parser.add_argument("version")
    parser.add_argument("series", nargs="*")
    parser.add_argument("--marker")
    parser.add_argument("--directory", type=Path)
    args = parser.parse_args()
    if (args.command == "upload" and (len(args.series) != 1 or args.series[0] not in SERIES)
            or args.command == "copy" and (not args.series or set(args.series) - set(SERIES[1:]))):
        parser.error("Expected supported series (only Noble and Resolute can be copy destinations)")
    if args.command == "preflight":
        preflight(args.version, args.marker)
    elif args.command == "upload":
        result = upload(args.series[0], args.version, args.marker, args.directory)
        with open(os.environ["GITHUB_OUTPUT"], "a") as output:
            print(f"result={result}", file=output)
    else:
        copy_missing(args.version, args.series)


if __name__ == "__main__":
    main()
