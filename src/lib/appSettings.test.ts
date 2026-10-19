import { describe, expect, it } from "vitest";
import { parseAppSettings } from "./appSettings";

describe("parseAppSettings", () => {
  it("reads the three text fields of a Firestore REST document", () => {
    const doc = { fields: { notice_en: { stringValue: " Service notice " }, notice_bn: { stringValue: "নোটিশ" }, min_version: { stringValue: "0.4.0" }, updated_by: { stringValue: "x" } } };
    expect(parseAppSettings(doc)).toEqual({ notice_en: "Service notice", notice_bn: "নোটিশ", min_version: "0.4.0" });
  });
  it("treats missing, empty or odd documents as no settings", () => {
    const none = { notice_en: "", notice_bn: "", min_version: "" };
    expect(parseAppSettings(null)).toEqual(none);
    expect(parseAppSettings({})).toEqual(none);
    expect(parseAppSettings({ fields: { notice_en: { integerValue: "5" } } })).toEqual(none);
  });
});
