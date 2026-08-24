const baseUrl = "http://127.0.0.1:3000";
const email = process.env.ADMIN_LOGIN_EMAIL;
const password = process.env.ADMIN_LOGIN_PASSWORD;

if (!email || !password) {
  throw new Error("Administrator credentials are not configured");
}

const loginInput = encodeURIComponent(JSON.stringify({ 0: { json: { email, password } } }));
const loginResponse = await fetch(`${baseUrl}/api/trpc/auth.credentialLogin?batch=1`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ 0: { json: { email, password } } }),
});

if (!loginResponse.ok) {
  throw new Error(`Credential login endpoint returned ${loginResponse.status}`);
}

const loginPayload = await loginResponse.json();
const sessionCookie = loginResponse.headers.get("set-cookie")?.split(";")[0];
if (!sessionCookie || !JSON.stringify(loginPayload).includes('"success":true')) {
  throw new Error("Credential login did not return a successful protected session");
}

const listInput = encodeURIComponent(JSON.stringify({ 0: { json: null } }));
const protectedResponse = await fetch(`${baseUrl}/api/trpc/blog.listAdmin?batch=1&input=${listInput}`, {
  headers: { cookie: sessionCookie },
});

if (!protectedResponse.ok) {
  throw new Error(`Protected blog endpoint returned ${protectedResponse.status}`);
}

const protectedPayload = await protectedResponse.json();
if (!JSON.stringify(protectedPayload).includes('"result"')) {
  throw new Error("Protected blog endpoint did not authorize the credential session");
}

console.log("Credential sign-in and protected blog authorization verified without exposing secret values.");
