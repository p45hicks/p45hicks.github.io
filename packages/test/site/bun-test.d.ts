/* eslint-disable @typescript-eslint/no-empty-object-type */
import { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "bun:test" {
  // We interface merge with Bun's internal Matchers interface
  interface Matchers<T> extends TestingLibraryMatchers<typeof expect.stringContaining, T> { }
  interface AsymmetricMatchers extends TestingLibraryMatchers { }
}
