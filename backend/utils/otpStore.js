const store = new Map();

export function saveOtp({ phone, code, ttlMs }) {
  const expiresAt = Date.now() + ttlMs;
  store.set(phone, { code, expiresAt });
}

export function verifyOtp({ phone, code }) {
  const entry = store.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    store.delete(phone);
    return false;
  }
  const ok = entry.code === code;
  if (ok) store.delete(phone);
  return ok;
}

