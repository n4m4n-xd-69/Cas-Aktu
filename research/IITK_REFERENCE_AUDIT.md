# IIT Kanpur Reference Audit

## Scope

Reference source: `https://www.iitk.ac.in/`

Reviewed on 6 August 2026 using the public home page, primary navigation links, and selected public pages:

- `/`
- `/institute-overview`
- `/education-at-iitk`
- `/research`
- `/news`

This is a pattern audit for CAS product requirements. It is not a comprehensive accessibility, security, performance, or visual conformance review of IIT Kanpur, and it grants no right to copy its branding, content, imagery, code, or exact layouts.

## Observed information architecture

The public navigation exposes broad institutional domains and service routes:

- Institute overview and education/academics
- Departments and academic calendar
- Research, research highlights, publications/newsletter, centres and facilities
- Innovation/incubation and intellectual property
- Faculty, staff, students, recruitment, postdoctoral opportunities
- Governance/directorate/administrators/deans
- Emergency, campus, counselling, health, public works, inclusion, and accessibility-related services
- Office automation, student ERP, webmail, library, Hindi/official-language routes
- International relations, industry collaboration, alumni, placements, tenders, admissions, announcements, and news

The home page semantics inspected during the audit included sections labeled:

- Welcome to IIT Kanpur
- Featured Research at IIT Kanpur
- Key Statistics
- IITK News Update
- Announcements
- Admission
- Alumni
- Faculty
- Innovation & Incubation
- International Relations
- Explore Our Departments
- Experience at IIT Kanpur
- IITK Administration

Selected detail pages use a clear page-specific H1 and descriptive metadata, such as Institute Overview, Education at IITK, Research, and News.

## Patterns to adapt for CAS

### 1. Separate institutional domains from utility services

IIT Kanpur's broad navigation distinguishes core content such as academics/research/people/administration from operational portals. CAS should use a smaller version appropriate to its scale: seven primary sections and a utility layer for Apply, Library, Student Resources, Careers, Contact, AKTU, Search, and language.

### 2. Make research a first-order route

Research highlights, major areas, experts, centres/facilities, publications, innovation/incubation, intellectual property, and collaboration are discoverable as connected institutional capabilities. CAS has strong source material for themes, experts, labs, equipment, publications, patents, and innovations; the new model should connect these records rather than burying them in very long static pages.

### 3. Keep updates distinct

News, announcements, admissions, recruitment, and tenders are not interchangeable. CAS should maintain separate types, filters, status/expiry, and archives, while providing one unified Updates hub.

### 4. Support multiple audiences without duplicating the whole site

Faculty, staff, students, alumni, partners, and applicants receive clear routes. CAS can expose audience shortcuts and curated landing sections while keeping one canonical program, policy, person, or notice record.

### 5. Surface administration and institutional trust

Governance, directorate, administrators, deans, emergency/services, and formal reports are visible rather than hidden. CAS should publish an institution-sized governance/administration structure, mandatory disclosures, approvals, policies, contacts, and review dates.

### 6. Mix task completion with evidence of institutional work

The reference home page combines admissions/announcements with research, statistics, innovation, departments, campus experience, international relations, and administration. CAS should follow the principle, not the density: lead with current tasks, then show verified research/program/campus evidence.

### 7. Use page-specific metadata and headings

Selected IIT Kanpur pages expose meaningful titles, descriptions, and H1s. CAS source pages widely reuse a generic title. Every CAS canonical page needs a unique task-specific title/description and a logical heading outline.

## Patterns to avoid copying directly

- IIT Kanpur has a much larger organizational structure and service ecosystem. Copying its navigation depth would overwhelm CAS.
- CAS should not reproduce labels for offices/services it does not operate or govern.
- Exact home-section order, visual styling, content, statistics, photography, logos, and code are out of scope.
- External service links should appear only after CAS confirms ownership, destination, privacy/security, and support.
- The new CAS site should not adopt complexity merely to resemble a larger institution.

## Resulting CAS design decisions

| Reference lesson | CAS decision |
|---|---|
| Broad institutional navigation | Seven stable primary sections plus utility links |
| Featured research and research areas | Research hub with structured themes, people, projects, outputs, facilities |
| Separate news/announcement/admission streams | Typed updates with current/archive/correction status |
| Department/program exploration | Program finder by level and discipline |
| Key statistics | Only verified, sourced, dated statistics; hide when stale |
| International/industry/alumni routes | Collaboration and alumni content scaled to named CAS owners |
| Administration visibility | About/Governance plus footer trust routes |
| Campus experience | Real CAS campus/lab media with rights, captions, alt, and accessible tour |
| Service portals | Clearly labeled external handoffs; no imitation of ERP functions |

## Reference limitations

- The review used public HTML and link structure, not authenticated services.
- Visual behavior across breakpoints, complete keyboard/screen-reader behavior, production performance, and security controls were not independently verified.
- Reference content and navigation may change after the audit date.
- CAS requirements in the PRD remain independently justified by CAS users, content, risks, and governance needs.
