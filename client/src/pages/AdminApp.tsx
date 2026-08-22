import { useAuth } from "@/_core/hooks/useAuth";
import AdminPage from "./AdminPage";
import AdminCredentialLogin from "./AdminCredentialLogin";

export default function AdminApp() {
  const { user, loading, refresh } = useAuth();
  if (loading) return <div className="admin-auth-loading" role="status">Opening secure workspace…</div>;
  if (!user) return <AdminCredentialLogin onSignedIn={() => refresh()} />;
  return <AdminPage />;
}
