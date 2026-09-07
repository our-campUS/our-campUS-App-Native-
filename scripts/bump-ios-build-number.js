const fs = require('fs');
const path = require('path');

function bumpIosBuildNumber() {
  const pbxprojPath = path.join(
    __dirname,
    '..',
    'ios',
    'ourCampusApp.xcodeproj',
    'project.pbxproj'
  );
  const content = fs.readFileSync(pbxprojPath, 'utf8');

  const matches = [...content.matchAll(/CURRENT_PROJECT_VERSION = (\d+);/g)];
  if (matches.length === 0) {
    throw new Error(
      '[bump] CURRENT_PROJECT_VERSION not found in ios/ourCampusApp.xcodeproj/project.pbxproj'
    );
  }

  const versions = new Set(matches.map((match) => match[1]));
  if (versions.size > 1) {
    throw new Error(
      `[bump] CURRENT_PROJECT_VERSION values are out of sync: ${[
        ...versions,
      ].join(', ')}`
    );
  }

  const current = parseInt(matches[0][1], 10);
  const next = current + 1;
  const updated = content.replace(
    /CURRENT_PROJECT_VERSION = \d+;/g,
    `CURRENT_PROJECT_VERSION = ${next};`
  );
  fs.writeFileSync(pbxprojPath, updated);

  console.log(`[bump] iOS CURRENT_PROJECT_VERSION: ${current} → ${next}`);
  return { current, next };
}

if (require.main === module) {
  try {
    bumpIosBuildNumber();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = { bumpIosBuildNumber };
