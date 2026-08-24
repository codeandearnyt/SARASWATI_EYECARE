/* Quiet Clinical Editorial: asymmetric editorial layout, teal care-line motifs, restrained motion, and thumb-first actions. */
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowUpRight, CalendarDays, Check, ChevronDown, Clock3, Eye, MapPin, MessageCircle, Phone, Play, ShieldCheck, Sparkles, Star, Stethoscope, Users, X } from "lucide-react";
import { toast } from "sonner";
import ClinicalOrbit from "@/components/ClinicalOrbit";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

const AppointmentWizard = lazy(() => import("@/components/AppointmentFlow"));
const HomeBlogFeature = lazy(() => import("@/components/HomeBlogFeature"));

function MotionDiv({ initial: _initial, animate: _animate, exit: _exit, transition: _transition, whileInView: _whileInView, viewport: _viewport, ...props }: React.HTMLAttributes<HTMLDivElement> & { initial?: unknown; animate?: unknown; exit?: unknown; transition?: unknown; whileInView?: unknown; viewport?: unknown }) {
  return <div {...props} />;
}

const motion = { div: MotionDiv };

function AnimatePresence({ children }: { children: React.ReactNode; mode?: string }) {
  return <>{children}</>;
}
const heroImg = "/manus-storage/clinic-frontimage-mobile_241c8ce9.webp";
const exteriorImg = "/manus-storage/clinic-reception-optimized_f21c590d.webp";
const equipmentImg = "/manus-storage/clinic-machine-optimized_76e06cce.webp";
const refractionRoomImg = "/manus-storage/clinic-refraction-room-optimized_ca9c5c9b.webp";
const fullLogoImg = "/manus-storage/clinic-logo-user-supplied-final_13e2373e.avif";
const teamImg = "/manus-storage/clinic-team-gathering_ac1cb38e.webp";

const services = [
  ["01", "Cataract Services", "Advanced, safe, and customized cataract treatment using state-of-the-art technology.", "Dr. Rajesh Garg"],
  ["02", "Retina Services", "Diagnosis, treatment, and long-term care for vitreoretinal conditions affecting the light-sensitive layer.", "Dr. Ajay Garg"],
  ["03", "Glaucoma Services", "Early detection, precise diagnosis, and personalized treatment to help preserve vision.", "Dr. Rajesh Garg"],
  ["04", "Pediatric Ophthalmology", "Specialized care for infants, children, and adolescents with patience and family-focused guidance.", "Dr. Khushboo Gupta"],
  ["05", "Myopia Control Clinic", "Specialized diagnosis, treatment, and management for myopia, or nearsightedness.", "Dr. Khushboo Gupta"],
  ["06", "Uveitis & Ocular Immunology", "Specialized care for inflammatory eye disease and immune system-related eye conditions.", "Dr. Rajesh Garg"],
  ["07", "Squint Surgery", "Advanced strabismus correction for children and adults with expert follow-up care.", "Dr. Khushboo Gupta"],
];
const facilityPhotos = [
  ["Hospital exterior", "The original Saraswati Eye Care Centre façade in Jind.", heroImg],
  ["Nursing station", "The centre’s nursing and reception area.", exteriorImg],
  ["AI-Based Optical Biometer", "Original-site facility equipment imagery.", equipmentImg],
  ["Refraction room", "Original-site refraction room photography.", refractionRoomImg],
];
const doctors = [
  ["Dr. Rajesh Garg", "Founder & Chairman", "Anterior Segment & Cataract Surgeon", "17+ yrs", "RG", "/manus-storage/doctor-rajesh-supplied_03d8ba3d.avif"],
  ["Dr. Ajay Garg", "Vice Chairman", "Vitreo-Retinal Surgery", "10+ yrs", "AG", "/manus-storage/doctor-ajay-supplied_94c09fc7.avif"],
  ["Dr. Khushboo Gupta", "Pediatric Ophthalmologist", "Pediatric Eye Care & Squint Surgery", "10+ yrs", "KG", "/manus-storage/doctor-khushboo-supplied_2fce012e.avif"],
  ["Dr. Yogendra Gupta", "Consultant Anaesthesiologist", "Ophthalmic & Pediatric Anaesthesia", "12+ yrs", "YG", "/manus-storage/doctor-yogendra-supplied_92d30fc6.avif"],
];
const insurers = ["HARYANA GOVT.", "ECHS", "PM-JAY", "STAR HEALTH", "MEDI ASSIST", "ICICI LOMBARD", "ADITYA BIRLA", "MANIPAL CIGNA", "NIVA BUPA", "SAFEWAY TPA", "CHOLA MS"];
const testimonials = [
  ["Himantika Choudhary", "Jind, Haryana", "It has been great experience with Saraswati Eye Care Centre. My father had his cataract surgery with FLACS. The staff is well-behaved and the doctors are very experienced. Dr. Rajesh Garg is an excellent surgeon. Highly recommended!"],
  ["Anjali Sharma", "Karnal, Haryana", "Excellent care and service at Saraswati Eye Care Centre. The doctors are highly skilled and the staff is very supportive. My vision has improved significantly after the treatment."],
  ["Rahul Kumar", "Rohtak, Haryana", "The facilities are top-notch and the doctors are very professional. They explained everything clearly and made me feel comfortable throughout the process."],
  ["Priya Singh", "Hisar, Haryana", "Very happy with the treatment for my child's eye issue. Dr. Khushboo Gupta is amazing with kids and very knowledgeable. The pediatric section is well-equipped."],
  ["Sanjay Verma", "Panipat, Haryana", "Had my retina checked by Dr. Ajay Garg. He is a true expert in his field. The technology used is very advanced, and the examination was thorough."],
];
const visitFaqs = [
  ["What should I bring to my appointment?", "Please carry any previous eye prescriptions, reports, a current medication list, and relevant insurance or scheme documents. These details help the care team understand your visit better."],
  ["Should I arrive before my appointment time?", "Arriving around 15 minutes early gives time for registration and any preparation needed before your consultation. If you are unsure about your time, call the clinic team before travelling."],
  ["Will I be able to drive home afterwards?", "Some eye examinations may involve drops that can temporarily affect your vision. Ask the care team in advance whether you should arrange for someone to accompany you home."],
  ["How do I choose the right specialist?", "You do not need to decide alone. Describe your concern when booking, and the clinic team can guide you toward the appropriate consultation type and specialist."],
] as const;

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65, delay, ease: [0.23, 1, 0.32, 1] }}>{children}</motion.div>;
}
function Button({ children, onClick, dark = false, href, className = "" }: { children: React.ReactNode; onClick?: () => void; dark?: boolean; href?: string; className?: string }) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${dark ? "bg-teal text-white hover:bg-teal-deep" : "bg-coral text-white hover:bg-coral-deep"} ${className}`;
  return href ? <a href={href} className={cls}>{children}</a> : <button onClick={onClick} className={cls}>{children}</button>;
}
function SectionIntro({ eyebrow, title, copy, right }: { eyebrow: string; title: React.ReactNode; copy: string; right?: React.ReactNode }) {
  return <div className="section-intro"><div><div className="eyebrow"><span className="care-line" />{eyebrow}</div><h2>{title}</h2></div><div className="intro-right"><p>{copy}</p>{right}</div></div>;
}

export default function Home() {
  const [doctor, setDoctor] = useState<(typeof doctors)[number] | null>(null);
  const [video, setVideo] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [testimonial, setTestimonial] = useState(0);
  const [faq, setFaq] = useState<number | null>(0);
  const blogTrigger = useRef<HTMLDivElement>(null);
  const [showBlog, setShowBlog] = useState(false);
  const openAppointment = () => setAppointmentOpen(true);

  useEffect(() => {
    const target = blogTrigger.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setShowBlog(true);
      observer.disconnect();
    }, { rootMargin: "480px 0px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return <div className="site-shell">
    <SiteHeader onBookAppointment={openAppointment} />

    <main id="home">
      <section className="hero"><div className="hero-void" /><ClinicalOrbit /><div className="container hero-content"><div className="hero-copy"><div className="accreditation-pill"><ShieldCheck size={15} /> First NABH Accredited Eye Hospital in Jind</div><h1>The highest Google reviewed <em className="reviewed-type">eye hospital</em> in Jind.</h1><p>Specialist vision care, advanced technology, and a calmer way to feel looked after — close to home since 2010.</p><div className="hero-cta"><Button onClick={openAppointment}>Book an appointment <ArrowUpRight size={17} /></Button><a href="tel:+919729236700" className="text-link light"><Phone size={17} /> Talk to our care team</a></div></div><div className="hero-note"><span>01 / 04</span><span className="note-rule" /><span>Trusted vision care<br />for Jind & Haryana</span></div></div><div className="container stats-float"><div className="stat-card"><strong>4.9</strong><span><Star size={13} fill="currentColor" /> Google rating</span></div><div className="stat-card"><strong>50K<sup>+</sup></strong><span>Patients cared for</span></div><div className="stat-card"><strong>15<sup>+</sup></strong><span>Years of expertise</span></div></div></section>

      <section className="trust-strip"><div className="container trust-inner"><span className="trust-label">Care you can count on</span>{["NABH ACCREDITED", "CASHLESS TREATMENT", "4 SPECIALIST DOCTORS", "15+ YEARS"].map((x, i) => <div className="trust-item" key={x}><Check size={16} />{x}</div>)}</div></section>

      <section className="section about-section" id="about"><div className="container"><SectionIntro eyebrow="The Saraswati difference" title={<>A clearer way forward<br /><i>for your vision.</i></>} copy="Founded by Dr. Rajesh Garg in 2010, Saraswati Eye Care Centre brings super-speciality eye care to Jind with the warmth of a hospital that knows its community." right={<a className="text-link" href="#contact">Our story <ArrowUpRight size={17} /></a>} /><div className="about-grid"><Reveal className="about-image-wrap"><img src={exteriorImg} alt="Saraswati Eye Care Centre nursing and reception area" width="480" height="270" loading="lazy" decoding="async" /><span className="image-caption">66/6, Rajwaha Road · Jind</span></Reveal><Reveal delay={.1} className="about-story"><div className="story-mark">“</div><p className="large-copy">“Good care begins with listening. Every patient who walks through our doors deserves clarity — in their diagnosis, their options, and their path back to everyday life.”</p><div className="founder"><div className="avatar-initial">RG</div><div><strong>Dr. Rajesh Garg</strong><span>Founder & Chairman · 17+ years</span></div></div></Reveal><div className="feature-rail">{[[ShieldCheck, "NABH Accredited", "India’s trusted quality framework"], [Stethoscope, "Expert Specialists", "Four focused clinical teams"], [Sparkles, "Advanced Technology", "Precision diagnostics & surgery"], [Users, "Compassionate Care", "A calmer patient experience"]].map(([Icon, title, copy], i) => <Reveal delay={i * .06} key={title as string}><div className="feature"><Icon size={20} /><div><strong>{title as string}</strong><span>{copy as string}</span></div></div></Reveal>)}</div></div></div></section>

      <section className="section services-section" id="services"><div className="container"><SectionIntro eyebrow="Specialist services" title={<>Expertise, made<br /><i>easy to understand.</i></>} copy="Clinic-authored care descriptions, paired with the specialist team named on the original Saraswati Eye Care website." right={<a className="text-link" href="#contact">Discuss a service <ArrowUpRight size={17} /></a>} /><div className="service-list">{services.map(([n, title, copy, specialist], i) => <Reveal delay={i * .04} key={title}><a href="#contact" className="service-row"><span className="service-number">{n}</span><div className="service-icon"><Eye size={22} /></div><div className="service-main"><h3>{title}</h3><p>{copy}<span className="service-specialist">Clinical lead: {specialist}</span></p></div><ArrowUpRight className="service-arrow" size={20} /></a></Reveal>)}</div></div></section>

      <section className="section facility-gallery-section" id="gallery"><div className="container"><SectionIntro eyebrow="Inside the centre" title={<>Original spaces.<br /><i>Real clinical care.</i></>} copy="A selection of original facility photographs from Saraswati Eye Care Centre’s public website." /><div className="facility-gallery">{facilityPhotos.map(([title, caption, image], i) => <Reveal delay={i * .07} key={title}><figure className="facility-card"><img src={image} alt={title} loading="lazy" decoding="async" /><figcaption><span>{String(i + 1).padStart(2, "0")}</span><div><strong>{title}</strong><small>{caption}</small></div></figcaption></figure></Reveal>)}</div></div></section>

      <section className="section teal-section" id="doctors"><div className="container"><SectionIntro eyebrow="Meet your specialists" title={<>Experienced hands.<br /><i>Human attention.</i></>} copy="A small, focused team of specialists means your care stays personal — while drawing on the depth of a super-speciality hospital." /><Reveal className="team-feature"><div className="team-image-frame"><img src={teamImg} alt="Saraswati Eye Care Centre team gathered outside the clinic" width="1500" height="1000" loading="lazy" decoding="async" /></div><div className="team-feature-copy"><div className="eyebrow"><span className="care-line amber" />One clinical team</div><h3>Care is always a team effort.</h3><p>From reception and nursing to diagnostics and specialist care, every colleague helps make each visit feel considered and clear.</p><span className="team-note"><Users size={15} /> Original team photograph from the clinic</span></div></Reveal><div className="doctor-grid">{doctors.map(([name, role, specialty, experience, initials, image], i) => <Reveal delay={i * .08} key={name}><article className={`doctor-card doctor-card-${initials.toLowerCase()}`}><div className="doctor-portrait-orbit"><div className="doctor-portrait"><img src={image} alt={`${name} portrait`} width="480" height="853" loading="lazy" decoding="async" /><span>{initials}</span></div></div><div className="doctor-meta"><span className="doctor-exp">{experience}</span><h3>{name}</h3><strong>{role}</strong><p>{specialty}</p><button onClick={() => setDoctor([name, role, specialty, experience, initials, image])}>View profile <ArrowUpRight size={15} /></button></div></article></Reveal>)}</div></div></section>

      <section className="marquee-section"><div className="container marquee-label">Cashless care through trusted partners</div><div className="marquee-track">{[...insurers, ...insurers].map((x, i) => <span key={`${x}-${i}`}><Check size={14} />{x}</span>)}</div></section>

      <section className="section equipment-section" id="equipment"><div className="container equipment-grid"><Reveal className="equipment-photo"><img src={equipmentImg} alt="Precision ophthalmic equipment at Saraswati Eye Care Centre" width="900" height="675" loading="lazy" decoding="async" /><div className="photo-tag">Precision technology<br /><strong>with a human touch</strong></div></Reveal><Reveal delay={.1} className="equipment-copy"><div className="eyebrow"><span className="care-line" />Technology that earns trust</div><h2>See more clearly.<br /><i>Diagnose precisely.</i></h2><p>Our diagnostic and surgical systems help specialists see what matters, plan with confidence, and deliver care tailored to each eye.</p><div className="equipment-list"><div><span>01</span><strong>R-Evolution Phaco + Vitrectomy</strong><small>Optikon · Italy</small></div><div><span>02</span><strong>Anterion swept-source OCT</strong><small>Heidelberg · Germany</small></div><div><span>03</span><strong>Topcon 3D OCT Maestro</strong><small>Topcon · Japan</small></div></div><a href="#contact" className="text-link">Explore our equipment <ArrowUpRight size={17} /></a></Reveal></div></section>

      <section className="reviews-section jsx-935c9150ba3f1607" id="stories"><div className="container reviews-shell"><div className="reviews-overview"><div><div className="reviews-kicker"><span className="care-line" />Patient reviews</div><h2>Trusted by<br /><i>Thousands.</i></h2><p>See what our patients say about their experience at Saraswati Eye Care Centre.</p><div className="review-action-row"><a className="review-primary-cta" href="https://g.page/r/CcGjKywuRqrPEAE/review" target="_blank" rel="noreferrer"><Star size={15} fill="currentColor" /> Write a review</a><button className="review-secondary-cta" onClick={openAppointment}>Book appointment <CalendarDays size={15} /></button><a className="review-secondary-cta" href="#about">Learn more about us <ArrowUpRight size={15} /></a></div></div><div className="rating-orb"><img className="google-maps-rating-icon" src="/manus-storage/google-maps-icon_3ada9d2d.png" alt="Google Maps" width="36" height="36" /><div className="rating-stars" role="img" aria-label="Five star rating"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div><div className="rating-big">4.9<span>/5</span></div><p>Based on <strong>1000+</strong> reviews</p><a href="https://www.google.com/maps/place/Saraswati+Eye+Care+Centre/@29.3139692,76.3253288,17z/data=!4m8!3m7!1s0x391204530f997803:0xcfaa462e2c2ba3c1!8m2!3d29.3139692!4d76.3253288!9m1!1b1!16s%2Fg%2F11d_cxyqmx?entry=ttu" target="_blank" rel="noreferrer"><img className="google-maps-link-icon" src="/manus-storage/google-maps-icon_3ada9d2d.png" alt="" width="18" height="18" />Read more reviews <ArrowUpRight size={15} /></a></div></div><div className="trust-metrics"><div className="trust-metric"><span><Users size={17} />50,000+</span><p>Successful Treatments</p></div><div className="trust-metric"><span><Clock3 size={17} />15+</span><p>Years Experience</p></div><div className="trust-metric"><span><Stethoscope size={17} />4</span><p>Expert Specialists</p></div><div className="trust-metric"><span><ShieldCheck size={17} />NABH</span><p>Certified Hospital</p></div></div><div className="reviews-divider" /><div className="reviews-stage-head"><h3>What Our<br /><i>Patients Say.</i></h3><p>With over 15+ years of excellence in eye care and more than 5000 surgeries performed annually, Saraswati Eye Hospital stands as a trusted name in advanced ophthalmic treatments. Our experienced specialists ensure expert care and consistently high-quality outcomes.</p></div><div className="review-carousel-card"><div className="review-avatar-panel"><div className="review-avatar">{testimonials[testimonial][0].split(" ").map(part => part[0]).join("").slice(0, 2)}</div><span>Google review</span></div><div className="review-copy-panel"><div className="quote-mark">“</div><AnimatePresence mode="wait"><motion.div key={testimonial} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: .28 }}><blockquote>“{testimonials[testimonial][2]}”</blockquote><div className="review-author"><strong>{testimonials[testimonial][0]}</strong><span>{testimonials[testimonial][1]}</span></div></motion.div></AnimatePresence><div className="review-controls"><button onClick={() => setTestimonial((testimonial + testimonials.length - 1) % testimonials.length)} aria-label="Previous review">←</button><div className="review-dots">{testimonials.map((entry, index) => <button key={entry[0]} onClick={() => setTestimonial(index)} aria-label={`Go to review ${index + 1}`} aria-current={index === testimonial ? "true" : undefined} />)}</div><button onClick={() => setTestimonial((testimonial + 1) % testimonials.length)} aria-label="Next review">→</button></div></div></div></div></section>

      <div ref={blogTrigger}>{showBlog && <Suspense fallback={<section className="home-blog-section section" aria-label="Clinic insights" />}><HomeBlogFeature onBookAppointment={openAppointment} /></Suspense>}</div>

      <section className="section visit-faq-section" aria-labelledby="visit-faq-title"><div className="container visit-faq-layout"><div className="visit-faq-intro"><div className="eyebrow"><span className="care-line" />Before your visit</div><h2 id="visit-faq-title">A calmer start to<br /><i>your appointment.</i></h2><p>A few practical details can make your visit more straightforward. If anything is unclear, the clinic team can help before you travel.</p><div className="visit-faq-actions"><Button onClick={openAppointment}>Book an appointment <ArrowUpRight size={17} /></Button><a href="tel:+919729236700" className="text-link"><Phone size={17} /> Call the care team</a></div><div className="visit-faq-note"><ShieldCheck size={17} /><span>Bring previous reports when available; the care team will guide the rest.</span></div></div><div className="visit-faq-list">{visitFaqs.map(([question, answer], index) => <article className={faq === index ? "open" : ""} key={question}><button type="button" onClick={() => setFaq(faq === index ? null : index)} aria-expanded={faq === index}><span>{String(index + 1).padStart(2, "0")}</span><strong>{question}</strong><ChevronDown size={19} /></button><div className="visit-faq-answer"><p>{answer}</p></div></article>)}</div></div></section>

      <section className="cta-section" id="contact"><div className="container cta-inner"><div><div className="eyebrow light-eyebrow"><span className="care-line amber" />Your next step can be simple</div><h2>Let’s look after<br /><i>your vision.</i></h2></div><div className="cta-side"><p>Choose a time that works for you. Our care coordinator will help you find the right specialist and answer any questions before your visit.</p><Button onClick={openAppointment}>Book an appointment <ArrowUpRight size={17} /></Button></div></div></section>
    </main>

    <SiteFooter />

    <AnimatePresence>{doctor && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDoctor(null)}><motion.div className="profile-modal" initial={{ opacity: 0, scale: .96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .96, y: 16 }} onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setDoctor(null)}><X size={20} /></button><div className="modal-avatar">{doctor[4]}</div><div className="eyebrow"><span className="care-line" />{doctor[1]}</div><h2>{doctor[0]}</h2><p className="modal-specialty">{doctor[2]}</p><p>Our specialists bring focused clinical experience and a thoughtful, patient-first approach to every consultation. Ask our care coordinator about availability and the right appointment type for your needs.</p><Button onClick={openAppointment}>Book with our team <ArrowUpRight size={16} /></Button></motion.div></motion.div>}</AnimatePresence>
    <AnimatePresence>{video && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setVideo(false)}><motion.div className="video-modal" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setVideo(false)}><X size={20} /></button><div className="video-placeholder"><Play size={42} fill="currentColor" /></div><h3>A closer look at our care</h3><p>Video gallery preview · Saraswati Eye Care Centre</p></motion.div></motion.div>}</AnimatePresence>

    <AnimatePresence>{appointmentOpen && <Suspense fallback={<div className="modal-backdrop"><div className="appointment-modal appointment-loading" role="status">Preparing appointment form…</div></div>}><AppointmentWizard onClose={() => setAppointmentOpen(false)} /></Suspense>}</AnimatePresence>
  </div>;
}
