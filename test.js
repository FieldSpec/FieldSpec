fetch("http://localhost:3000/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Test", email: "test@example.com", password: "TestPassword123" })
})
.then(async res => {
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Body:", text);
})
.catch(e => console.error(e));
