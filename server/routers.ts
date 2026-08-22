import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { createHumanVerificationChallenge, verifyHumanVerification } from "./humanVerification";
import {
  createAppointmentRequest,
  createBlogPost,
  deleteBlogPost,
  getPublishedBlogPostBySlug,
  listAppointmentRequests,
  listAdminBlogPosts,
  listPublishedBlogPosts,
  upsertUser,
  updateBlogPost,
  updateAppointmentRequestStatus,
} from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { canAttemptAdminLogin, clearAdminLoginAttempts, recordFailedAdminLogin, verifyAdminCredentials } from "./adminCredentials";

const ADMIN_SESSION_MS = 12 * 60 * 60 * 1000;
const CREDENTIAL_ADMIN_OPEN_ID = "credential_admin";
const credentialLoginInput = z.object({
  email: z.string().trim().email("Enter a valid administrator email"),
  password: z.string().min(1, "Enter the administrator password").max(256),
});

export const appointmentInput = z.object({
  fullName: z.string().trim().min(2, "Please enter the patient’s full name").max(160),
  age: z.coerce.number().int().min(1, "Enter an age from 1 to 120").max(120),
  gender: z.enum(["female", "male", "other", "prefer-not-to-say"]),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email("Enter a valid email address").optional().or(z.literal("")),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose an appointment date"),
  timeSlot: z.string().min(1, "Choose a time slot"),
  service: z.string().min(1, "Choose a service"),
  doctor: z.string().optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  verificationProof: z.string().min(24, "Complete the human verification").max(256),
  verificationAnswer: z.string().trim().regex(/^\d{1,3}$/, "Complete the human verification"),
});

const appointmentStatus = z.enum(["new", "contacted", "confirmed", "completed", "cancelled"]);
const blogSlug = z.string().trim().min(3).max(240).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only");
export const blogPostInput = z.object({
  title: z.string().trim().min(8, "Enter a descriptive title").max(220),
  slug: blogSlug,
  category: z.string().trim().min(2).max(80),
  excerpt: z.string().trim().min(20, "Write a short article summary").max(1200),
  content: z.string().trim().min(80, "Write the article content").max(30000),
  thumbnailUrl: z.string().trim().url("Enter a complete image URL").max(2048).optional().or(z.literal("")),
  authorName: z.string().trim().min(2).max(160),
  readingMinutes: z.coerce.number().int().min(1).max(60),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  publishedAt: z.string().min(10).max(40),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    credentialLogin: publicProcedure.input(credentialLoginInput).mutation(async ({ ctx, input }) => {
      const forwardedFor = ctx.req.headers["x-forwarded-for"];
      const requestIp = typeof forwardedFor === "string" ? forwardedFor.split(",")[0].trim() : ctx.req.ip || "unknown";
      const rateKey = `${requestIp}:${input.email.trim().toLowerCase()}`;
      if (!canAttemptAdminLogin(rateKey)) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Too many sign-in attempts. Please try again in 15 minutes." });
      }
      if (!verifyAdminCredentials(input.email, input.password)) {
        recordFailedAdminLogin(rateKey);
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid administrator email or password." });
      }
      clearAdminLoginAttempts(rateKey);
      await upsertUser({
        openId: CREDENTIAL_ADMIN_OPEN_ID,
        name: "Clinic Administrator",
        email: input.email.trim().toLowerCase(),
        loginMethod: "email-password",
        role: "admin",
        lastSignedIn: new Date(),
      });
      const token = await sdk.createSessionToken(CREDENTIAL_ADMIN_OPEN_ID, { name: "Clinic Administrator", expiresInMs: ADMIN_SESSION_MS });
      ctx.res.cookie(COOKIE_NAME, token, { ...getSessionCookieOptions(ctx.req), maxAge: ADMIN_SESSION_MS });
      return { success: true } as const;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  appointment: router({
    verificationChallenge: publicProcedure.query(() => createHumanVerificationChallenge()),
    submit: publicProcedure.input(appointmentInput).mutation(async ({ input }) => {
      const { verificationProof, verificationAnswer, ...appointment } = input;
      if (!verifyHumanVerification(verificationProof, verificationAnswer)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Complete the human verification before submitting your appointment request." });
      }
      await createAppointmentRequest({
        ...appointment,
        appointmentDate: new Date(`${appointment.appointmentDate}T00:00:00.000Z`),
        email: appointment.email || null,
        doctor: appointment.doctor || null,
        notes: appointment.notes || null,
        deliveryStatus: "pending",
      });
      return { success: true } as const;
    }),
    list: adminProcedure.query(() => listAppointmentRequests()),
    updateStatus: adminProcedure
      .input(z.object({ id: z.number().int().positive(), status: appointmentStatus }))
      .mutation(({ input }) => updateAppointmentRequestStatus(input.id, input.status)),
  }),
  blog: router({
    listPublished: publicProcedure.query(() => listPublishedBlogPosts()),
    bySlug: publicProcedure.input(z.object({ slug: blogSlug })).query(({ input }) => getPublishedBlogPostBySlug(input.slug)),
    listAdmin: adminProcedure.query(() => listAdminBlogPosts()),
    create: adminProcedure.input(blogPostInput).mutation(({ input }) =>
      createBlogPost({
        ...input,
        thumbnailUrl: input.thumbnailUrl || null,
        isFeatured: input.isFeatured ? 1 : 0,
        isPublished: input.isPublished ? 1 : 0,
        publishedAt: new Date(input.publishedAt),
      }),
    ),
    update: adminProcedure
      .input(blogPostInput.extend({ id: z.number().int().positive() }))
      .mutation(({ input }) => {
        const { id, ...post } = input;
        return updateBlogPost(id, {
          ...post,
          thumbnailUrl: post.thumbnailUrl || null,
          isFeatured: post.isFeatured ? 1 : 0,
          isPublished: post.isPublished ? 1 : 0,
          publishedAt: new Date(post.publishedAt),
        });
      }),
    delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteBlogPost(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
