import { afterEach, describe, expect, it, vi } from "vitest";

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
}));

vi.mock("./db", () => dbMocks);

import { appRouter, blogPostInput } from "./routers";

const validPost = {
  title: "How to Protect Your Eyes During the Summer Season",
  slug: "protect-your-eyes-during-summer",
  category: "Eye Health",
  excerpt: "Practical, clinically responsible guidance for staying comfortable and protecting your vision during the summer months.",
  content: "Protecting your eyes during summer starts with regular breaks, appropriate sun protection, and a timely clinical review when symptoms persist.\n\nThe clinic team can advise on care that suits your personal eye-health needs.",
  authorName: "Dr. Rajesh Garg",
  readingMinutes: 4,
  isFeatured: true,
  isPublished: true,
  publishedAt: "2026-08-22T09:00",
};

const adminContext = {
  user: { id: 1, openId: "owner", name: "Owner", email: "owner@example.com", loginMethod: "manus", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: { protocol: "https", headers: {} },
  res: { clearCookie: vi.fn() },
} as never;

afterEach(() => vi.clearAllMocks());

describe("blog validation and secured CRUD", () => {
  it("accepts a publishable clinic blog post with a safe slug", () => {
    expect(blogPostInput.parse(validPost)).toMatchObject(validPost);
  });

  it("accepts an optional complete thumbnail URL and passes it to protected persistence", async () => {
    const postWithThumbnail = { ...validPost, thumbnailUrl: "https://images.example.com/dry-eye-care.jpg" };
    expect(blogPostInput.parse(postWithThumbnail)).toMatchObject(postWithThumbnail);
    const caller = appRouter.createCaller(adminContext);
    await caller.blog.create(postWithThumbnail);
    expect(dbMocks.createBlogPost).toHaveBeenCalledWith(expect.objectContaining({ thumbnailUrl: postWithThumbnail.thumbnailUrl }));
  });

  it("rejects an unsafe blog slug", () => {
    expect(() => blogPostInput.parse({ ...validPost, slug: "Unsafe slug!" })).toThrow("lowercase letters, numbers, and hyphens");
  });

  it("allows only an administrator to create a post and persists publication flags safely", async () => {
    const caller = appRouter.createCaller(adminContext);
    await caller.blog.create(validPost);
    expect(dbMocks.createBlogPost).toHaveBeenCalledWith(expect.objectContaining({
      slug: validPost.slug,
      isFeatured: 1,
      isPublished: 1,
      publishedAt: expect.any(Date),
    }));
  });

  it("rejects non-administrator access to the management list", async () => {
    const caller = appRouter.createCaller({ ...adminContext, user: { ...adminContext.user, role: "user" } });
    await expect(caller.blog.listAdmin()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("exposes only the published collection through the public blog procedure", async () => {
    dbMocks.listPublishedBlogPosts.mockResolvedValue([{ id: 1, title: validPost.title }]);
    const caller = appRouter.createCaller({ ...adminContext, user: null });
    await expect(caller.blog.listPublished()).resolves.toEqual([{ id: 1, title: validPost.title }]);
  });
});
