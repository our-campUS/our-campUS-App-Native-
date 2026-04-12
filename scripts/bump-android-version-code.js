const fs = require('fs');
const path = require('path');

function bumpAndroidVersionCode() {
  const gradlePath = path.join(
    __dirname,
    '..',
    'android',
    'app',
    'build.gradle'
  );
  const content = fs.readFileSync(gradlePath, 'utf8');

  const match = content.match(/versionCode\s+(\d+)/);
  if (!match) {
    throw new Error('[bump] versionCode not found in android/app/build.gradle');
  }

  const current = parseInt(match[1], 10);
  const next = current + 1;
  const updated = content.replace(/versionCode\s+\d+/, `versionCode ${next}`);
  fs.writeFileSync(gradlePath, updated);

  console.log(`[bump] android versionCode: ${current} → ${next}`);
  return { current, next };
}

if (require.main === module) {
  try {
    bumpAndroidVersionCode();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = { bumpAndroidVersionCode };
