import React, { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

(globalThis as { React?: typeof React }).React = React;

const mockRecord = vi.hoisted(() => ({
  id: 501,
  fullName: "Verified browser request",
  age: 34,
  gender: "female",
  phone: "9876543210",
  email: "verified@example.com",
  appointmentDate: new Date("2026-08-24T00:00:00.000Z"),
  timeSlot: "10:00 AM – 11:00 AM",
  service: "Cataract Services",
  doctor: "No preference",
  notes: null,
  status: "new" as const,
  deliveryStatus: "pending" as const,
  createdAt: new Date("2026-08-22T00:00:00.000Z"),
  updatedAt: new Date("2026-08-22T00:00:00.000Z"),
}));
const accessState = vi.hoisted(() => ({ role: "admin" }));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    appointment: {
      list: { useQuery: () => ({ data: [mockRecord], isLoading: false, isError: false, refetch: vi.fn() }) },
      updateStatus: { useMutation: () => ({ isPending: false, mutate: vi.fn() }) },
    },
    useUtils: () => ({ appointment: { list: { invalidate: vi.fn() } } }),
  },
}));

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ user: { role: accessState.role } }) }));
vi.mock("@/components/DashboardLayout", () => ({ default: ({ children }: { children: any }) => children }));
vi.mock("wouter", () => ({ useLocation: () => ["/admin"] }));

import AdminPage from "../client/src/pages/AdminPage";

describe("protected appointment administration UI", () => {
  it("renders a verified request in the protected appointment table without a live database write", () => {
    const markup = renderToStaticMarkup(createElement(AdminPage));
    expect(markup).toContain("Verified browser request");
    expect(markup).toContain("Cataract Services");
    expect(markup).toContain("Website inbox only");
    expect(markup).toContain("Search appointments");
    expect(markup).toContain("All statuses");
    expect(markup).toContain("All services");
    expect(markup).toContain("Export CSV");
    expect(markup).not.toContain("Email delivery requires");
  });

  it("shows a restricted workspace and no CSV export control to non-administrators", () => {
    accessState.role = "user";
    try {
      const markup = renderToStaticMarkup(createElement(AdminPage));
      expect(markup).toContain("Management access is restricted");
      expect(markup).not.toContain("Export CSV");
      expect(markup).not.toContain("Verified browser request");
    } finally {
      accessState.role = "admin";
    }
  });
});
