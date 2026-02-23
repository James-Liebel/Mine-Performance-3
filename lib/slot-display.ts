/**
 * Display name for a training slot: Pitching, Hitting, Catching, Lifting, or Youth options (Saturdays).
 */
export function getSlotDisplayName(program: string | undefined, date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const dayOfWeek = new Date(y, m - 1, d).getDay();
  if (dayOfWeek === 6) return 'Youth options';

  const p = (program ?? '').toLowerCase();
  if (p.includes('pitching') || p.includes('pitch') || p.includes('velo') || p.includes('rehab')) return 'Pitching';
  if (p.includes('hitting') || p.includes('cage')) return 'Hitting';
  if (p.includes('catching') || p.includes('catcher')) return 'Catching';
  if (p.includes('strength') || p.includes('conditioning') || p.includes('s&c')) return 'Lifting';
  if (p.includes('youth')) return 'Youth options';

  return program || 'Training';
}

/** Format 24h time (e.g. "09:00", "14:30") to 12h (e.g. "9:00 AM", "2:30 PM"). */
export function formatTime12h(time: string | undefined): string {
  if (!time || !time.trim()) return '—';
  const [hStr, mStr] = time.trim().split(':');
  const hour = parseInt(hStr ?? '0', 10);
  const min = mStr ?? '00';
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h12}:${min} ${ampm}`;
}
