/**
 * Formats elapsed seconds into "M:SS" string.
 * Examples: 0 → "0:00", 65 → "1:05", 600 → "10:00"
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
