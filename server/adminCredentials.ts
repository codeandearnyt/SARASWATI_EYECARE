import { timingSafeEqual } from "node:crypto";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function equalSecret(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function areAdminCredentialsConfigured() {
  return Boolean(process.env.ADMIN_LOGIN_EMAIL && process.env.ADMIN_LOGIN_PASSWORD);
}

export function verifyAdminCredentials(email: string, password: string) {
  const configuredEmail = process.env.ADMIN_LOGIN_EMAIL;
  const configuredPassword = process.env.ADMIN_LOGIN_PASSWORD;
  if (!configuredEmail || !configuredPassword) return false;
  return equalSecret(email.trim().toLowerCase(), configuredEmail.trim().toLowerCase()) && equalSecret(password, configuredPassword);
}

export function canAttemptAdminLogin(key: string) {
  const attempt = attempts.get(key);
  if (!attempt || attempt.resetAt <= Date.now()) {
    attempts.delete(key);
    return true;
  }
  return attempt.count < MAX_ATTEMPTS;
}

export function recordFailedAdminLogin(key: string) {
  const existing = attempts.get(key);
  const now = Date.now();
  if (!existing || existing.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  attempts.set(key, { ...existing, count: existing.count + 1 });
}

export function clearAdminLoginAttempts(key: string) {
  attempts.delete(key);
}
