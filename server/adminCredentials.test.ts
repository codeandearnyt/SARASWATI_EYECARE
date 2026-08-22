import { describe, expect, it, vi } from "vitest";
import { areAdminCredentialsConfigured, verifyAdminCredentials } from "./adminCredentials";

const dbMocks = vi.hoisted(() => ({
  createAppointmentRequest: vi.fn(),
  listAppointmentRequests: vi.fn(),
  updateAppointmentRequestStatus: vi.fn(),
  createBlogPost: vi.fn(),
  deleteBlogPost: vi.fn(),
  getPublishedBlogPostBySlug: vi.fn(),
  listAdminBlogPosts: vi.fn(),
  listPublishedBlogPosts: vi.fn(),
  updateBlogPost: vi.fn(),
  upsertUser: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import { appRouter } from "./routers";

describe("configured administrator credentials", () => {
  it("accepts the configured email and password only on the server", () => {
    const email = process.env.ADMIN_LOGIN_EMAIL;
    const password = process.env.ADMIN_LOGIN_PASSWORD;
    expect(email).toBeTruthy();
    expect(password).toBeTruthy();
    expect(areAdminCredentialsConfigured()).toBe(true);
    expect(verifyAdminCredentials(email!, password!)).toBe(true);
  });

  it("accepts configured credentials through the admin login endpoint and issues the secure session cookie", async () => {
    const email = process.env.ADMIN_LOGIN_EMAIL!;
    const password = process.env.ADMIN_LOGIN_PASSWORD!;
    const cookie = vi.fn();
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {}, ip: "127.0.0.1" },
      res: { cookie, clearCookie: vi.fn() },
    } as never);

    await expect(caller.auth.credentialLogin({ email, password })).resolves.toEqual({ success: true });
    expect(dbMocks.upsertUser).toHaveBeenCalledWith(expect.objectContaining({ role: "admin", loginMethod: "email-password" }));
    expect(cookie).toHaveBeenCalledWith(expect.any(String), expect.any(String), expect.objectContaining({ httpOnly: true, secure: true }));
  });

  it("rejects an incorrect password without issuing an administrator session", async () => {
    const cookie = vi.fn();
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {}, ip: "127.0.0.2" },
      res: { cookie, clearCookie: vi.fn() },
    } as never);

    await expect(caller.auth.credentialLogin({ email: process.env.ADMIN_LOGIN_EMAIL!, password: "incorrect-password" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect(cookie).not.toHaveBeenCalled();
  });
});
