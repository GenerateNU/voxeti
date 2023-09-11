import { test, expect } from "@playwright/test";

test("basic test", async ({ page }) => {
  const testString = "test";
  expect(testString).toBe("test");
});
