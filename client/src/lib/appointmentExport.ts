import type { AppointmentFilterRecord } from "./appointmentFilters";

type ExportableAppointment = AppointmentFilterRecord & {
  age: number;
  gender: string;
  notes: string | null;
};

function csvCell(value: unknown) {
  const raw = String(value ?? "").replace(/[\r\n]+/g, " ");
  const safe = /^[=+\-@]/.test(raw.trim()) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
}

function isoDate(value: Date | string) {
  return new Date(value).toISOString().slice(0, 10);
}

export function appointmentCsv(records: ExportableAppointment[]) {
  const header = ["Patient", "Age", "Gender", "Phone", "Email", "Date", "Time", "Service", "Specialist", "Status", "Notes"];
  const rows = records.map(record => [record.fullName, record.age, record.gender, record.phone, record.email, isoDate(record.appointmentDate), record.timeSlot, record.service, record.doctor || "No preference", record.status, record.notes || ""]);
  return `\uFEFF${[header, ...rows].map(row => row.map(csvCell).join(",")).join("\r\n")}`;
}
