import useAuth from "@/hooks/useAuth";
import type { ReactElement } from "react";

const useInstanceSearchHelpTerms = () => {
  const { isFeatureEnabled } = useAuth();

  const profileTypes = ["package", "reboot", "removal", "repository"];

  if (isFeatureEnabled("script-profiles")) {
    profileTypes.push("script");
  }

  if (isFeatureEnabled("usg-profiles")) {
    profileTypes.push("security");
  }

  profileTypes.push("upgrade");

  if (isFeatureEnabled("wsl-child-instance-profiles")) {
    profileTypes.push("wsl");
  }

  const instanceSearchHelpTerms: {
    term: string;
    description: string | ReactElement<ReactElement>;
  }[] = [
    {
      term: "<keyword>",
      description: (
        <span>
          Instances with the title or hostname <code>&lt;keyword&gt;</code>
        </span>
      ),
    },
    {
      term: "distribution:<keyword>",
      description: (
        <span>
          Instances with the installed distribution named{" "}
          <code>&lt;keyword&gt;</code>
        </span>
      ),
    },
    {
      term: "needs:reboot",
      description: "Instances needing a reboot",
    },
    {
      term: "alert:<type>",
      description: (
        <>
          <span>
            Instances with outstanding alerts of the specified{" "}
            <code>&lt;type&gt;</code>
          </span>
          <br />
          <span>
            <code>&lt;type&gt;</code> can be <code>package-upgrades</code>,{" "}
            <code>security-upgrades</code>,<code>package-profiles</code>,{" "}
            <code>package-reporter</code>, <code>esm-disabled</code>,{" "}
            <code>computer-offline</code>,<code>computer-reboot</code>,{" "}
            <code>computer-duplicates</code>, <code>unapproved-activities</code>
            .
          </span>
        </>
      ),
    },
    {
      term: "ip:<address>",
      description: (
        <>
          <span>
            Instances with IP addresses like <code>&lt;address&gt;</code>
          </span>
          <br />
          <span>
            <code>&lt;address&gt;</code> can be a fragment or partial IP address
            representing a subnet such as 91.185.94 to match any instances in
            the subnet.
          </span>
        </>
      ),
    },
    {
      term: "mac:<address>",
      description: (
        <span>
          Instances with the MAC address <code>&lt;address&gt;</code>
        </span>
      ),
    },
    {
      term: "id:<instance_id>",
      description: (
        <span>
          Instance with the id <code>&lt;instance_id&gt;</code>
        </span>
      ),
    },
    {
      term: "access-group:<name>",
      description: (
        <span>
          Instances associated with the <code>&lt;name&gt;</code> access group
        </span>
      ),
    },
    {
      term: "search:<name>",
      description: (
        <span>
          Instances meeting the terms of the <code>&lt;name&gt;</code> saved
          search
        </span>
      ),
    },
    {
      term: "upgrade-profile:<name>",
      description: (
        <span>
          Instances associated with the <code>&lt;name&gt;</code> upgrade
          profile
        </span>
      ),
    },
    {
      term: "removal-profile:<name>",
      description: (
        <span>
          Instances associated with the <code>&lt;name&gt;</code> removal
          profile
        </span>
      ),
    },
    {
      term: "tag:<keyword>",
      description: (
        <span>
          Instances associated with the <code>&lt;keyword&gt;</code> tag
        </span>
      ),
    },
    {
      term: "hostname:<keyword>",
      description: (
        <span>
          Instance with the hostname <code>&lt;keyword&gt;</code>
        </span>
      ),
    },
    {
      term: "title:<keyword>",
      description: (
        <span>
          Instance with the title <code>&lt;keyword&gt;</code>
        </span>
      ),
    },
    {
      term: "license-id:<license_id>",
      description: (
        <span>
          Search for instances licensed to the specified{" "}
          <code>&lt;license_id&gt;</code>
        </span>
      ),
    },
    {
      term: "needs:license OR license-id:none",
      description:
        "Search for instances that do not have a Landscape license, and, as a result, are not managed",
    },
    {
      term: "annotation:<key>",
      description: (
        <span>
          Search for instances which define the specified annotation key.
          Optionally specify <code>annotation:&lt;key&gt;:&lt;string&gt;</code>{" "}
          which will only return instances whose key matches and value also
          contains the <code>&lt;string&gt;</code> specified
        </span>
      ),
    },
    {
      term: "profile:<type>:<profile_id>",
      description: (
        <>
          <span>
            Instances associated with the profile of type{" "}
            <code>&lt;type&gt;</code> with the id{" "}
            <code>&lt;profile_id&gt;</code>
          </span>
          <br />
          <span>
            <code>&lt;type&gt;</code> can be{" "}
            {profileTypes.map((profileType, index) => (
              <>
                <code key={profileType}>{profileType}</code>
                {index < profileTypes.length - 1 && ", "}
              </>
            ))}
          </span>
        </>
      ),
    },
  ];

  if (isFeatureEnabled("usg-profiles")) {
    instanceSearchHelpTerms.push({
      term: "profile:security:<profile_id>:<last_audit_result>",
      description: (
        <>
          <span>
            Instances associated with the security profile with the id{" "}
            <code>&lt;profile_id&gt;</code> with a last security audit result of{" "}
            <code>&lt;last_audit_result&gt;</code>
          </span>
          <br />
          <span>
            <code>&lt;last_audit_result&gt;</code> can be <code>pass</code>,{" "}
            <code>fail</code>, <code>in-progress</code>
          </span>
        </>
      ),
    });
  }

  if (isFeatureEnabled("wsl-child-instance-profiles")) {
    instanceSearchHelpTerms.push({
      term: "profile:wsl:<profile_id>:<compliance_status>",
      description: (
        <>
          <span>
            Instances associated with the WSL child instance profile with the id{" "}
            <code>&lt;profile_id&gt;</code> with a compliance state of{" "}
            <code>&lt;compliance_status&gt;</code>
          </span>
          <br />
          <span>
            <code>&lt;compliance_status&gt;</code> can be <code>compliant</code>
            , <code>noncompliant</code>
          </span>
        </>
      ),
    });
  }

  return instanceSearchHelpTerms;
};

export default useInstanceSearchHelpTerms;
