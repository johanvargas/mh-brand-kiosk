// Runs once before every test file (wired up via `test.setupFiles` in vite.config.ts).
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Adds DOM-aware assertions like `toBeInTheDocument()` and `toHaveClass()`.
import "@testing-library/jest-dom/vitest";

// Rendered components are unmounted after each test so one test's DOM
// can't leak into the next.
afterEach(() => {
  cleanup();
});
