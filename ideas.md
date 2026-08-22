# Saraswati Eye Care Centre — Design Direction

## Three stylistic approaches

### Theme Name: Quiet Clinical Editorial
Very Brief Intro: A calm, editorial hospital experience built around warm paper tones, deep teal, and precise typographic hierarchy. It makes trust feel tangible through generous whitespace, documentary imagery, and restrained motion.
Probability: 0.047

### Theme Name: Coastal Care Modernism
Very Brief Intro: A brighter, more optimistic direction pairing sea-glass blues with sunlit neutrals, rounded geometry, and soft illustrated diagrams. It feels approachable for families while retaining clinical credibility.
Probability: 0.083

### Theme Name: Midnight Precision
Very Brief Intro: A low-key, high-contrast interpretation with ink navy panels, amber highlights, and luminous diagnostic-inspired lines. It feels premium and technological, but is intentionally kept as the only dark-led option.
Probability: 0.016

## Chosen approach: Quiet Clinical Editorial

### Design Movement
Contemporary editorial modernism with the composure of a private medical journal: structured, tactile, and human rather than corporate or sterile.

### Core Principles
1. Make trust visible through accreditation, people, location, and outcomes before decorative language.
2. Use asymmetrical compositions and editorial side-notes to create a sense of considered expertise.
3. Keep motion confident and low-amplitude: reveal, settle, and clarify rather than entertain.
4. Let warm whitespace and tactile surfaces signal care, while teal provides medical authority.

### Color Philosophy
The base is a warm parchment-white instead of clinical pure white, helping the site feel local, human, and less intimidating. Deep clinical teal anchors navigation, headings, and trust moments. A single saffron-coral accent is reserved for decisive actions such as booking, so urgency remains meaningful and never becomes visual noise. Muted sage and mist-blue support secondary information without competing with the appointment path.

### Layout Paradigm
A vertical editorial journey with a narrow left rail for section markers, uneven content columns, and deliberate overlaps between image, statistic, and text. On mobile, the rail becomes a slim progress cue and the content becomes thumb-first cards with a persistent action bar.

### Signature Elements
1. A thin teal “care line” running through section labels, timeline moments, and selected cards.
2. Small rounded amber appointment tabs that feel like physical index markers.
3. Soft paper-grain texture and image captions styled like editorial marginalia.

### Interaction Philosophy
Every interaction should reduce uncertainty: hover states reveal context, buttons acknowledge touch immediately, and dialogs open with a calm spring. The most important actions remain visible without demanding attention through flashing or excess motion.

### Animation
Use Framer Motion for route-like fades, while-in-view reveals, stat count-ups, staggered card entrances, modal transitions, and a gentle insurance marquee. Motion uses opacity and transform only, with short ease-out timing for controls and slower editorial reveals for sections. Reduced-motion users receive instant state changes and no looping marquee.

### Typography System
Headings use Plus Jakarta Sans with 700–800 weight and tight tracking, giving the hospital a contemporary but stable voice. Body copy uses Inter at 400–500 with generous line-height and a 65ch maximum. Eyebrows use uppercase Inter at 11–12px with tracking around 0.16em. Numerical trust signals use Plus Jakarta Sans with tabular-feeling weight and oversized scale.

### Brand Essence
For families in Jind seeking dependable eye care, Saraswati is the accredited specialist hospital that combines advanced treatment with personal attention close to home.

Personality adjectives: Reassuring, exacting, humane.

### Brand Voice
Headlines are clear, grounded, and specific; CTAs sound like confident invitations rather than sales language. Microcopy answers the next patient question in plain English and avoids generic filler.

Example lines:
- “A clearer way forward for your vision.”
- “Choose a time. We’ll take care of the rest.”

### Wordmark & Logo
The mark is a bold, text-free symbol: two nested almond shapes forming an eye, interrupted by a vertical saffron ray that suggests both a pupil and a beam of clinical light. The wordmark pairs a compact uppercase “SARASWATI” with a smaller “EYE CARE CENTRE” line, aligned to the mark’s baseline.

### Signature Brand Color
Saraswati Teal — `#0D5C63`, a blue-green that feels medically credible, locally distinctive, and calm against parchment.

## Implementation reminders

The static scaffold is React + Vite + TypeScript with Wouter routing rather than Next.js App Router. The build will preserve the requested information architecture and interaction intent within the supported frontend foundation. Because this is a static-only project, appointment and newsletter interactions will use accessible client-side validation and clear success feedback; a real backend/ESP connection remains a follow-up integration rather than being fabricated.

Use custom generated imagery only for visually prominent areas, keep all large assets outside the project directory, and respect the warm editorial direction in every component. Before choosing any UI treatment, ask: “Does this reinforce or dilute the Quiet Clinical Editorial philosophy?”
