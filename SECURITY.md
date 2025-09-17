# Security Policy

This document outlines the security policy for the Landscape UI project, reflecting Canonical's broader approach to vulnerability management.

---

- [Supported Versions](#supported-versions)
- [Reporting a Vulnerability](#reporting-a-vulnerability)
- [Our Triage Process](#our-triage-process)
- [Scope and Remediation Policy](#scope-and-remediation-policy)
- [Exceptions to Remediation](#exceptions-to-remediation)
- [Security Announcements](#security-announcements)

---

## Supported Versions

The Landscape UI is an integral component of the main Landscape product. Security updates are provided for all **currently supported versions of Landscape**, aligning with the product's official support lifecycle. Please refer to the Landscape documentation for details on version support.

---

## Reporting a Vulnerability

The best way to report a security vulnerability is to do so privately through **[GitHub's security advisory feature](https://github.com/canonical/landscape-ui/security/advisories/new)**. This ensures the issue is disclosed responsibly and is not made public until a fix is available.

Our team will be notified immediately and will work with you to confirm and address the issue. For more details on the disclosure process, please see the [Ubuntu Security disclosure and embargo policy](https://ubuntu.com/security/disclosure-policy).

---

## Our Triage Process

Once a vulnerability is reported, we will analyze it to understand its impact.

**CVE Requirement:** In line with Canonical's policy, we generally classify a reported issue as a vulnerability if it has been assigned a CVE identifier.

**Analysis and False Positives:** Some reported issues may be determined to be false positives. Common reasons for this include:
* The vulnerability affects a component version that is not used in our product.
* Additional security controls already mitigate the vulnerability's impact.
* The product does not use the specific functionality that is vulnerable.

If we determine a report is a false positive, we will document our reasoning in our response.

---

## Scope and Remediation Policy

We consider vulnerabilities in the `landscape-ui` codebase that could compromise the integrity, availability, or confidentiality of user data. This includes, but is not limited to, XSS, CSRF, and authentication flaws.

At a minimum, our engineering teams are committed to remediating:
* **High and Critical** severity vulnerabilities as defined by the CVSS v3.1 scoring system.
* Any vulnerability, regardless of severity, that is listed in the CISA **Known Exploited Vulnerabilities (KEV)** catalog.

A stronger security posture may include remediating Medium severity vulnerabilities, which will be assessed on a case-by-case basis.

---

## Exceptions to Remediation

In some scenarios, a vulnerability may not be fixed immediately. Valid reasons for deferring a fix include:
* **Upstream Constraints:** A patch is not yet available from an upstream dependency, or the available patch introduces significant regressions.
* **Compatibility Blockers:** A fix breaks critical integrations or compatibility with core systems.
* **Planned Deprecation:** The affected component is part of a legacy module scheduled for imminent refactoring or decommissioning.

In such cases, the decision will be documented, and any available mitigations will be considered.

---

## Security Announcements

Fixes for security vulnerabilities are announced through standard, publicly available Canonical channels. We recommend subscribing to or monitoring these resources:
* [Ubuntu Security Announce Mailing List](https://lists.ubuntu.com/mailman/listinfo/ubuntu-security-announce)
* [Ubuntu Security Notices](https://ubuntu.com/security/notices)