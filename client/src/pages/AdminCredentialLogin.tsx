import { trpc } from "@/lib/trpc";
import { Eye, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

export default function AdminCredentialLogin({ onSignedIn }: { onSignedIn: () => Promise<unknown> | void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = trpc.auth.credentialLogin.useMutation({
    onSuccess: async () => {
      setPassword("");
      await onSignedIn();
    },
  });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    login.mutate({ email, password });
  };

  return <main className="admin-credential-login"><section><div className="admin-login-mark"><Eye size={25} /></div><div className="admin-login-copy"><span><ShieldCheck size={14} /> Protected clinic workspace</span><h1>Sign in to manage<br /><i>Saraswati Eye Care.</i></h1><p>Use the administrator email and password configured for this website. Your credentials are verified only by the server and are protected by rate limiting.</p></div><form onSubmit={submit}><label><Mail size={16} />Administrator email<input autoComplete="username" required type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="name@clinic.com" /></label><label><LockKeyhole size={16} />Password<input autoComplete="current-password" required type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" /></label>{login.error && <p className="admin-login-error" role="alert">{login.error.message}</p>}<button type="submit" disabled={login.isPending}>{login.isPending ? "Signing in…" : "Sign in securely"}</button></form><p className="admin-login-note">This workspace is limited to authorised clinic administrators.</p></section></main>;
}
