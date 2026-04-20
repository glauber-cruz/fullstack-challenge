import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    passWithNoTests: true,
    include: [
      "src/domain/**/*.test.ts",
      "src/domain/**/*.spec.ts",
      "tests/unit/**/*.test.ts",
      "tests/unit/**/*.spec.ts",
      "tests/e2e/**/*.test.ts",
      "tests/e2e/**/*.spec.ts",
    ],
  },
  plugins: [
    tsconfigPaths(),
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});
