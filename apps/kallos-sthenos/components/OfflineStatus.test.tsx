import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OfflineStatus from "@/components/OfflineStatus";

const LAST_ONLINE_KEY = "kallos:last-online";

describe("OfflineStatus", () => {
  let online = true;

  beforeEach(() => {
    online = true;
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      get: () => online,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows offline banner and last online time from storage", () => {
    online = false;

    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key: string) => {
      if (key === LAST_ONLINE_KEY) return "2026-03-12T12:30:00.000Z";
      return null;
    });

    render(<OfflineStatus />);

    expect(screen.getByText(/offline mode/i)).toBeInTheDocument();
    expect(screen.getByText(/^last online:/i)).toBeInTheDocument();
    expect(screen.queryByText(/unknown/i)).not.toBeInTheDocument();
  });

  it("hides after coming back online and stores a new timestamp", async () => {
    online = false;
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(<OfflineStatus />);
    expect(screen.getByText(/offline mode/i)).toBeInTheDocument();

    online = true;
    window.dispatchEvent(new Event("online"));

    await waitFor(() => {
      expect(screen.queryByText(/offline mode/i)).not.toBeInTheDocument();
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      LAST_ONLINE_KEY,
      expect.any(String),
    );
  });
});
