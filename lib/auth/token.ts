import crypto from "crypto";

const TOKEN_BYTES = 32;
const TOKEN_EXPIRY_MINUTES = 30;

export interface TokenData {
  raw: string;
  hash: string;
  expiresAt: Date;
}

export function generateToken(): { raw: string; hash: string; expiresAt: Date } {
  const raw = crypto.randomBytes(TOKEN_BYTES).toString("hex");
  const hash = hashToken(raw);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

  return { raw, hash, expiresAt };
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}
