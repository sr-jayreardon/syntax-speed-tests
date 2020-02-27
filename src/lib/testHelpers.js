class TestHelpers {
  static calcStats(begin, end, count) {
    const speed = (end - begin) / count;
    const opsPerSec = 1 / (speed / 1000);

    return {
      speed: speed,
      opsPerSec: opsPerSec
    };
  }

  static fastestTest(tests) {
    let fastest = 0;
    if (tests.length === 1) {
      return 0;
    }
    let current = tests[0].opsPerSec;
    for (let idx = 1; idx < tests.length; idx++) {
      const ops = tests[idx].opsPerSec;
      if (current < ops) {
        current = ops;
        fastest = idx;
      }
    }
    return fastest;
  }

  static speedDiff(primary, secondary) {
    return Math.round(primary / secondary * 100) / 100;
  }

  static calcProjection(stats, count, scope) {
    scope = scope || 'ms';
    const base = stats.speed * count;
    let out;
    switch (scope) {
      case 'd':
        out = base / 1000 / 60 / 60 / 24;
        break;
      case 'h':
        out = base / 1000 / 60 / 60;
        break;
      case 'm':
        out = base / 1000 / 60;
        break;
      case 's':
        out = base / 1000;
        break;
      case 'ms':
      default:
        out = base;
        break;
    }
    out = Math.round(out * 100) / 100;
    return `${out}${scope}`;
  }
}

module.exports = TestHelpers;
