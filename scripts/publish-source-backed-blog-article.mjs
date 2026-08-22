const baseUrl = "http://127.0.0.1:3000";
const email = process.env.ADMIN_LOGIN_EMAIL;
const password = process.env.ADMIN_LOGIN_PASSWORD;
const article = {
  title: "How to Manage Dry Eyes in Air-Conditioned Environments During Summer",
  slug: "manage-dry-eyes-in-air-conditioned-environments",
  category: "Eye Health",
  excerpt: "Air conditioning can reduce indoor humidity and worsen dry-eye discomfort. Learn practical steps to support comfortable vision during the summer months.",
  content: "Dry eye syndrome occurs when tears do not provide enough lubrication for the eyes. Air conditioning can worsen symptoms by reducing humidity indoors and increasing tear evaporation.\n\nCommon symptoms can include stinging or burning, a scratchy sensation, light sensitivity, redness, fatigue, blurred vision, and difficulty wearing contact lenses.\n\nPosition yourself away from direct air vents, take regular visual breaks, stay hydrated, and use a humidifier where appropriate. Artificial tears may provide short-term comfort, but persistent symptoms should be reviewed by an eye-care professional.\n\nIf symptoms continue despite home care, book a consultation with Saraswati Eye Care Centre. Our specialists can recommend care appropriate to your eye-health needs.",
  authorName: "Dr. Khushboo Gupta",
  readingMinutes: 5,
  isFeatured: true,
  isPublished: true,
  publishedAt: "2026-03-08T09:00",
};

if (!email || !password) throw new Error("Administrator credentials are not configured");

async function trpcPost(path, payload, cookie) {
  const response = await fetch(`${baseUrl}/api/trpc/${path}?batch=1`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify({ 0: { json: payload } }),
  });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return { payload: await response.json(), cookie: response.headers.get("set-cookie")?.split(";")[0] };
}

async function trpcGet(path, cookie) {
  const input = encodeURIComponent(JSON.stringify({ 0: { json: null } }));
  const response = await fetch(`${baseUrl}/api/trpc/${path}?batch=1&input=${input}`, { headers: cookie ? { cookie } : {} });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
}

const login = await trpcPost("auth.credentialLogin", { email, password });
if (!login.cookie || !JSON.stringify(login.payload).includes('"success":true')) throw new Error("Unable to establish admin session");
const adminPosts = await trpcGet("blog.listAdmin", login.cookie);
const adminJson = JSON.stringify(adminPosts);
if (!adminJson.includes(article.slug)) {
  const created = await trpcPost("blog.create", article, login.cookie);
  if (!JSON.stringify(created.payload).includes('"result"')) throw new Error("Admin article creation did not succeed");
}
const publicPosts = await trpcGet("blog.listPublished");
if (!JSON.stringify(publicPosts).includes(article.slug)) throw new Error("Published article is not available to the homepage feed");
console.log("Source-backed clinic article is published and available to the homepage blog section.");
