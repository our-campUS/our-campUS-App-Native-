const { spawnSync } = require('child_process');
const path = require('path');
const { bumpAndroidVersionCode } = require('./bump-android-version-code');

// armeabi-v7a는 Windows MAX_PATH(260자) 제한으로 CMake 빌드 실패. 추후 필요하면 다시 추가
const ABIS = 'arm64-v8a,x86,x86_64';
const androidDir = path.join(__dirname, '..', 'android');
const gradlew = path.join(
  androidDir,
  process.platform === 'win32' ? 'gradlew.bat' : 'gradlew'
);

bumpAndroidVersionCode();

const result = spawnSync(
  gradlew,
  ['bundleRelease', `-PreactNativeArchitectures=${ABIS}`],
  { cwd: androidDir, stdio: 'inherit', shell: process.platform === 'win32' }
);

process.exit(result.status ?? 1);
