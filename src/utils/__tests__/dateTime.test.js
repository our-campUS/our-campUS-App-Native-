import {
  parseISODate,
  formatKoreanDate,
  formatKoreanDateTime,
  formatKoreanTime,
  formatDotDate,
  formatClockTime,
  formatReviewDate,
  createDateOnly,
  createTimeOnly,
  toISODateString,
  toISODateTimeString,
} from '../dateTime';

// ── parseISODate ──

describe('parseISODate', () => {
  it('null/undefined/빈 문자열이면 null을 반환한다', () => {
    expect(parseISODate(null)).toBeNull();
    expect(parseISODate(undefined)).toBeNull();
    expect(parseISODate('')).toBeNull();
  });

  it('date-time 형식 문자열을 파싱한다', () => {
    expect(parseISODate('2026-03-05T14:30')).toEqual({
      year: 2026,
      month: 3,
      day: 5,
      hour: 14,
      minute: 30,
    });
  });

  it('초가 포함된 date-time 형식도 파싱한다', () => {
    expect(parseISODate('2026-01-10T18:00:00')).toEqual({
      year: 2026,
      month: 1,
      day: 10,
      hour: 18,
      minute: 0,
    });
  });

  it('date-only 형식은 hour/minute가 null이다', () => {
    expect(parseISODate('2025-04-10')).toEqual({
      year: 2025,
      month: 4,
      day: 10,
      hour: null,
      minute: null,
    });
  });

  it('선행 0을 자동 제거한다 (parseInt)', () => {
    const result = parseISODate('2026-01-05T09:05');
    expect(result.month).toBe(1);
    expect(result.day).toBe(5);
    expect(result.hour).toBe(9);
    expect(result.minute).toBe(5);
  });

  it('12월 31일을 정확히 파싱한다', () => {
    expect(parseISODate('2026-12-31T23:59')).toEqual({
      year: 2026,
      month: 12,
      day: 31,
      hour: 23,
      minute: 59,
    });
  });
});

// ── formatKoreanDate ──

describe('formatKoreanDate', () => {
  it('null/undefined이면 빈 문자열을 반환한다', () => {
    expect(formatKoreanDate(null)).toBe('');
    expect(formatKoreanDate(undefined)).toBe('');
  });

  it('PARTNERSHIP 종료일 형식으로 포맷한다', () => {
    expect(formatKoreanDate('2026-03-05T00:00:00')).toBe(
      '2026년 3월 5일 까지',
    );
  });

  it('선행 0이 없는 월/일은 그대로 표시한다', () => {
    expect(formatKoreanDate('2026-12-31T00:00:00')).toBe(
      '2026년 12월 31일 까지',
    );
  });

  it('date-only 형식도 처리한다', () => {
    expect(formatKoreanDate('2025-04-30')).toBe('2025년 4월 30일 까지');
  });

  it('1월 1일의 선행 0을 모두 제거한다', () => {
    expect(formatKoreanDate('2026-01-01T00:00:00')).toBe(
      '2026년 1월 1일 까지',
    );
  });
});

// ── formatKoreanDateTime ──

describe('formatKoreanDateTime', () => {
  it('null/undefined이면 빈 문자열을 반환한다', () => {
    expect(formatKoreanDateTime(null)).toBe('');
    expect(formatKoreanDateTime(undefined)).toBe('');
  });

  it('EVENT 날짜+시간 형식으로 포맷한다', () => {
    expect(formatKoreanDateTime('2026-03-05T14:30')).toBe(
      '2026년 3월 5일 14시 30분',
    );
  });

  it('날짜와 시간의 선행 0을 모두 제거한다', () => {
    expect(formatKoreanDateTime('2026-01-01T09:05:00')).toBe(
      '2026년 1월 1일 9시 5분',
    );
  });

  it('분이 0이어도 항상 표시한다', () => {
    expect(formatKoreanDateTime('2026-03-15T14:00:00')).toBe(
      '2026년 3월 15일 14시 0분',
    );
  });

  it('시간 정보가 없는 date-only 문자열이면 시/분 없이 표시한다', () => {
    expect(formatKoreanDateTime('2025-04-10')).toBe('2025년 4월 10일');
  });
});

// ── formatKoreanTime ──

describe('formatKoreanTime', () => {
  it('null/undefined이면 빈 문자열을 반환한다', () => {
    expect(formatKoreanTime(null)).toBe('');
    expect(formatKoreanTime(undefined)).toBe('');
  });

  it('시간과 분을 표시한다', () => {
    expect(formatKoreanTime('2026-03-15T14:30')).toBe('14시 30분');
  });

  it('분이 0이면 시만 표시한다', () => {
    expect(formatKoreanTime('2026-03-15T14:00:00')).toBe('14시');
  });

  it('자정에 분이 있으면 0시 M분으로 표시한다', () => {
    expect(formatKoreanTime('2026-03-15T00:30')).toBe('0시 30분');
  });

  it('date-only 문자열이면 빈 문자열을 반환한다', () => {
    expect(formatKoreanTime('2025-04-10')).toBe('');
  });
});

// ── formatDotDate ──

describe('formatDotDate', () => {
  it('null이면 빈 문자열을 반환한다', () => {
    expect(formatDotDate(null)).toBe('');
  });

  it('Date 객체를 YYYY.MM.DD 형식으로 포맷한다 (선행 0 유지)', () => {
    expect(formatDotDate(new Date(2026, 2, 5))).toBe('2026.03.05');
  });

  it('두 자리 월/일은 그대로 유지한다', () => {
    expect(formatDotDate(new Date(2026, 11, 25))).toBe('2026.12.25');
  });
});

// ── formatClockTime ──

describe('formatClockTime', () => {
  it('null이면 빈 문자열을 반환한다', () => {
    expect(formatClockTime(null)).toBe('');
  });

  it('Date 객체를 HH:MM 형식으로 포맷한다', () => {
    expect(formatClockTime(new Date(2000, 0, 1, 14, 30))).toBe('14:30');
  });

  it('선행 0을 유지한다', () => {
    expect(formatClockTime(new Date(2000, 0, 1, 9, 5))).toBe('09:05');
  });
});

// ── formatReviewDate ──

describe('formatReviewDate', () => {
  it('null/undefined/빈 문자열이면 빈 문자열을 반환한다', () => {
    expect(formatReviewDate(null)).toBe('');
    expect(formatReviewDate(undefined)).toBe('');
    expect(formatReviewDate('')).toBe('');
  });

  it('ISO date 문자열을 YY.MM.DD 형식으로 변환한다', () => {
    expect(formatReviewDate('2026-03-05')).toBe('26.03.05');
  });

  it('date-time 문자열도 날짜 부분만 변환한다', () => {
    expect(formatReviewDate('2026-03-05T14:30:00')).toBe('26.03.05');
  });
});

// ── createDateOnly ──

describe('createDateOnly', () => {
  it('null이면 null을 반환한다', () => {
    expect(createDateOnly(null)).toBeNull();
  });

  it('시간을 자정으로 설정한 Date 객체를 반환한다', () => {
    const input = new Date(2026, 2, 5, 14, 30, 45);
    const result = createDateOnly(input);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(2);
    expect(result.getDate()).toBe(5);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });
});

// ── createTimeOnly ──

describe('createTimeOnly', () => {
  it('null이면 null을 반환한다', () => {
    expect(createTimeOnly(null)).toBeNull();
  });

  it('날짜를 2000-01-01로 고정하고 시간만 보존한다', () => {
    const input = new Date(2026, 5, 15, 14, 30, 0);
    const result = createTimeOnly(input);
    expect(result.getFullYear()).toBe(2000);
    expect(result.getMonth()).toBe(0);
    expect(result.getDate()).toBe(1);
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(30);
  });
});

// ── toISODateString ──

describe('toISODateString', () => {
  it('null이면 null을 반환한다', () => {
    expect(toISODateString(null)).toBeNull();
  });

  it('Date 객체를 ISO date-time 문자열로 변환한다', () => {
    const result = toISODateString(new Date(2026, 2, 5));
    expect(result).toBe('2026-03-05T00:00:00.000Z');
  });
});

// ── toISODateTimeString ──

describe('toISODateTimeString', () => {
  it('date나 time이 null이면 null을 반환한다', () => {
    expect(toISODateTimeString(null, new Date())).toBeNull();
    expect(toISODateTimeString(new Date(), null)).toBeNull();
  });

  it('date와 time을 조합하여 ISO 문자열을 생성한다', () => {
    const date = new Date(2026, 2, 5);
    const time = new Date(2000, 0, 1, 14, 30);
    expect(toISODateTimeString(date, time)).toBe('2026-03-05T14:30');
  });
});
