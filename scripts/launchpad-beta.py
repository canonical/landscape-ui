#!/usr/bin/env python3
"""Upload a signed Jammy source and verify publication of its binary copies."""

import argparse
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


API = "https://api.launchpad.net/devel"
PPAS = ("landscape/self-hosted-beta", "landscape/self-hosted-daily")
SERIES = ("jammy", "noble", "resolute")  # Keep aligned with landscape-server.
JAMMY, *DESTINATIONS = SERIES


def collection(url, **params):
    url = f"{url}?{urlencode(params)}"
    while url:
        with fresh(url) as response:
            page = json.load(response)
        yield from page["entries"]
        url = page.get("next_collection_link")


def fresh(url):
    return urlopen(Request(url, headers={"Cache-Control": "no-cache"}), timeout=30)


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


class Publication:
    def __init__(self, ppa, version, marker):
        self.ppa = ppa
        self.owner, self.archive_name = ppa.split("/")
        self.archive = f"{API}/~{self.owner}/+archive/ubuntu/{self.archive_name}"
        self.package = "landscape-dashboard-rehearsal" if ppa == PPAS[1] else "landscape-dashboard"
        self.version = version
        self.marker = f"{marker}:{JAMMY}"

    def sources(self, series, status):
        entries = collection(
            self.archive, **{"ws.op": "getPublishedSources"}, source_name=self.package,
            version=self.version, exact_match="true", distro_series=f"{API}/ubuntu/{series}",
            pocket="Release", status=status,
        )
        return (source for source in entries if source["source_package_version"] == self.version)

    def accepted(self):
        for upload in collection(
            f"{API}/ubuntu/{JAMMY}", **{"ws.op": "getPackageUploads"}, archive=self.archive,
            pocket="Release", name=self.package, version=self.version, exact_match="true",
        ):
            if (upload["status"] not in ("Accepted", "Done") or not upload["contains_source"]
                    or upload["package_version"] != self.version):
                continue
            with fresh(upload["changes_file_url"]) as response:
                changes = response.read().decode("utf-8")
            if f"   * {self.marker}" not in changes.splitlines():
                raise RuntimeError(f"{JAMMY} already accepted {self.version} from a different run")
            return True
        return False

    def preflight(self):
        if self.accepted():
            raise RuntimeError(f"{JAMMY} already accepted {self.version}; recover the original artifacts")
        for series in SERIES:
            for status in ("Pending", "Published", "Superseded", "Deleted", "Obsolete"):
                if next(self.sources(series, status), None):
                    raise RuntimeError(f"{series} already has {self.version}; use a new upstream version")

    def upload(self, directory):
        if self.accepted():
            print(f"{JAMMY} already accepted {self.version} from this run; skipping upload")
            return
        self.preflight()
        path = directory / JAMMY / f"{self.package}_{self.version}_source.changes"
        changes = path.read_text().splitlines()
        if ([line for line in changes if line.startswith("Distribution:")] != [f"Distribution: {JAMMY}"]
                or f"Source: {self.package}" not in changes or "Architecture: source" not in changes
                or f"Version: {self.version}" not in changes or f"   * {self.marker}" not in changes):
            raise RuntimeError(f"Unexpected source, series, version, or run marker in {path}")

        with tempfile.TemporaryDirectory() as keyring:
            env = dict(os.environ, GNUPGHOME=keyring)
            private_key = env.pop("GPG_PRIVATE_KEY")
            subprocess.run(["gpg", "--batch", "--import"], check=True, env=env,
                           input=private_key, text=True)
            # Use only the single imported signing identity.
            keys = subprocess.check_output(
                ["gpg", "--batch", "--list-secret-keys", "--with-colons"], env=env, text=True,
            )
            key, = [line.split(":")[4] for line in keys.splitlines() if line.startswith("sec:")]
            subprocess.run(["debsign", "-k" + key, path.name], cwd=path.parent, env=env, check=True)
            result = subprocess.run(["dput", "ppa:" + self.ppa, path.name], cwd=path.parent, env=env)
            print(f"dput exited {result.returncode}; checking Launchpad for source acceptance")
        wait_for(self.accepted, 600, "Jammy source acceptance")

    def binary_build(self, series):
        builds = set()
        for status in ("Published", "Pending"):
            for source in self.sources(series, status):
                if status == "Published":
                    binaries = collection(source["self_link"], **{"ws.op": "getPublishedBinaries"},
                                          active_binaries_only="true")
                    for binary in binaries:
                        if (binary["status"] == "Published" and binary["binary_package_name"] == self.package
                                and binary["distro_arch_series_link"].startswith(f"{API}/ubuntu/{series}/")
                                and binary["binary_package_version"] == self.version):
                            builds.add(binary["build_link"])
                if series == JAMMY and not builds:
                    for build in collection(source["self_link"], **{"ws.op": "getBuilds"}):
                        if build["buildstate"] in ("Failed to build", "Chroot problem", "Failed to upload", "Dependency wait"):
                            raise RuntimeError(f"Jammy build: {build['buildstate']}. See {build['web_link']}")
        if len(builds) > 1 or None in builds:
            raise RuntimeError(f"Ambiguous {series} binary build for {self.version}")
        return next(iter(builds), None)

    def verified_copy(self, series, jammy_build):
        target = self.binary_build(series)
        if not target:
            return False
        if target != jammy_build:
            raise RuntimeError(f"{series} {self.version} was not copied from the verified Jammy build")
        return True

    def copy_missing(self):
        wait_for(self.accepted, 120, "Jammy source acceptance for this run")
        jammy_build = wait_for(lambda: self.binary_build(JAMMY), 10800, "Jammy binary publication")
        with tempfile.TemporaryDirectory() as cache:
            self.copy_targets(jammy_build, cache)

    def copy_targets(self, jammy_build, cache):
        archive = None
        pending = []
        for series in DESTINATIONS:
            if self.verified_copy(series, jammy_build):
                print(f"{series} already published {self.version} from {jammy_build}")
                continue
            pending.append(series)
            if any(next(self.sources(series, status), None) for status in ("Pending", "Published")):
                continue  # An existing publication is verified below, never overwritten.
            credentials = os.environ.get("LAUNCHPAD_COPY_CREDENTIALS")
            if not credentials:
                raise RuntimeError(f"Copy existing binaries for {self.version} from Jammy to missing "
                                   f"series in {self.ppa}, then rerun the original failed jobs")
            if archive is None:
                from launchpadlib.launchpad import Launchpad

                path = Path(cache) / "credentials"
                path.touch(mode=0o600)
                path.write_text(credentials)
                lp = Launchpad.login_with("landscape-ui-beta-copy", "production", cache,
                                          credentials_file=str(path), version="devel")
                archive = lp.people[self.owner].getPPAByName(name=self.archive_name)
            archive.copyPackage(source_name=self.package, version=self.version, from_archive=archive,
                                from_series=JAMMY, to_series=series, from_pocket="Release",
                                to_pocket="Release", include_binaries=True)
        for series in pending:
            wait_for(lambda: self.verified_copy(series, jammy_build), 3600, f"{series} copied Jammy binary publication")
            print(f"{series} published {self.version} from {jammy_build}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("preflight", "upload", "copy"))
    parser.add_argument("version")
    parser.add_argument("--ppa", choices=PPAS, required=True)
    parser.add_argument("--marker", required=True)
    parser.add_argument("--directory", type=Path)
    args = parser.parse_args()
    if args.command == "upload" and args.directory is None:
        parser.error("--directory is required for upload")
    rehearsal = re.fullmatch(r"0~rehearsal\.[1-9][0-9]*-0landscape0", args.version)
    beta = re.fullmatch(r"[0-9]{2}\.(?:04|10)~beta\.[1-9][0-9]*(?:\.[1-9][0-9]*)?-0landscape0", args.version)
    if not (rehearsal if args.ppa == PPAS[1] else beta):
        parser.error("The daily PPA requires a dedicated rehearsal version; the beta PPA forbids it")
    publication = Publication(args.ppa, args.version, args.marker)
    if args.command == "preflight":
        publication.preflight()
    elif args.command == "upload":
        publication.upload(args.directory)
    else:
        publication.copy_missing()


if __name__ == "__main__":
    main()
