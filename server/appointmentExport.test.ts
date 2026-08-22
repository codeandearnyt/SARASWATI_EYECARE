import { describe, expect, it } from "vitest";
import { appointmentCsv } from "../client/src/lib/appointmentExport";

describe("appointment CSV export", () => {
  it("exports exactly the supplied filtered records with spreadsheet-safe values", () => {
    const csv = appointmentCsv([{ fullName: "=Untrusted", age: 42, gender: "female", phone: "9876543210", email: "patient@example.test", appointmentDate: "2026-08-24", timeSlot: "10:00 AM – 11:00 AM", service: "Cataract Services", doctor: "Dr. Rajesh Garg", status: "confirmed", notes: "First line\nSecond line" }]);
    expect(csv).toContain("\"'=Untrusted\"");
    expect(csv).toContain("\"First line Second line\"");
    expect(csv.split("\r\n")).toHaveLength(2);
  });
});
