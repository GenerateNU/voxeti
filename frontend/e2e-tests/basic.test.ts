import { test, expect } from "@playwright/test";

test("basic test", async () => {
  const testString = "test";
  expect(testString).toBe("test");
});
