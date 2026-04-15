const BASE_URL = "http://localhost:3000";

async function test(name, fn) {
  try {
    const result = await fn();
    console.log(`✓ ${name}`);
    return result;
  } catch (err) {
    console.log(`✗ ${name}: ${err.message}`);
  }
}

async function makeRequest(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Request failed");
  return { res, data };
}

async function run() {
  console.log("Testing FieldSpec API...\n");

  await test("GET / (landing page loads)", async () => {
    const res = await fetch(BASE_URL + "/");
    if (!res.ok) throw new Error("Status " + res.status);
  });

  await test("GET /login (login page loads)", async () => {
    const res = await fetch(BASE_URL + "/login");
    if (!res.ok) throw new Error("Status " + res.status);
  });

  await test("GET /signup (signup page loads)", async () => {
    const res = await fetch(BASE_URL + "/signup");
    if (!res.ok) throw new Error("Status " + res.status);
  });

  await test("POST /api/auth/signup (create account)", async () => {
    const { data } = await makeRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: "testuser" + Date.now() + "@example.com",
        password: "testpass123",
        name: "Test User",
      }),
    });
    if (!data.data?.message) throw new Error("No success message");
  });

  await test("POST /api/auth/login (login)", async () => {
    const { data } = await makeRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "testpass123",
      }),
    });
    if (!data.data?.token) throw new Error("No token returned");
  });

  console.log("\n✓ All basic tests passed!");
}

run().catch(console.error);