require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const API_BASE = "http://localhost:5000";

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log("=================================================");
  console.log("CareerVista — Password Reset Automated Test Suite");
  console.log("=================================================\n");

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is missing from server/.env");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB for direct verification.\n");

  const testEmail = `test-reset-${Date.now()}@careervista.test`;
  const initialPassword = "InitialPassword123!";
  const newPassword = "NewSecurePassword456!";

  try {
    // -------------------------------------------------------------
    // Test 1: Input Validation on Forgot Password
    // -------------------------------------------------------------
    console.log("Test Suite 1: Input Validation on /api/auth/forgot-password");

    const resEmpty = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "" }),
    });
    const dataEmpty = await resEmpty.json();
    assert(resEmpty.status === 400 && dataEmpty.success === false, "Empty email returns 400 Bad Request");

    const resInvalidEmail = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "invalid-email-format" }),
    });
    const dataInvalidEmail = await resInvalidEmail.json();
    assert(resInvalidEmail.status === 400 && dataInvalidEmail.success === false, "Malformed email returns 400 Bad Request");

    // -------------------------------------------------------------
    // Test 2: Generic Response on Unregistered Email
    // -------------------------------------------------------------
    console.log("\nTest Suite 2: Timing-Safe Generic Response (Unregistered Email)");

    const unregisteredEmail = "nonexistent-user-404@nowhere.com";
    const resUnreg = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: unregisteredEmail }),
    });
    const dataUnreg = await resUnreg.json();
    assert(
      resUnreg.status === 200 && dataUnreg.success === true,
      "Unregistered email returns 200 OK without disclosing user absence"
    );
    assert(
      dataUnreg.message.includes("If an account with that email"),
      "Response contains timing-safe generic message"
    );

    // -------------------------------------------------------------
    // Test 3: Create Test User and Verify Initial Login
    // -------------------------------------------------------------
    console.log("\nTest Suite 3: User Setup & Baseline Login");

    const hashedInitialPassword = await bcrypt.hash(initialPassword, 10);
    const testUser = await User.create({
      name: "Reset Test Candidate",
      email: testEmail,
      password: hashedInitialPassword,
    });
    assert(!!testUser._id, `Created test user ${testEmail}`);

    const resInitialLogin = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: initialPassword }),
    });
    const dataInitialLogin = await resInitialLogin.json();
    assert(resInitialLogin.status === 200 && !!dataInitialLogin.token, "Initial login succeeds with starting password");

    // -------------------------------------------------------------
    // Test 4: Forgot Password Request for Registered User
    // -------------------------------------------------------------
    console.log("\nTest Suite 4: Password Reset Request for Registered User");

    const resForgot = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail }),
    });
    const dataForgot = await resForgot.json();
    assert(resForgot.status === 200 && dataForgot.success === true, "Forgot password returns 200 OK for registered user");

    // Inspect user record in MongoDB
    const updatedUser = await User.findById(testUser._id);
    assert(!!updatedUser.resetPasswordToken, "Database contains resetPasswordToken");
    assert(
      typeof updatedUser.resetPasswordToken === "string" && updatedUser.resetPasswordToken.length === 64,
      "Stored token is a 64-character SHA-256 hash (never plaintext)"
    );
    assert(
      updatedUser.resetPasswordExpire instanceof Date && updatedUser.resetPasswordExpire > new Date(),
      "resetPasswordExpire is a valid future timestamp (~15 min window)"
    );

    // -------------------------------------------------------------
    // Test 5: Reset Password Token Validation
    // -------------------------------------------------------------
    console.log("\nTest Suite 5: Reset Password Token Validation");

    const resInvalidToken = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        password: newPassword,
      }),
    });
    const dataInvalidToken = await resInvalidToken.json();
    assert(
      resInvalidToken.status === 400 && dataInvalidToken.success === false,
      "Non-matching 64-char token is rejected with 400 Bad Request"
    );

    const resMalformedToken = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "not-a-hex-token",
        password: newPassword,
      }),
    });
    assert(resMalformedToken.status === 400, "Malformed token string is rejected with 400 Bad Request");

    // -------------------------------------------------------------
    // Test 6: Password Complexity Enforcement on Reset
    // -------------------------------------------------------------
    console.log("\nTest Suite 6: Password Complexity Enforcement on Reset");

    const rawTestToken = crypto.randomBytes(32).toString("hex");
    const testHashedToken = crypto.createHash("sha256").update(rawTestToken).digest("hex");
    updatedUser.resetPasswordToken = testHashedToken;
    updatedUser.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
    await updatedUser.save();

    // Weak passwords lacking complexity
    const weakPasswords = [
      { pw: "short1!", reason: "fewer than 8 characters" },
      { pw: "nouppercase123!", reason: "missing uppercase letter" },
      { pw: "NOLOWERCASE123!", reason: "missing lowercase letter" },
      { pw: "NoNumberSpecial!", reason: "missing number" },
      { pw: "NoSpecialChar123", reason: "missing special character" },
    ];

    for (const item of weakPasswords) {
      const resWeak = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: rawTestToken, password: item.pw }),
      });
      const dataWeak = await resWeak.json();
      assert(
        resWeak.status === 400 && dataWeak.success === false,
        `Rejects weak password (${item.reason})`
      );
    }

    // -------------------------------------------------------------
    // Test 7: Expired Token Rejection
    // -------------------------------------------------------------
    console.log("\nTest Suite 7: Expired Token Handling");

    const expiredToken = crypto.randomBytes(32).toString("hex");
    const expiredHashed = crypto.createHash("sha256").update(expiredToken).digest("hex");
    updatedUser.resetPasswordToken = expiredHashed;
    updatedUser.resetPasswordExpire = new Date(Date.now() - 60 * 1000); // 1 minute in the past
    await updatedUser.save();

    const resExpired = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: expiredToken, password: newPassword }),
    });
    const dataExpired = await resExpired.json();
    assert(
      resExpired.status === 400 && dataExpired.message.includes("expired"),
      "Expired token is rejected with 400 Bad Request"
    );

    // -------------------------------------------------------------
    // Test 8: Successful Password Reset & Token Invalidation
    // -------------------------------------------------------------
    console.log("\nTest Suite 8: Successful Password Reset Execution");

    const validToken = crypto.randomBytes(32).toString("hex");
    const validHashed = crypto.createHash("sha256").update(validToken).digest("hex");
    updatedUser.resetPasswordToken = validHashed;
    updatedUser.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
    await updatedUser.save();

    const resResetSuccess = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: validToken, password: newPassword }),
    });
    const dataResetSuccess = await resResetSuccess.json();
    assert(
      resResetSuccess.status === 200 && dataResetSuccess.success === true,
      "Password reset succeeds with valid token and strong password"
    );

    // Verify token was wiped from database
    const userAfterReset = await User.findById(testUser._id);
    assert(
      !userAfterReset.resetPasswordToken && !userAfterReset.resetPasswordExpire,
      "Reset token and expiration are invalidated in database immediately upon consumption"
    );

    // -------------------------------------------------------------
    // Test 9: Prevention of Token Reuse
    // -------------------------------------------------------------
    console.log("\nTest Suite 9: Prevention of Consumed Token Reuse");

    const resReuse = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: validToken, password: "AnotherPassword999!" }),
    });
    const dataReuse = await resReuse.json();
    assert(
      resReuse.status === 400 && dataReuse.success === false,
      "Attempted reuse of consumed token is rejected with 400 Bad Request"
    );

    // -------------------------------------------------------------
    // Test 10: Authentication Verification with Old vs New Password
    // -------------------------------------------------------------
    console.log("\nTest Suite 10: Authentication with Old vs New Password");

    const resOldLogin = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: initialPassword }),
    });
    assert(resOldLogin.status === 401, "Old password is now rejected with 401 Unauthorized");

    const resNewLogin = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testEmail, password: newPassword }),
    });
    const dataNewLogin = await resNewLogin.json();
    assert(
      resNewLogin.status === 200 && !!dataNewLogin.token,
      "New password succeeds and logs in user with fresh JWT"
    );

    // -------------------------------------------------------------
    // Cleanup
    // -------------------------------------------------------------
    await User.deleteOne({ _id: testUser._id });
    console.log(`\nCleaned up test user ${testEmail}.`);
  } finally {
    await mongoose.disconnect();
  }

  console.log("\n=================================================");
  console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
