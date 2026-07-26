import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

class TestStorage implements Storage {
  private readonly store = new Map<string, string>();

  get length() {
    return this.store.size;
  }

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
}

let hasLocalStorage = false;
try {
  hasLocalStorage = typeof window.localStorage !== "undefined";
} catch {
  hasLocalStorage = false;
}

if (!hasLocalStorage) {
  Object.defineProperty(globalThis, "Storage", {
    configurable: true,
    value: TestStorage,
  });
  Object.defineProperty(window, "Storage", {
    configurable: true,
    value: TestStorage,
  });
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: new TestStorage(),
  });
}

afterEach(() => {
  cleanup();
});
