const { execSync } = require("child_process");

function getVersion() {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = now.getMonth() + 1;

  const targetMonth = month <= 4 ? "04" : "10";
  const calVerBase = `${year}.${targetMonth}`;

  const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
  const buildNum = process.env.GITHUB_RUN_NUMBER || "0";

  if (branch === "main") {
    return `${calVerBase}.0.${buildNum}-beta`;
  }
  if (branch === "dev") {
    return `${calVerBase}.0.${buildNum}-dev`;
  }
  if (branch === "stable") {
    return `${calVerBase}.0.${buildNum}`;
  }
  if (branch.startsWith("release/")) {
    const baseLts = branch.replace("release/", "");
    return `${baseLts}.1.${buildNum}`;
  }

  return `0.0.0-draft.${buildNum}`;
}

console.log(getVersion());
