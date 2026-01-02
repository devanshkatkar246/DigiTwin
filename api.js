// Removed TS types — plain JavaScript version

export const simulatePerformance = (metrics) => {
  const { studyHours, sleepHours, attendance, stressLevel, revisionFrequency, screenTime } = metrics;

  const revisionFactor = revisionFrequency === "Daily" ? 1 : 0.5;

  // Attendance normalized: 0-100 → 0-10 scale
  const normalizedAttendance = attendance / 10;

  const baseScore =
    0.30 * studyHours +
    0.20 * sleepHours +
    0.20 * normalizedAttendance +
    0.15 * revisionFactor * 10 - // scaled to match hour range
    0.10 * stressLevel -
    0.05 * screenTime;

  // Bound score between 0-10
  const score = Math.max(0, Math.min(10, baseScore));

  const future7 = score * 1.04;
  const future30 = score * 1.12;

  return {
    score: parseFloat(score.toFixed(2)),
    future7: parseFloat(future7.toFixed(2)),
    future30: parseFloat(future30.toFixed(2)),
    metrics
  };
};
