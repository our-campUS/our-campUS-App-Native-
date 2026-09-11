const { execFileSync } = require('child_process');
const path = require('path');

// Info-Debug.plist는 개발 서버 예외를 위해 NSAppTransportSecurity(ATS)만 Info.plist와 의도적으로 다름.
// 그 외 키는 동일해야함.
const ALLOWED_DIFF_KEYS = ['NSAppTransportSecurity'];

function readPlistAsJson(plistPath) {
  const json = execFileSync(
    'plutil',
    ['-convert', 'json', '-o', '-', plistPath],
    {
      encoding: 'utf8',
    }
  );
  return JSON.parse(json);
}

function checkInfoPlistSync() {
  const iosDir = path.join(__dirname, '..', 'ios', 'ourCampusApp');
  const releasePlist = readPlistAsJson(path.join(iosDir, 'Info.plist'));
  const debugPlist = readPlistAsJson(path.join(iosDir, 'Info-Debug.plist'));

  const allKeys = new Set([
    ...Object.keys(releasePlist),
    ...Object.keys(debugPlist),
  ]);

  const mismatches = [];
  for (const key of allKeys) {
    if (ALLOWED_DIFF_KEYS.includes(key)) continue;

    const inRelease = Object.prototype.hasOwnProperty.call(releasePlist, key);
    const inDebug = Object.prototype.hasOwnProperty.call(debugPlist, key);

    if (!inRelease || !inDebug) {
      mismatches.push(
        `  - "${key}": ${
          inRelease ? 'Info.plist에만 존재' : 'Info-Debug.plist에만 존재'
        }`
      );
      continue;
    }

    if (JSON.stringify(releasePlist[key]) !== JSON.stringify(debugPlist[key])) {
      mismatches.push(`  - "${key}" 값이 서로 다름`);
    }
  }

  if (mismatches.length > 0) {
    console.error(
      '[check] Info.plist와 Info-Debug.plist가 어긋났습니다 (NSAppTransportSecurity 제외):'
    );
    console.error(mismatches.join('\n'));
    console.error('\nATS 관련이 아니라면 두 파일에 동일하게 반영해주세요.');
    throw new Error('Info.plist / Info-Debug.plist 동기화 실패');
  }

  console.log(
    '[check] Info.plist / Info-Debug.plist 동기화 확인 완료 (ATS 제외 동일)'
  );
}

if (require.main === module) {
  try {
    checkInfoPlistSync();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

module.exports = { checkInfoPlistSync };
