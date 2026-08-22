import { describe, expect, it } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  createAppointmentRequest: vi.fn(),
  listAppointmentRequests: vi.fn(),
  updateAppointmentRequestStatus: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import { appRouter, appointmentInput } from "./routers";
import { createHumanVerificationChallenge } from "./humanVerification";

const makeValidAppointment = () => {
  const challenge = createHumanVerificationChallenge();
  const [first, second] = challenge.prompt.match(/(\d+) \+ (\d+)/)?.slice(1).map(Number) ?? [];
  return {
  fullName: "Aarav Sharma",
  age: 31,
  gender: "male" as const,
  phone: "9876543210",
  email: "aarav@example.com",
  appointmentDate: "2026-08-24",
  timeSlot: "10:00 AM – 11:00 AM",
  service: "Cataract Services",
  doctor: "No preference",
  notes: "First consultation",
  verificationProof: challenge.proof,
  verificationAnswer: String(first + second),
};
};

describe("appointment request validation", () => {
  it("accepts a complete valid appointment request", () => {
    const validAppointment = makeValidAppointment();
    expect(appointmentInput.parse(validAppointment)).toMatchObject(validAppointment);
  });

  it("rejects an invalid Indian mobile number", () => {
    const validAppointment = makeValidAppointment();
    expect(() => appointmentInput.parse({ ...validAppointment, phone: "12345" })).toThrow("10-digit Indian mobile number");
  });

  it("rejects an incomplete schedule selection", () => {
    const validAppointment = makeValidAppointment();
    expect(() => appointmentInput.parse({ ...validAppointment, timeSlot: "" })).toThrow("Choose a time slot");
  });
});

describe("appointment request submission", () => {
  beforeEach(() => {
    dbMocks.createAppointmentRequest.mockResolvedValue({ id: 1 });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("records a human-verified request in the admin workflow without email delivery", async () => {
    const validAppointment = makeValidAppointment();
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} },
      res: { clearCookie: vi.fn() },
    } as never);

    const result = await caller.appointment.submit({
      ...validAppointment,
      fullName: "Automated verification request",
      notes: "Non-persistent test exercised with a mocked database.",
    });

    expect(result).toEqual({ success: true });
    expect(dbMocks.createAppointmentRequest).toHaveBeenCalledWith(expect.objectContaining({
      fullName: "Automated verification request",
      deliveryStatus: "pending",
      appointmentDate: expect.any(Date),
    }));

    const stored = dbMocks.createAppointmentRequest.mock.calls[0][0];
    dbMocks.listAppointmentRequests.mockResolvedValue([{ id: 1, ...stored, status: "new", createdAt: new Date(), updatedAt: new Date() }]);
    const adminCaller = appRouter.createCaller({
      user: { role: "admin" },
      req: { protocol: "https", headers: {} },
      res: { clearCookie: vi.fn() },
    } as never);
    await expect(adminCaller.appointment.list()).resolves.toEqual([expect.objectContaining({ fullName: "Automated verification request", deliveryStatus: "pending" })]);
  });

  it("rejects an appointment that does not pass the mandatory human check", async () => {
    const validAppointment = makeValidAppointment();
    const caller = appRouter.createCaller({ user: null, req: { protocol: "https", headers: {} }, res: { clearCookie: vi.fn() } } as never);
    await expect(caller.appointment.submit({ ...validAppointment, verificationAnswer: "0" })).rejects.toThrow("Complete the human verification");
    expect(dbMocks.createAppointmentRequest).not.toHaveBeenCalled();
  });

  it("rejects non-administrators attempting to list appointment requests", async () => {
    const caller = appRouter.createCaller({
      user: { role: "user" },
      req: { protocol: "https", headers: {} },
      res: { clearCookie: vi.fn() },
    } as never);
    await expect(caller.appointment.list()).rejects.toThrow("required permission");
  });
});
