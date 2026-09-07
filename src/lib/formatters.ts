export function formatEmploymentType(val?: string): string {
  if (!val) return 'Full-time';
  const lower = val.toLowerCase().trim();
  if (lower === 'full-time' || lower === 'fulltime') return 'Full-time';
  if (lower === 'part-time' || lower === 'parttime') return 'Part-time';
  if (lower === 'contract') return 'Contract';
  if (lower === 'temp' || lower === 'temporary') return 'Temporary';
  if (lower === 'internship') return 'Internship';
  return val.charAt(0).toUpperCase() + val.slice(1);
}

export function formatSchedule(val?: string): string {
  if (!val) return 'Flexible Hours';
  const lower = val.toLowerCase().trim();
  if (lower === 'flexible') return 'Flexible Hours';
  if (lower === 'morning') return 'Morning Shift';
  if (lower === 'evening') return 'Evening Shift';
  if (lower === 'weekend' || lower === 'weekends') return 'Weekends Only';
  return val.charAt(0).toUpperCase() + val.slice(1);
}

export function formatWorkplaceType(val?: string): string {
  if (!val) return 'On-site';
  const lower = val.toLowerCase().trim();
  if (lower === 'onsite' || lower === 'on-site') return 'On-site';
  if (lower === 'hybrid') return 'Hybrid';
  if (lower === 'remote') return 'Remote';
  return val.charAt(0).toUpperCase() + val.slice(1);
}
