import type { Term } from "./types";

export const PACKAGE_FILTER_HELP_DATA: Term[] = [
  {
    term: <code>name_version_arch</code>,
    description: (
      <>
        Direct reference to exactly one package (e.g.{" "}
        <code>libmysqlclient18_5.5.35-rel33.0-611.squeeze_amd64</code>).
      </>
    ),
  },
  {
    term: <code>{"<package>"}</code>,
    description: (
      <>
        Matches the named package at any version/architecture (including
        source), and packages that <code>Provide:</code> it.
      </>
    ),
  },
  {
    term: <code>{"<package> (<op> <version>)"}</code>,
    description: (
      <>
        Dependency condition with version constraint (e.g.{" "}
        <code>mysql-client ({">"}= 3.6)</code>).
      </>
    ),
  },
  {
    term: <code>{"<package> {<arch>}"}</code>,
    description: (
      <>
        Dependency condition limited to an architecture (e.g.{" "}
        <code>mysql-client {"{i386}"}</code>). A package whose own architecture
        is <code>all</code> matches any queried architecture except{" "}
        <code>source</code>.
      </>
    ),
  },
  {
    term: <code>{"<package> (<op> <version>) {<arch>}"}</code>,
    description: "Combined version and architecture condition.",
  },
  {
    term: <code>{"<field> (<op> <value>)"}</code>,
    description: (
      <>
        Match against a package field (e.g. <code>Priority (optional)</code>,{" "}
        <code>Name (~ .*-dev)</code>).
      </>
    ),
  },
  {
    term: <i>Debian control fields</i>,
    description: (
      <>
        All standard control fields are supported <b>except</b>{" "}
        <code>Filename</code>, <code>MD5sum</code>, <code>SHA1</code>,{" "}
        <code>SHA256</code>, <code>Size</code>, <code>Files</code>,{" "}
        <code>Checksums-SHA1</code>, <code>Checksums-SHA256</code>.
      </>
    ),
  },
  {
    term: <code>$Source</code>,
    description: "Name of the source package (for binary packages).",
  },
  {
    term: <code>$SourceVersion</code>,
    description: "Version of the source package.",
  },
  {
    term: <code>$Architecture</code>,
    description: (
      <>
        Architecture for binary packages; <code>source</code> for source
        packages. With <code>=</code>, a package of architecture{" "}
        <code>any</code> matches every architecture except <code>source</code>.
      </>
    ),
  },
  {
    term: <code>$Version</code>,
    description: (
      <>
        Same value as <code>Version</code>, but comparisons use Debian version
        precedence rules.
      </>
    ),
  },
  {
    term: <code>$PackageType</code>,
    description: (
      <>
        <code>deb</code> for binary packages, <code>udeb</code> for{" "}
        <code>.udeb</code> packages, <code>source</code> for source packages.
      </>
    ),
  },
  {
    term: <code>=</code>,
    description: "Strict match. Default operator if none is given.",
  },
  {
    term: (
      <>
        {" "}
        <code>{">="}</code> <code>{"<="}</code> <code>{">>"}</code>{" "}
        <code>{"<<"}</code>
      </>
    ),
    description: (
      <>
        Comparison operators. Lexicographical for most fields; Debian version
        rules for package versions. <code>{">>"}</code> is strictly greater,{" "}
        <code>{"<<"}</code> is strictly less.
      </>
    ),
  },
  {
    term: <code>%</code>,
    description: (
      <>
        Shell-style pattern matching. Supports <code>[^]</code>, <code>?</code>,{" "}
        <code>*</code> (e.g. <code>$Version (% 3.5-*)</code>).
      </>
    ),
  },
  {
    term: <code>~</code>,
    description: (
      <>
        Regular expression matching (e.g. <code>Name (~ .*-dev)</code>).
      </>
    ),
  },
  {
    term: <code>,</code>,
    description: "Logical AND — combines terms; all must match.",
  },
  {
    term: <code>|</code>,
    description: "Logical OR — combines terms; any may match.",
  },
  {
    term: <code>!</code>,
    description: "Logical NOT — negates the following term.",
  },
  {
    term: <code>( ... )</code>,
    description: "Grouping to control operator precedence.",
  },
  {
    term: <code>mysql-client</code>,
    description: (
      <>
        Example: matches <code>mysql-client</code> at any version/architecture
        (including source), plus packages that Provide it.
      </>
    ),
  },
  {
    term: <code>mysql-client ({">"}= 3.6)</code>,
    description: (
      <>
        Example: <code>mysql-client</code> at version ≥ 3.6.
      </>
    ),
  },
  {
    term: <code>mysql-client {"{i386}"}</code>,
    description: (
      <>
        Example: <code>mysql-client</code> on the i386 architecture.
      </>
    ),
  },
  {
    term: <code>$Source (nginx)</code>,
    description: (
      <>
        Example: all binary packages built from source package{" "}
        <code>nginx</code>.
      </>
    ),
  },
  {
    term: <code>!Name (~ .*-dev), mail-transport, $Version ({">="} 3.5)</code>,
    description: (
      <>
        Example: provides <code>mail-transport</code>, name does not end in{" "}
        <code>-dev</code>, version ≥ 3.5.
      </>
    ),
  },
  {
    term: <code>Name</code>,
    description: 'Example: matches every package (i.e. "name is not empty").',
  },
  {
    term: <code>Name (% http-*) | $Source (webserver)</code>,
    description: (
      <>
        Example: name matches <code>http-*</code> OR built from source{" "}
        <code>webserver</code>.
      </>
    ),
  },
];
