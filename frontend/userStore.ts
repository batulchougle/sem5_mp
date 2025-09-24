// Simple in-memory username store for uniqueness checks.
// NOTE: This resets when the app reloads. Replace with backend or AsyncStorage later.

const usernames = new Set<string>();

export function isUsernameTaken(username: string): boolean {
  const key = (username || '').trim().toLowerCase();
  if (!key) return false;
  return usernames.has(key);
}

export function addUsername(username: string): void {
  const key = (username || '').trim().toLowerCase();
  if (!key) return;
  usernames.add(key);
}

export function removeUsername(username: string): void {
  const key = (username || '').trim().toLowerCase();
  if (!key) return;
  usernames.delete(key);
}
