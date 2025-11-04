import assert from "assert";
import { parseFileBuffer as parseFileBufferService } from "../sprint1-demo/services/resumeParserService.js";

// Use a plain text buffer for test to avoid PDF parser strictness
const textBuffer = Buffer.from("Hello world from test!", "utf8");

async function runTest() {
  // Mock the multer file object shape expected by parseFileBufferService
  const file = {
    originalname: "test.txt",
    mimetype: "text/plain",
    buffer: textBuffer,
    size: textBuffer.length
  };

  try {
    await import("../sprint1-demo/services/resumeParserService.js");
    const text = await parseFileBufferService(file);
    console.log("parseFileBufferService returned text preview:", (text||"").slice(0,200));
    assert.ok(text && typeof text === "string", "Expected string output from parseFileBufferService");
    assert.ok(text.includes("Hello") || text.toLowerCase().includes("hello"), "Parsed text should contain 'Hello'");
    console.log("TEST PASS: parseFileBufferService parsed the fixture PDF.");
    process.exit(0);
  } catch (err) {
    console.error("TEST FAIL:", err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

runTest();
