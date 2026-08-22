import { describe, expect, it } from "vitest";
import { isAdminHashRoute, legacyPublicHashPath } from "../client/src/lib/publicRoutes";
import { filterAppointments } from "../client/src/lib/appointmentFilters";

describe("clean public routing helpers", () => {
  it("reserves hash navigation for protected admin routes and migrates public legacy hashes", () => {
    expect(isAdminHashRoute("#/admin")).toBe(true);
    expect(isAdminHashRoute("#/admin/blog")).toBe(true);
    expect(isAdminHashRoute("#/about")).toBe(false);
    expect(legacyPublicHashPath("#/about")).toBe("/about");
    expect(legacyPublicHashPath("#/")).toBe("/");
  });
});

describe("appointment discovery filters", () => {
  const records = [{ fullName: "Asha Gupta", phone: "9876543210", email: "asha@example.com", service: "Cataract Services", doctor: "Dr. Rajesh Garg", timeSlot: "10:00 AM – 11:00 AM", status: "new", appointmentDate: "2026-08-24" }, { fullName: "Nitin Sharma", phone: "9123456789", email: null, service: "Retina Services", doctor: "Dr. Ajay Garg", timeSlot: "3:00 PM – 4:00 PM", status: "confirmed", appointmentDate: "2026-08-25" }];
  it("finds requests by search text and combines status, service, and date filters", () => {
    expect(filterAppointments(records, { query: "asha", status: "all", service: "all", date: "" })).toHaveLength(1);
    expect(filterAppointments(records, { query: "", status: "confirmed", service: "Retina Services", date: "2026-08-25" })).toHaveLength(1);
    expect(filterAppointments(records, { query: "", status: "new", service: "Retina Services", date: "" })).toHaveLength(0);
  });
});
