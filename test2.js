const fs = require("fs");

fetch("http://localhost:3000/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Test", email: "test2@example.com", password: "TestPassword123" })
})
.then(async res => {
  const text = await res.text();
  const output = `Status: ${res.status}\nBody: ${text}\n`;
  fs.writeFileSync("test_output.txt", output);
  console.log(output);
})
.catch(e => {
  const output = `Error: ${e.message}\n`;
  fs.writeFileSync("test_output.txt", output);
  console.log(output);
});
