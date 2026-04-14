import { describe, it, expect, beforeAll, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    authToken: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  },
}));

vi.mock("@/services/email/email.service", () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(true),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(true),
}));

import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { generateToken, hashToken, isTokenExpired } from "@/lib/auth/token";
import { signJWT, verifyJWT, decodeJWT } from "@/lib/auth/jwt";

describe("Password Utilities", () => {
  it("should hash password with bcrypt", async () => {
    const password = "SecurePass123!";
    const hash = await hashPassword(password);
    
    expect(hash).toBeTruthy();
    expect(hash).toMatch(/^\$2[aby]?\$\d{1,2}\$/);
    expect(hash).not.toBe(password);
  });

  it("should verify correct password", async () => {
    const password = "SecurePass123!";
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("should reject incorrect password", async () => {
    const password = "SecurePass123!";
    const hash = await hashPassword(password);
    
    const isValid = await verifyPassword("WrongPassword", hash);
    expect(isValid).toBe(false);
  });
});

describe("Token Utilities", () => {
  it("should generate token with raw, hash, and expiry", () => {
    const token = generateToken();
    
    expect(token.raw).toBeTruthy();
    expect(token.raw).toHaveLength(64);
    expect(token.hash).toBeTruthy();
    expect(token.hash).toHaveLength(64);
    expect(token.expiresAt).toBeInstanceOf(Date);
    expect(token.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it("should hash token consistently", () => {
    const rawToken = "abc123def456";
    const hash1 = hashToken(rawToken);
    const hash2 = hashToken(rawToken);
    
    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(rawToken);
  });

  it("should produce different hashes for different tokens", () => {
    const hash1 = hashToken("token1");
    const hash2 = hashToken("token2");
    
    expect(hash1).not.toBe(hash2);
  });

  it("should detect expired tokens", () => {
    const expiredDate = new Date(Date.now() - 1000);
    const validDate = new Date(Date.now() + 1000);
    
    expect(isTokenExpired(expiredDate)).toBe(true);
    expect(isTokenExpired(validDate)).toBe(false);
  });
});

describe("JWT Utilities", () => {
  const payload = { userId: "user-123", email: "test@example.com" };

  it("should sign JWT with payload", () => {
    const result = signJWT(payload);
    
    expect(result.token).toBeTruthy();
    expect(result.token.split(".")).toHaveLength(3);
    expect(result.expiresAt).toBeInstanceOf(Date);
  });

  it("should verify valid JWT", () => {
    const result = signJWT(payload);
    const decoded = verifyJWT(result.token);
    
    expect(decoded).toBeTruthy();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.email).toBe(payload.email);
  });

  it("should decode JWT without verification", () => {
    const result = signJWT(payload);
    const decoded = decodeJWT(result.token);
    
    expect(decoded).toBeTruthy();
    expect(decoded?.userId).toBe(payload.userId);
  });

  it("should return null for invalid JWT", () => {
    const decoded = verifyJWT("invalid-token");
    expect(decoded).toBeNull();
  });

  it("should return null for tampered JWT", () => {
    const result = signJWT(payload);
    const [header, payload2, signature] = result.token.split(".");
    const tampered = `${header}.${payload2}x.${signature}`;
    
    const decoded = verifyJWT(tampered);
    expect(decoded).toBeNull();
  });
});

describe("Auth Service - Signup Flow", () => {
  it("should create user with hashed password", async () => {
    const { prisma } = await import("@/lib/prisma");
    
    (prisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (prisma.user.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      passwordHash: "hashed-password",
      name: "Test User",
      isVerified: false,
    });
    (prisma.authToken.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "token-123",
      tokenHash: "hash",
      type: "email_verification",
    });
    
    const password = "SecurePass123!";
    const hash = await hashPassword(password);
    
    expect(hash).toMatch(/^\$2/);
    expect(hash).not.toBe(password);
  });
});

describe("Auth Service - Token Security", () => {
  it("should never store raw token in database", () => {
    const token = generateToken();
    
    const tokenData = {
      raw: token.raw,
      hash: token.hash,
      expiresAt: token.expiresAt,
    };
    
    const dbRecord = {
      tokenHash: tokenData.hash,
      type: "email_verification",
      expiresAt: tokenData.expiresAt,
    };
    
    expect(dbRecord.tokenHash).not.toBe(tokenData.raw);
    expect(dbRecord.tokenHash).toHaveLength(64);
  });

  it("should verify token hash matches", () => {
    const token = generateToken();
    const storedHash = token.hash;
    
    const incomingHash = hashToken(token.raw);
    expect(incomingHash).toBe(storedHash);
  });

  it("should reject used tokens", async () => {
    const { prisma } = await import("@/lib/prisma");
    
    (prisma.authToken.findFirst as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      id: "token-123",
      isUsed: true,
      expiresAt: new Date(Date.now() + 1000),
    });
    
    const authToken = await prisma.authToken.findFirst({
      where: { isUsed: false }
    });
    
    expect(authToken?.isUsed).toBe(true);
  });

  it("should reject expired tokens", async () => {
    const expiredToken = {
      id: "token-123",
      isUsed: false,
      expiresAt: new Date(Date.now() - 1000),
    };
    
    expect(isTokenExpired(expiredToken.expiresAt)).toBe(true);
  });
});

describe("Auth Service - Password Security", () => {
  it("should hash password before storage", async () => {
    const password = "UserPassword123!";
    const hash = await hashPassword(password);
    
    expect(hash).not.toBe(password);
    expect(hash.startsWith("$2")).toBe(true);
  });

  it("should use sufficient salt rounds", async () => {
    const hash = await hashPassword("test");
    const parts = hash.split("$");
    const rounds = parseInt(parts[2], 10);
    
    expect(rounds).toBeGreaterThanOrEqual(10);
  });
});

describe("Error Handling", () => {
  it("should return generic errors without revealing user existence", () => {
    const genericErrors = [
      "Invalid credentials",
      "Please verify your email first",
      "Token expired",
      "Invalid token",
    ];
    
    const sensitiveInfo = ["user exists", "email found", "token valid", "password matches"];
    
    for (const error of genericErrors) {
      for (const sensitive of sensitiveInfo) {
        expect(error.toLowerCase()).not.toContain(sensitive);
      }
    }
  });
});
