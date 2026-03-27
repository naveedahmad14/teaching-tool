import { vi } from "vitest";

/** Minimal Next.js API response mock with chainable status().json() */
export function createMockRes() {
  const res = {
    status: vi.fn(function status() {
      return res;
    }),
    json: vi.fn(function json() {
      return res;
    }),
  };
  return res;
}

export function getJsonPayload(res) {
  const calls = res.json.mock.calls;
  return calls.length ? calls[calls.length - 1][0] : undefined;
}

export function getStatusCode(res) {
  const calls = res.status.mock.calls;
  return calls.length ? calls[calls.length - 1][0] : undefined;
}
