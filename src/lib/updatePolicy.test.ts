import { describe, expect, it } from "vitest";
import { UPDATE_ORIGIN, compareVersions, needsNewApk, shouldUpdate } from "./updatePolicy";

const ok = { version: "0.3.0", build: 60, url: `${UPDATE_ORIGIN}updates/bundle-60.zip`, checksum: "0a1b2c3d", minNative: "0.3.0" };

describe("compareVersions", () => {
  it("compares numerically, part by part", () => {
    expect(compareVersions("0.10.0", "0.9.2")).toBe(1);
    expect(compareVersions("0.3", "0.3.0")).toBe(0);
    expect(compareVersions("0.2.9", "0.3.0")).toBe(-1);
    expect(compareVersions("0.3.0-dev", "0.3.0")).toBe(0);
  });
});

describe("shouldUpdate", () => {
  it("takes a newer bundle from our address on a new enough shell", () => {
    expect(shouldUpdate(ok, 59, "0.3.0")).toBe(true);
    expect(shouldUpdate(ok, 0, "0.4.1")).toBe(true);
    expect(shouldUpdate({ ...ok, checksum: "a".repeat(64) }, 0, "0.3.0")).toBe(true);
  });
  it("skips the same or an older build", () => {
    expect(shouldUpdate(ok, 60, "0.3.0")).toBe(false);
    expect(shouldUpdate(ok, 61, "0.3.0")).toBe(false);
  });
  it("skips when the installed shell is older than the bundle needs", () => {
    expect(shouldUpdate({ ...ok, minNative: "0.4.0" }, 1, "0.3.0")).toBe(false);
  });
  it("ignores other addresses and broken manifests", () => {
    expect(shouldUpdate({ ...ok, url: "https://example.com/bundle.zip" }, 1, "0.3.0")).toBe(false);
    expect(shouldUpdate({ ...ok, checksum: "xyz" }, 1, "0.3.0")).toBe(false);
    expect(shouldUpdate({ ...ok, build: "61" }, 1, "0.3.0")).toBe(false);
    expect(shouldUpdate(null, 1, "0.3.0")).toBe(false);
  });
});

describe("needsNewApk", () => {
  it("asks for the new APK only when the shell is older than the minimum", () => {
    expect(needsNewApk("0.3.0", "0.4.0")).toBe(true);
    expect(needsNewApk("0.4.0", "0.4.0")).toBe(false);
    expect(needsNewApk("0.3.0", "")).toBe(false);
    expect(needsNewApk("0.3.0", undefined)).toBe(false);
    expect(needsNewApk("0.3.0", "soon")).toBe(false);
  });
});
