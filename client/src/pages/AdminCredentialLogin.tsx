import { trpc } from "@/lib/trpc";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

export default function AdminCredentialLogin({ onSignedIn }: { onSignedIn: () => Promise<unknown> | void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  return <main className="admin-credential-login"><section aria-labelledby="admin-login-title"><div className="admin-login-mark"><Eye size={25} /></div><div className="admin-login-copy"><span><ShieldCheck size={14} /> Protected clinic workspace</span><h1 id="admin-login-title">Sign in to manage<br /><i>Saraswati Eye Care.</i></h1><p>Use the administrator email and password configured for this website. Your credentials are verified only by the server and are protected by rate limiting.</p></div><form onSubmit={submit}><label className="admin-login-field"><span><Mail size={16} /> Administrator email</span><input autoComplete="username" required type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="name@clinic.com" /></label><label className="admin-login-field"><span><LockKeyhole size={16} /> Password</span><span className="admin-password-control"><input autoComplete="current-password" required type={showPassword ? "text" : "password"} value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" /><button type="button" className="admin-password-toggle" onClick={() => setShowPassword(visible => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>{login.error && <p className="admin-login-error" role="alert">{login.error.message}</p>}<button className="admin-login-submit" type="submit" disabled={login.isPending}>{login.isPending ? "Signing in…" : "Sign in securely"}</button></form><p className="admin-login-status"><LockKeyhole size={13} /> Credentials are never stored in this browser.</p><p className="admin-login-note">This workspace is limited to authorised clinic administrators.</p><a className="admin-login-back" href="/">Return to clinic website</a></section></main>;
}
