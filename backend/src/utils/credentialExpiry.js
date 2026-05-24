export function getCredentialExpiryDate(user) {
  const raw = user?.credentialsExpiresAt;
  if (!raw) return null;
  if (typeof raw.toDate === 'function') return raw.toDate();
  return new Date(raw);
}

export function isCredentialExpired(user) {
  const expiresAt = getCredentialExpiryDate(user);
  if (!expiresAt) return false;
  return expiresAt.getTime() < Date.now();
}

export function credentialExpiryMessage() {
  return 'Your temporary credentials have expired. Please contact your administrator for new access.';
}
