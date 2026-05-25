import useAuth from "@/hooks/useAuth";
import { getProfileTypes } from "@/features/instances";
import type { ReactElement } from "react";

const useInstanceSearchHelpTerms = () => {
  const { isFeatureEnabled } = useAuth();

  const profileTypes = getProfileTypes({
    isScriptProfilesEnabled: isFeatureEnabled("script-profiles"),
    isUsgProfilesEnabled: isFeatureEnabled("usg-profiles"),
    isWslProfilesEnabled: isFeatureEnabled("wsl-child-instance-profiles"),
  });

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
            , <code>child-instance-profiles</code>.
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
      term: "access-group-recursive:<name>",
      description: (
        <span>
          Instances associated with the <code>&lt;name&gt;</code> access group
          or its descendants
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
      term: "vendor:<string>",
      description: "Instances containing hardware with the matched vendor.",
    },
    {
      term: "product:<string>",
      description: "Instances containing hardware with the matched product.",
    },
    {
      term: "uuid:<string>",
      description: "Instances containing hardware with the matched UUID.",
    },
    {
      term: "cpu.<attribute>:<string>",
      description: (
        <>
          <span>
            Instances containing a CPU with the matched{" "}
            <code>&lt;attribute&gt;</code>.
          </span>
          <br />
          <span>
            <code>&lt;attribute&gt;</code> can be <code>vendor</code>,{" "}
            <code>product</code>, <code>version</code>, or <code>size</code>. If{" "}
            <code>size</code> is searched, a value or range must be provided,
            e.g. <code>cpu.size:[1Ghz TO 4Ghz]</code>.
          </span>
        </>
      ),
    },
    {
      term: "disk.<attribute>:<string>",
      description: (
        <>
          <span>
            Instances containing a disk with the matched{" "}
            <code>&lt;attribute&gt;</code>.
          </span>
          <br />
          <span>
            <code>&lt;attribute&gt;</code> can be <code>vendor</code>,{" "}
            <code>product</code>, <code>version</code>, or <code>size</code>. If{" "}
            <code>size</code> is searched, a value or range must be provided,
            e.g. <code>disk.size:[10Gb TO 2Tb]</code>.
          </span>
        </>
      ),
    },
    {
      term: "display.<attribute>:<string>",
      description: (
        <span>
          Instances containing a display with the matched{" "}
          <code>&lt;attribute&gt;</code>. <code>&lt;attribute&gt;</code> can be{" "}
          <code>vendor</code>, <code>product</code>, or <code>version</code>.
        </span>
      ),
    },
    {
      term: "firmware.<attribute>:<string>",
      description: (
        <span>
          Instances containing firmware with the matched{" "}
          <code>&lt;attribute&gt;</code>. <code>&lt;attribute&gt;</code> can be{" "}
          <code>vendor</code>, <code>product</code>, or <code>version</code>.
        </span>
      ),
    },
    {
      term: "memory.<attribute>:<string>",
      description: (
        <>
          <span>
            Instances containing memory with the matched{" "}
            <code>&lt;attribute&gt;</code>.
          </span>
          <br />
          <span>
            <code>&lt;attribute&gt;</code> can be <code>vendor</code>,{" "}
            <code>product</code>, <code>version</code>, or <code>size</code>. If{" "}
            <code>size</code> is searched, a value or range must be provided,
            e.g. <code>memory.size:[1Gb TO 8Gb]</code>.
          </span>
        </>
      ),
    },
    {
      term: "network.capacity:<value_or_range>",
      description: (
        <span>
          Instances with a network interface of the specified capacity. A value
          or range must be provided, e.g.{" "}
          <code>network.capacity:[100Mb TO 1Gb]</code>.
        </span>
      ),
    },
    {
      term: "network.<attribute>:<string>",
      description: (
        <span>
          Instances containing a network interface with the matched{" "}
          <code>&lt;attribute&gt;</code>. <code>&lt;attribute&gt;</code> can be{" "}
          <code>vendor</code>, <code>product</code>, or <code>version</code>.
        </span>
      ),
    },
    {
      term: "network.serial:<mac_address>",
      description: (
        <span>
          Instances with a network interface matching the specified MAC address.
        </span>
      ),
    },
    {
      term: "serial:<serialnumber>",
      description: (
        <span>Instances with the specified hardware serial number.</span>
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
      term: "license-type:<license-type>",
      description: (
        <span>
          Instances associated with the specified{" "}
          <code>&lt;license-type&gt;</code>. The <code>license-type</code> must
          be one of <code>unlicensed</code>, <code>pro</code>,{" "}
          <code>free_pro</code>, <code>legacy</code>.
        </span>
      ),
    },
    {
      term: "contract:<contract-id>",
      description: (
        <span>
          Instances associated with the specified{" "}
          <code>&lt;contract-id&gt;</code>,
        </span>
      ),
    },
    {
      term: "availability-zone:<str>",
      description: (
        <span>
          Instances with the availability zone <code>&lt;str&gt;</code>, or use{" "}
          <code>null</code> for instances without one.
        </span>
      ),
    },
    {
      term: "contract-expires-within-days:<days>",
      description: (
        <span>
          Instances associated with an Ubuntu Pro contract that expires within{" "}
          <code>&lt;days&gt;</code> days.
        </span>
      ),
    },
    {
      term: "license-expires-within-days:<days>",
      description: (
        <span>
          Instances associated with a Legacy License that expires within{" "}
          <code>&lt;days&gt;</code> days.
        </span>
      ),
    },
    {
      term: "needs:license OR license-id:none",
      description:
        "Search for instances that do not have a Landscape license, and, as a result, are not managed",
    },
    {
      term: "last-ping:<nr-of-hours>",
      description: (
        <span>
          Instances that were active in the last{" "}
          <code>&lt;nr-of-hours&gt;</code> hours, where{" "}
          <code>&lt;nr-of-hours&gt;</code> is a value between 0 and 8760.
        </span>
      ),
    },
    {
      term: "has-pro-management:<option>",
      description: (
        <span>
          Instances with pro management enabled if <code>&lt;option&gt;</code>{" "}
          is a truthy value or disabled if falsy.
        </span>
      ),
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
      term: "instance-id:<id>",
      description: (
        <span>
          Cloud instances with a specific instance <code>&lt;id&gt;</code>.
        </span>
      ),
    },
    {
      term: "instance-type:<id>",
      description: (
        <span>
          Cloud instances with a specific instance type <code>&lt;id&gt;</code>.
        </span>
      ),
    },
    {
      term: "ami-id:<id>",
      description: (
        <span>
          Cloud instances with a specific AMI <code>&lt;id&gt;</code>.
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
    {
      term: "release-upgrade:available",
      description:
        "Search for computers with a supported Ubuntu release upgrade available.",
    },
  ];

  if (isFeatureEnabled("usg-profiles")) {
    instanceSearchHelpTerms.push({
      term: "profile:usg:<profile_id>:<last_audit_result>",
      description: (
        <>
          <span>
            Instances associated with the USG profile with the id{" "}
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
