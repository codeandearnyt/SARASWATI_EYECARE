export type AppointmentFilterRecord = {
  fullName: string;
  phone: string;
  email: string | null;
  service: string;
  doctor: string | null;
  timeSlot: string;
  status: string;
  appointmentDate: Date | string;
};

export type AppointmentFilters = {
  query: string;
  status: string;
  service: string;
  date: string;
};

export function filterAppointments<T extends AppointmentFilterRecord>(records: T[], filters: AppointmentFilters) {
  const normalizedQuery = filters.query.trim().toLowerCase();
  return records.filter(record => {
    const appointmentDate = new Date(record.appointmentDate).toISOString().slice(0, 10);
    const searchable = [record.fullName, record.phone, record.email || "", record.service, record.doctor || "", record.timeSlot].join(" ").toLowerCase();
    return (!normalizedQuery || searchable.includes(normalizedQuery))
      && (filters.status === "all" || record.status === filters.status)
      && (filters.service === "all" || record.service === filters.service)
      && (!filters.date || appointmentDate === filters.date);
  });
}
