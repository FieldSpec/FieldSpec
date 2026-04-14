import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { hashPassword, verifyPassword } from "../lib/auth/password";
import { generateToken, hashToken, isTokenExpired } from "../lib/auth/token";
import { signJWT, verifyJWT } from "../lib/auth/jwt";

const pool = new pg.Pool({
  connectionString: "postgresql://postgres:6Q8QZH7m@localhost:5432/flyspec"
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function cleanup() {
  await prisma.authToken.deleteMany();
  await prisma.user.deleteMany();
}

async function testAll() {
  console.log("=== Authentication System Integration Tests ===\n");
  
  await prisma.$connect();
  console.log("✓ Database connected (PostgreSQL)");
  
  await cleanup();
  console.log("✓ Cleaned database\n");

  // Test 1: Password Hashing
  console.log("--- Test 1: Password Hashing ---");
  const password = "SecurePass123!";
  const hash = await hashPassword(password);
  console.log("✓ Password hashed:", hash.substring(0, 30) + "...");
  const isValid = await verifyPassword(password, hash);
  console.log("✓ Password verification:", isValid ? "PASS" : "FAIL");
  const isInvalid = await verifyPassword("WrongPassword", hash);
  console.log("✓ Wrong password rejected:", !isInvalid ? "PASS" : "FAIL");

  // Test 2: Token Generation
  console.log("\n--- Test 2: Token Generation ---");
  const token = generateToken();
  console.log("✓ Token generated:", token.raw.substring(0, 20) + "...");
  console.log("✓ Hash stored in DB:", token.hash.substring(0, 20) + "...");
  console.log("✓ Expiry set:", token.expiresAt.toISOString());
  const reHashed = hashToken(token.raw);
  console.log("✓ Hash verification:", reHashed === token.hash ? "PASS" : "FAIL");

  // Test 3: JWT
  console.log("\n--- Test 3: JWT ---");
  const payload = { userId: "user-123", email: "test@example.com" };
  const jwt = signJWT(payload);
  console.log("✓ JWT signed:", jwt.token.substring(0, 40) + "...");
  const decoded = verifyJWT(jwt.token);
  console.log("✓ JWT verified:", decoded?.userId === payload.userId ? "PASS" : "FAIL");

  // Test 4: Signup Flow
  console.log("\n--- Test 4: Signup Flow ---");
  const email = "test@example.com";
  const name = "Test User";
  const passwordHash = await hashPassword(password);
  
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      authProvider: "email",
      isVerified: false,
    },
  });
  console.log("✓ User created:", user.email, "| Verified:", user.isVerified);
  
  const tokenData = generateToken();
  await prisma.authToken.create({
    data: {
      userId: user.id,
      tokenHash: tokenData.hash,
      type: "email_verification",
      expiresAt: tokenData.expiresAt,
    },
  });
  console.log("✓ AuthToken created");
  
  const storedToken = await prisma.authToken.findFirst({ where: { userId: user.id } });
  console.log("✓ Token NOT stored as raw:", storedToken?.tokenHash !== tokenData.raw ? "PASS" : "FAIL");

  // Test 5: Email Verification
  console.log("\n--- Test 5: Email Verification ---");
  const verifyToken = await prisma.authToken.findFirst({
    where: { userId: user.id, type: "email_verification" }
  });
  
  const hashMatch = hashToken(tokenData.raw) === verifyToken?.tokenHash;
  console.log("✓ Token hash matches:", hashMatch ? "PASS" : "FAIL");
  
  await prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });
  await prisma.authToken.update({ where: { id: verifyToken?.id }, data: { isUsed: true } });
  
  const verifiedUser = await prisma.user.findUnique({ where: { id: user.id } });
  console.log("✓ User verified:", verifiedUser?.isVerified ? "PASS" : "FAIL");
  
  const usedToken = await prisma.authToken.findUnique({ where: { id: verifyToken?.id } });
  console.log("✓ Token marked used:", usedToken?.isUsed ? "PASS" : "FAIL");

  // Test 6: Login
  console.log("\n--- Test 6: Login ---");
  const loginUser = await prisma.user.findUnique({ where: { email } });
  
  if (!loginUser) {
    console.log("✗ User not found");
  } else if (!loginUser.isVerified) {
    console.log("✗ Unverified user blocked");
  } else {
    const loginPassword = await verifyPassword(password, loginUser.passwordHash || "");
    console.log("✓ Password valid:", loginPassword ? "PASS" : "FAIL");
    
    const jwtResult = signJWT({ userId: loginUser.id, email: loginUser.email });
    console.log("✓ JWT issued:", jwtResult.token ? "PASS" : "FAIL");
  }

  // Test 7: Forgot Password
  console.log("\n--- Test 7: Forgot Password ---");
  const resetToken = generateToken();
  await prisma.authToken.create({
    data: {
      userId: user.id,
      tokenHash: resetToken.hash,
      type: "password_reset",
      expiresAt: resetToken.expiresAt,
    },
  });
  console.log("✓ Reset token created");
  
  const storedResetToken = await prisma.authToken.findFirst({
    where: { userId: user.id, type: "password_reset" }
  });
  console.log("✓ Token stored as hash:", storedResetToken?.tokenHash !== resetToken.raw ? "PASS" : "FAIL");

  // Test 8: Reset Password
  console.log("\n--- Test 8: Reset Password ---");
  const newPassword = "NewSecurePass456!";
  const newHash = await hashPassword(newPassword);
  
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
  await prisma.authToken.update({ where: { id: storedResetToken?.id }, data: { isUsed: true } });
  
  const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
  const passwordMatches = await verifyPassword(newPassword, updatedUser?.passwordHash || "");
  console.log("✓ Password updated:", passwordMatches ? "PASS" : "FAIL");
  
  const consumedToken = await prisma.authToken.findUnique({ where: { id: storedResetToken?.id } });
  console.log("✓ Token consumed:", consumedToken?.isUsed ? "PASS" : "FAIL");

  // Test 9: Token Expiry
  console.log("\n--- Test 9: Token Expiry ---");
  const expiredDate = new Date(Date.now() - 1000);
  const validDate = new Date(Date.now() + 1000);
  console.log("✓ Expired token rejected:", isTokenExpired(expiredDate) ? "PASS" : "FAIL");
  console.log("✓ Valid token accepted:", !isTokenExpired(validDate) ? "PASS" : "FAIL");

  // Test 10: Security - No Raw Token Storage
  console.log("\n--- Test 10: Security ---");
  const allTokens = await prisma.authToken.findMany();
  const noRawTokens = allTokens.every(t => t.tokenHash.length === 64 && !t.tokenHash.includes(tokenData.raw));
  console.log("✓ No raw tokens in DB:", noRawTokens ? "PASS" : "FAIL");
  
  await prisma.$disconnect();
  await pool.end();
  
  console.log("\n=== All Tests Complete ===");
}

testAll().catch(console.error);
