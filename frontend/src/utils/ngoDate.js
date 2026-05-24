/** Normalize API/Firestore date values to YYYY-MM-DD for <input type="date" /> */
export function toDateInputValue(value) {
  if (value == null || value === '') return '';

  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString().slice(0, 10);
  }

  if (typeof value._seconds === 'number') {
    return new Date(value._seconds * 1000).toISOString().slice(0, 10);
  }

  if (typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000).toISOString().slice(0, 10);
  }

  return '';
}

/** Format YYYY-MM-DD for tables and detail views */
export function formatEstablishedDate(value) {
  const iso = toDateInputValue(value);
  if (!iso) return '—';

  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/** Map organization API record to form-friendly shape */
export function normalizeOrganization(org) {
  if (!org) return org;
  const established = toDateInputValue(org.established ?? org.foundedDate);
  return { ...org, established };
}

/** Payload sent to API — only include established when set */
export function organizationPayload(formData) {
  const { established, foundedDate, ...rest } = formData;
  const payload = { ...rest };

  const dateValue = toDateInputValue(established ?? foundedDate);
  if (dateValue) {
    payload.established = dateValue;
  }

  return payload;
}

export const todayDateInputValue = () => new Date().toISOString().slice(0, 10);
