/** Cutoff date: no units sold on or after this date counts as slow for the window. */
export function slowMovingCutoff(days: 30 | 60 | 90): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

/** Mongo filter: zero sales in the last `days` days. */
export function slowMovingFilter(days: 30 | 60 | 90) {
  const cutoff = slowMovingCutoff(days);
  return {
    isArchived: { $ne: true },
    $or: [{ lastSoldAt: null }, { lastSoldAt: { $lt: cutoff } }],
  };
}

export function parseSlowDays(value: string | null): 30 | 60 | 90 {
  const n = Number(value);
  if (n === 60) return 60;
  if (n === 90) return 90;
  return 30;
}
