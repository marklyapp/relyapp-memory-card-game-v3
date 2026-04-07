import { formatTime } from '../app/lib/timer';

describe('formatTime', () => {
  test('0 seconds → "0:00"', () => {
    expect(formatTime(0)).toBe('0:00');
  });

  test('65 seconds → "1:05"', () => {
    expect(formatTime(65)).toBe('1:05');
  });

  test('600 seconds → "10:00"', () => {
    expect(formatTime(600)).toBe('10:00');
  });

  test('5 seconds → "0:05"', () => {
    expect(formatTime(5)).toBe('0:05');
  });

  test('59 seconds → "0:59"', () => {
    expect(formatTime(59)).toBe('0:59');
  });

  test('60 seconds → "1:00"', () => {
    expect(formatTime(60)).toBe('1:00');
  });

  test('3600 seconds → "60:00"', () => {
    expect(formatTime(3600)).toBe('60:00');
  });

  test('3661 seconds → "61:01"', () => {
    expect(formatTime(3661)).toBe('61:01');
  });

  test('1 second → "0:01"', () => {
    expect(formatTime(1)).toBe('0:01');
  });
});
