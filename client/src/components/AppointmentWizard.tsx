import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, Check, ChevronLeft, Loader2, RefreshCw, ShieldCheck, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { isHumanVerificationComplete } from "@/lib/appointmentVerification";

const services = ["Cataract Services", "Retina Services", "Glaucoma Services", "Pediatric Ophthalmology", "Myopia Control Clinic", "Uveitis & Immunology", "Squint Surgery"];
const doctors = ["No preference", "Dr. Rajesh Garg", "Dr. Ajay Garg", "Dr. Khushboo Gupta", "Dr. Yogendra Gupta"];
const timeSlots = ["10:00 AM – 11:00 AM", "11:00 AM – 12:00 PM", "12:00 PM – 1:00 PM", "3:00 PM – 4:00 PM", "4:00 PM – 5:00 PM"];

const appointmentSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the patient’s full name"),
  age: z.number({ message: "Enter the patient’s age" }).finite("Enter the patient’s age").int().min(1, "Age must be at least 1").max(120, "Enter an age up to 120"),
  gender: z.enum(["female", "male", "other", "prefer-not-to-say"], { message: "Choose a gender" }),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email("Enter a valid email address").optional().or(z.literal("")),
  appointmentDate: z.string().min(1, "Choose an appointment date").refine(value => new Date(`${value}T12:00:00`).getDay() !== 0, "Sunday appointments are unavailable"),
  timeSlot: z.string().min(1, "Choose a time slot"),
  service: z.string().min(1, "Choose a service"),
  doctor: z.string().optional(),
  notes: z.string().max(1000, "Please keep notes under 1,000 characters").optional(),
});
type AppointmentValues = z.infer<typeof appointmentSchema>;
const fieldGroups: (Array<keyof AppointmentValues>)[] = [["fullName", "age", "gender", "phone", "email"], ["appointmentDate", "timeSlot", "service", "doctor", "notes"]];

export default function AppointmentWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [success, setSuccess] = useState(false);
  const [verificationAnswer, setVerificationAnswer] = useState("");
  const [verificationChecked, setVerificationChecked] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const minimumDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const form = useForm<AppointmentValues>({ resolver: zodResolver(appointmentSchema), mode: "onChange", defaultValues: { fullName: "", gender: undefined, phone: "", email: "", appointmentDate: "", timeSlot: "", service: "", doctor: "No preference", notes: "" } });
  const humanChallenge = trpc.appointment.verificationChallenge.useQuery(undefined, { enabled: step === 3, retry: false, staleTime: 0, refetchOnWindowFocus: false });
  const submitMutation = trpc.appointment.submit.useMutation({ onSuccess: () => setSuccess(true), onMutate: () => setSubmissionError(null), onError: error => { if (error.data?.code === "BAD_REQUEST") { setVerificationAnswer(""); setVerificationChecked(false); setVerificationError(error.message || "Human verification did not match. Refresh it and try again."); humanChallenge.refetch(); return; } setSubmissionError("We could not record your request. Please call +91 97292-36700."); } });
  const humanVerificationComplete = isHumanVerificationComplete(humanChallenge.data, verificationAnswer, verificationChecked);
  const isSubmitting = submitMutation.isPending;

  const next = async () => {
    if (step === 3) {
      const challenge = humanChallenge.data;
      if (!challenge || !humanVerificationComplete) { setVerificationError("Answer the check and tick the human verification box before submitting."); return; }
      return form.handleSubmit(values => submitMutation.mutate({ ...values, verificationProof: challenge.proof, verificationAnswer: verificationAnswer.trim() }))();
    }
    const valid = await form.trigger(fieldGroups[step - 1]);
    if (valid) setStep((step + 1) as 2 | 3);
  };

  const errors = form.formState.errors;
  const hasError = (key: keyof AppointmentValues) => Boolean(errors[key]);
  const inputClass = (key: keyof AppointmentValues) => `appointment-input ${hasError(key) ? "field-error" : ""}`;
  const FieldError = ({ name }: { name: keyof AppointmentValues }) => errors[name] ? <motion.small className="form-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}><AlertCircle size={12} />{errors[name]?.message}</motion.small> : null;
  const refreshChallenge = () => { setVerificationAnswer(""); setVerificationChecked(false); setVerificationError(null); setSubmissionError(null); humanChallenge.refetch(); };

  return <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.section className="appointment-modal appointment-upgrade" initial={{ opacity: 0, y: 24, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .98 }} transition={{ duration: .28 }} aria-label="Book an appointment">
      <button className="modal-close" onClick={onClose} aria-label="Close appointment form"><X size={19} /></button>
      {success ? <div className="success-state" role="status" aria-live="polite"><div className="success-icon"><Check size={32} /></div><div className="eyebrow"><span className="care-line" />Verified request received</div><h2>Your request is safely<br /><i>with our clinic team.</i></h2><p>Thank you. Your verified request is now in the protected clinic inbox. A care coordinator will call you to confirm a suitable appointment time.</p><button className="appointment-action" onClick={onClose}>Back to the website <ArrowRight size={16} /></button></div> : <>
        <header className="appointment-heading"><div className="eyebrow"><span className="care-line" />Appointment request</div><h2>Choose a time<br /><i>that works for you.</i></h2><p>It takes less than a minute. We’ll call to confirm your visit.</p></header>
        <div className="steps" aria-label={`Step ${step} of 3`}><span className={step >= 1 ? "active" : ""}>01 <b>Patient</b></span><i /><span className={step >= 2 ? "active" : ""}>02 <b>Schedule</b></span><i /><span className={step >= 3 ? "active" : ""}>03 <b>Review</b></span></div>
        <form onSubmit={event => { event.preventDefault(); next(); }} noValidate>
          <AnimatePresence mode="wait">
            {step === 1 && <motion.div key="patient" className="form-grid appointment-form-grid" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}><label>Full name<input className={inputClass("fullName")} placeholder="Patient’s name" {...form.register("fullName")} /><FieldError name="fullName" /></label><label>Age<input className={inputClass("age")} type="number" min="1" max="120" step="1" inputMode="numeric" placeholder="Age" {...form.register("age", { valueAsNumber: true })} /><FieldError name="age" /></label><label>Gender<select className={inputClass("gender")} {...form.register("gender")}><option value="">Choose gender</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option><option value="prefer-not-to-say">Prefer not to say</option></select><FieldError name="gender" /></label><label>Mobile number<input className={inputClass("phone")} inputMode="numeric" placeholder="10-digit mobile number" {...form.register("phone")} /><FieldError name="phone" /></label><label className="full">Email <span>(optional)</span><input className={inputClass("email")} type="email" placeholder="you@example.com" {...form.register("email")} /><FieldError name="email" /></label></motion.div>}
            {step === 2 && <motion.div key="schedule" className="form-grid appointment-form-grid" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}><label>Preferred date<input min={minimumDate} className={inputClass("appointmentDate")} type="date" {...form.register("appointmentDate")} /><FieldError name="appointmentDate" /></label><label>Preferred time<select className={inputClass("timeSlot")} {...form.register("timeSlot")}><option value="">Choose a slot</option>{timeSlots.map(slot => <option key={slot}>{slot}</option>)}</select><FieldError name="timeSlot" /></label><label className="full">Service<select className={inputClass("service")} {...form.register("service")}><option value="">What can we help with?</option>{services.map(service => <option key={service}>{service}</option>)}</select><FieldError name="service" /></label><label className="full">Preferred specialist <span>(optional)</span><select className={inputClass("doctor")} {...form.register("doctor")}>{doctors.map(doctor => <option key={doctor}>{doctor}</option>)}</select></label><label className="full">Notes <span>(optional)</span><textarea className={inputClass("notes")} rows={3} placeholder="Symptoms, reports, or anything else our team should know" {...form.register("notes")} /><FieldError name="notes" /></label><div className="form-note">Sunday appointments are unavailable. OPD consultation hours are 10 AM–1 PM.</div></motion.div>}
            {step === 3 && <motion.div key="review" className="review-summary detailed-review" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}><div><span>Patient</span><strong>{form.getValues("fullName") || "—"}</strong></div><div><span>When</span><strong>{form.getValues("appointmentDate") || "—"} · {form.getValues("timeSlot") || "—"}</strong></div><div><span>Care needed</span><strong>{form.getValues("service") || "—"}</strong></div><div><span>Specialist</span><strong>{form.getValues("doctor") || "No preference"}</strong></div><p>Complete the human check below. Verified requests are recorded for the clinic team in the secure admin panel.</p><section className="human-verification" aria-labelledby="human-verification-title"><div className="human-verification-head"><div><ShieldCheck size={18} /><div><span>Security check</span><strong id="human-verification-title">Confirm you are human</strong></div></div><button type="button" onClick={refreshChallenge} aria-label="Get a new human-verification question" disabled={humanChallenge.isFetching}><RefreshCw className={humanChallenge.isFetching ? "spin" : ""} size={15} /></button></div>{humanChallenge.isLoading || humanChallenge.isFetching && !humanChallenge.data ? <div className="human-verification-loading"><Loader2 className="spin" size={16} /> Preparing check…</div> : humanChallenge.data ? <><div className="human-verification-question"><p>{humanChallenge.data.prompt}</p><label>Answer<input value={verificationAnswer} onChange={event => { setVerificationAnswer(event.target.value.replace(/[^0-9]/g, "")); setVerificationChecked(false); setVerificationError(null); }} inputMode="numeric" autoComplete="off" placeholder="Enter answer" aria-describedby={verificationError ? "human-verification-error" : undefined} /></label></div><label className={`human-verification-checkbox ${verificationAnswer.trim() ? "" : "is-disabled"}`}><input type="checkbox" checked={verificationChecked} onChange={event => { setVerificationChecked(event.target.checked); setVerificationError(null); }} disabled={!verificationAnswer.trim()} /><span className="human-verification-checkmark"><Check size={15} /></span><span><strong>I’m not a bot</strong><small> I have answered the security check above.</small></span></label></> : <p className="human-verification-error">Unable to prepare the human check. Use refresh and try again.</p>}{verificationError && <p id="human-verification-error" className="human-verification-error"><AlertCircle size={14} />{verificationError}</p>}</section></motion.div>}
          </AnimatePresence>
          {submissionError && <div className="submission-error"><AlertCircle size={15} /> {submissionError}</div>}
          <div className="appointment-footer">{step > 1 ? <button type="button" className="back-btn" onClick={() => setStep((step - 1) as 1 | 2)}> <ChevronLeft size={15} /> Back</button> : <span>Fields validate as you type.</span>}<div className="appointment-submit-stack">{step === 3 && <p id="appointment-privacy-note" className="appointment-privacy-note">By submitting, you consent to the clinic using these details to arrange your appointment. Your request stays in the protected clinic inbox.</p>}{isSubmitting && <p className="appointment-submission-status" role="status" aria-live="polite"><Loader2 className="spin" size={14} /> Sending your verified request securely…</p>}<button type="submit" className="appointment-action" aria-describedby={step === 3 ? "appointment-privacy-note" : undefined} disabled={isSubmitting || step === 3 && !humanVerificationComplete}>{isSubmitting ? <><Loader2 className="spin" size={16} /> Sending request…</> : step === 3 && !humanVerificationComplete ? <>Complete human check <ShieldCheck size={16} /></> : step === 3 ? <>Submit verified request <ArrowRight size={16} /></> : <>Continue <ArrowRight size={16} /></>}</button></div></div>
        </form>
      </>}
    </motion.section>
  </motion.div>;
}
