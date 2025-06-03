const assert = require("assert");
const request = require("supertest");
const { app, initializeDatabase } = require("./index");  // <-- correct path

async function runTests() {
  await initializeDatabase();

  const res = await request(app).get("/getEvents");
  assert.strictEqual(res.statusCode, 200);
  assert.ok(Array.isArray(res.body.data));

  console.log("GET /getEvents test passed");

  // other tests...
}

runTests()
  .then(() => {
    console.log("All tests passed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
  });
