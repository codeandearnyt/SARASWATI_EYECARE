import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { appointmentCsv } from "@/lib/appointmentExport";
import { filterAppointments } from "@/lib/appointmentFilters";
import { BellRing, CalendarClock, CheckCircle2, Clock3, Download, Loader2, RefreshCw, Search, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

const statusLabel = { new: "New", contacted: "Contacted", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled" } as const;
type AppointmentStatus = keyof typeof statusLabel;

function AccessRestricted() { return <div className="admin-restricted"><ShieldCheck size={30} /><h1>Management access is restricted.</h1><p>Sign in with the project owner account to review and manage patient appointment requests.</p></div>; }

export function AppointmentManagement() {
  const { user } = useAuth();
  const appointments = trpc.appointment.list.useQuery(undefined, { retry: false });
  const utils = trpc.useUtils();
  const updateStatus = trpc.appointment.updateStatus.useMutation({ onSuccess: () => utils.appointment.list.invalidate() });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | AppointmentStatus>("all");
  const [service, setService] = useState("all");
  const [date, setDate] = useState("");
  if (user?.role !== "admin") return <AccessRestricted />;

  const records = appointments.data ?? [];
  const services = useMemo(() => Array.from(new Set(records.map(record => record.service))).sort(), [records]);
  const filteredRecords = useMemo(() => filterAppointments(records, { query, status, service, date }), [records, query, status, service, date]);
  const newCount = records.filter(record => record.status === "new").length;
  const confirmedCount = records.filter(record => record.status === "confirmed").length;
  const clearFilters = () => { setQuery(""); setStatus("all"); setService("all"); setDate(""); };
  const filtersActive = Boolean(query || status !== "all" || service !== "all" || date);
  const exportFilteredRecords = () => {
    const blob = new Blob([appointmentCsv(filteredRecords)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `saraswati-appointments-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return <div className="admin-shell"><div className="admin-topline"><div><p className="admin-kicker">Saraswati Eye Care Centre</p><h1>Appointment <i>management</i></h1><span>Human-verified website requests are stored securely and ordered by the latest submission.</span></div><div className="appointment-header-actions">{newCount > 0 && <span className="new-verified-badge" role="status" aria-live="polite" aria-label={`${newCount} new verified request${newCount === 1 ? "" : "s"} in inbox`}><BellRing size={15} /><strong>{newCount}</strong> new verified request{newCount === 1 ? "" : "s"}</span>}<button onClick={() => appointments.refetch()} className="admin-refresh"><RefreshCw size={15} /> Refresh</button><button type="button" className="appointment-export" onClick={exportFilteredRecords} disabled={filteredRecords.length === 0}><Download size={15} /> Export CSV</button></div></div><div className="admin-stat-grid"><article><CalendarClock size={18} /><span>New requests</span><strong>{newCount}</strong></article><article><CheckCircle2 size={18} /><span>Confirmed</span><strong>{confirmedCount}</strong></article><article><Clock3 size={18} /><span>Total requests</span><strong>{records.length}</strong></article></div><section className="admin-table-card"><div className="admin-table-head"><div><h2>Patient requests</h2><p>Review each verified website request and record the most recent follow-up status.</p></div><span className="delivery-note"><ShieldCheck size={14} /> Website inbox only · no email delivery</span></div><div className="appointment-discovery" aria-label="Search and filter appointments"><label className="appointment-search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search name, phone, service, or specialist" aria-label="Search appointments" /></label><div className="appointment-filter-controls"><label><SlidersHorizontal size={14} /><span>Status</span><select value={status} onChange={event => setStatus(event.target.value as "all" | AppointmentStatus)}><option value="all">All statuses</option>{(Object.keys(statusLabel) as AppointmentStatus[]).map(item => <option key={item} value={item}>{statusLabel[item]}</option>)}</select></label><label><span>Service</span><select value={service} onChange={event => setService(event.target.value)}><option value="all">All services</option>{services.map(item => <option key={item} value={item}>{item}</option>)}</select></label><label><span>Date</span><input type="date" value={date} onChange={event => setDate(event.target.value)} /></label>{filtersActive && <button type="button" onClick={clearFilters}><X size={14} /> Clear</button>}</div></div><div className="appointment-filter-result" aria-live="polite">Showing <strong>{filteredRecords.length}</strong> of {records.length} request{records.length === 1 ? "" : "s"}. Export contains only the shown records.</div>{appointments.isLoading ? <div className="admin-loading"><Loader2 className="spin" size={20} /> Loading appointment requests…</div> : appointments.isError ? <div className="admin-loading error">Unable to load appointments. Sign in with an administrator account and try again.</div> : records.length === 0 ? <div className="admin-loading">No appointment requests yet. Human-verified website submissions will appear here.</div> : filteredRecords.length === 0 ? <div className="admin-loading">No requests match these filters. Clear the filters or adjust your search.</div> : <div className="admin-table-wrap"><table><thead><tr><th>Patient</th><th>Visit preference</th><th>Care needed</th><th>Contact</th><th>Status</th></tr></thead><tbody>{filteredRecords.map(record => <tr key={record.id}><td><strong>{record.fullName}</strong><span>{record.age} years · {record.gender}</span></td><td><strong>{new Date(record.appointmentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong><span>{record.timeSlot}</span></td><td><strong>{record.service}</strong><span>{record.doctor || "No preference"}</span></td><td><strong>{record.phone}</strong><span>{record.email || "No email"}</span></td><td><select value={record.status} disabled={updateStatus.isPending} onChange={event => updateStatus.mutate({ id: record.id, status: event.target.value as AppointmentStatus })}>{(Object.keys(statusLabel) as AppointmentStatus[]).map(item => <option key={item} value={item}>{statusLabel[item]}</option>)}</select></td></tr>)}</tbody></table></div>}</section></div>;
}
