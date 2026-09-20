// `vitest/config` re-exports vite's defineConfig, with the `test` key typed.
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// The plugin does not export its options type, so derive it from the function.
type ImageOptimizerOptions = NonNullable<Parameters<typeof ViteImageOptimizer>[0]>;

const DEFAULT_OPTIONS: ImageOptimizerOptions = {
  logStats: true,
  ansiColors: true,
  test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
  exclude: undefined,
  include: undefined,
  includePublic: true,
  svg: {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            cleanupNumericValues: false,
            cleanupIds: {
              minify: false,
              remove: false,
            },
            convertPathData: false,
          },
        },
      },
      'sortAttrs',
      {
        name: 'addAttributesToSVGElement',
        params: {
          attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
        },
      },
    ],
  },
  png: {
    // https://sharp.pixelplumbing.com/api-output#png
    quality: 100,
  },
  jpeg: {
    // https://sharp.pixelplumbing.com/api-output#jpeg
    quality: 100,
  },
  jpg: {
    // https://sharp.pixelplumbing.com/api-output#jpeg
    quality: 100,
  },
  tiff: {
    // https://sharp.pixelplumbing.com/api-output#tiff
    quality: 100,
  },
  // gif does not support lossless compression
  // https://sharp.pixelplumbing.com/api-output#gif
  gif: {},
  webp: {
    // https://sharp.pixelplumbing.com/api-output#webp
    lossless: true,
  },
  avif: {
    // https://sharp.pixelplumbing.com/api-output#avif
    lossless: true,
  },
  cache: false,
  cacheLocation: undefined,
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteImageOptimizer(DEFAULT_OPTIONS),
  ],
  test: {
    // Components need a DOM to render into; jsdom is an in-memory stand-in.
    environment: "jsdom",
    // Runs before every test file: registers jest-dom matchers and unmounts
    // rendered components between tests.
    setupFiles: ["./src/test/setup.ts"],
    // Tests live next to the code they cover, as *.test.ts / *.test.tsx.
    include: ["src/**/*.test.{ts,tsx}"],
    // Imported stylesheets are stubbed rather than compiled; no test asserts on them.
    css: false,
  },
});
