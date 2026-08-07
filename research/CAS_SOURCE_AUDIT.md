# CAS Source Website Audit

## Scope

Public source: `https://cas.res.in/`

Audit date: 6 August 2026, Asia/Calcutta. The crawl resolved internal links from the public home page and discovered pages. It did not attempt authentication, hidden-directory enumeration, form submission, vulnerability testing, or access to private systems. CAS exposed no `robots.txt` or `sitemap.xml` at the checked root paths.

This is a migration inventory, not an independent factual, legal, security, accessibility, or copyright certification.

## Method

- Single-session, rate-limited crawl restricted to `cas.res.in`/`www.cas.res.in` public links.
- Maximum configured page target count: 250; discovered queue completed at 98 targets.
- Extracted resolved URL, response status, page title/description, headings, visible text, links, and image references.
- Downloaded public image and PDF references into a hashed local filename to avoid source-name collision.
- Recorded original source URL, source page, fetch status, size/path, and PDF SHA-256 checksum.
- Re-runs reuse cached image/document paths where possible.

Crawler source:

- `tools/crawl_cas.py`
- `tools/download_cas_documents.py`

## Inventory summary

| Item | Result |
|---|---:|
| Internal page targets | 98 |
| Pages returning `200` | 78 |
| Page targets returning `404` | 20 |
| Unique link relationships | 3,919 |
| Image URLs | 585 |
| Images retrieved | 578 |
| Image URLs returning `404` | 7 |
| PDF URLs | 185 |
| PDFs retrieved | 176 |
| PDF URLs returning `404` | 9 |
| Downloaded files | 753 |
| Downloaded source size | ~445.88 MB |

The image count includes images linked as notice/gallery media as well as inline `<img>` references. Counts are URL-based; identical or near-identical content may exist at multiple URLs.

## Public content observed

### Institution and administration

- Home and About material describing CAS as an in-campus research-driven institute of Dr. A.P.J. Abdul Kalam Technical University.
- Establishment/history, vision/mission, Director profile, contact information, reports/newsletter, committee/approval-style documents, and NIRF-related link.
- Existing public contact page lists the Sector 11, Jankipuram Vistar Yojna, Lucknow address and multiple role-based email routes.

### Academics and admissions

- M.Tech pages for Computer Science and Engineering, Nanotechnology, Energy Science and Technology, Mechatronics, and Manufacturing Technology & Automation.
- B.Tech ordinance and syllabus material for multiple engineering labels.
- Ph.D. overview/research content.
- Program structure/syllabi, ordinances, timetables, student lists, fees, hostel, academic calendar, counselling/admission instructions, and external application portals.
- Source home was showing 2026-27 admissions/registration/calendar information on the audit date.

### People

- Current faculty, visiting faculty, former faculty, staff, M.Tech students, Ph.D. scholars, research scholars, and international/visiting expert content.
- Profile photos, biography/qualification/interests, faculty publication PDFs, and research area/problem statements.

### Research and facilities

- Research themes/areas, publications, patents, projects, innovations, collaboration, achievements, equipment, labs, infrastructure, and research seminar/workshop content.
- Prominent source themes include AI/ML, cybersecurity, ICT, IoT, computer vision, robotics, drones, automation, additive/manufacturing technology, nanotechnology, and energy conversion/storage.
- Extensive laboratory, equipment, expert, poster, patent, and activity imagery.

### Campus and engagement

- Library, infrastructure, hostel, student life, student publications, alumni, activities, media, gallery, campus/video tour, webinars, workshops, internship microsite, and Azadi Ka Amrit Mahotsav content.

## Structural findings

1. **Duplicate/case-variant pages:** examples include `/research1.html` and `/Research1.html`, `/gallery.html` and `/Gallery.html`, `/` and `/index.html`. Some old microsite `.php` links coexist with `.html` pages.
2. **Broken internal routes:** 20 crawled page targets returned `404`, including `/pastfaculty.html.html`, obsolete research/contact/activity routes, and `home1` `.php` paths.
3. **Generic metadata:** many pages reuse “Welcome to Centre for Advanced Studies | CAS AKTU,” reducing differentiation in search/browser history.
4. **Oversized pages:** extracted source pages for research, experts, publications, past faculty, equipment, and infrastructure are long and difficult to scan. Navigation and repeated template text inflate counts but the underlying records also need structure/filtering.
5. **Repeated urgent content:** home notice/admission links are repeated across a ticker-like region instead of normalized records with state/expiry.
6. **PDF/image dependency:** important dates, syllabi, research posters, publication lists, flyers, and official records are often bare file links; some essential information appears inside images.
7. **Filename inconsistency:** spaces, capitalization, punctuation, misspellings, duplicate names, old academic years, and generic numeric filenames make governance and URLs fragile.
8. **Mixed microsites/templates:** `home1`, `internship`, campus tour, and library content use separate structures and routes.
9. **Freshness ambiguity:** current and historical materials appear together, and time-sensitive claims such as intake, stipend, approval, scholarship, timetable, and fees do not always expose a consistent effective/review date.
10. **Media governance gap:** the public source cannot prove copyright, consent, captions, date/context, or whether portraits/student/event images remain appropriate.

## Broken source references

### Page targets

Exact entries are in `cas-page-inventory.csv`. They include:

- `/blog-full-right-sidebar-with-frame.html`
- `/pastfaculty.html.html`
- `/phdnano.html`
- `/coronarsch.html`
- `/Research.html`
- `/fdp.html`
- `/contact.html`
- `/activity.html`
- `/research.php`
- `/rseminar.html`
- `/nanophd`
- `/mechaphd`
- Ten `home1/*.php` legacy routes

### Images

- `/images/logo.png`
- `/icons/infrait.jpg`
- `/images/media/52.jpeg`
- `/upload/newlogo4.png`
- `/upload/logo-white.png`
- `/upload/personnel-1.jpg`
- `/upload/1.jpg`

### PDFs

- `/pdf/Dr.Shiv.pdf`
- `/pdf/sajal.pdf`
- `/pdf/Dr.Sahoo.pdf`
- `/pdf/Anam_fatima_Posters_research.pdf`
- `/pdf/EMF_radiation_Posters_research.pdf`
- `/pdf/Auto_immune_disease_Posters_research.pdf`
- `/pdf/Covid_Posters_research.pdf`
- `/pdf/nanofab.pdf`
- `/pdf/Web of Science & JCR Online session.pdf`

## Migration implications

- Preserve the full inventories and checksums as provenance, but publish only owner-approved records.
- Use a content model for people, programs, notices, documents, research, facilities, events, and media; do not recreate one static page per legacy file.
- Perform a current/archived/canceled/superseded review for every dated record.
- Require HTML summaries for essential admissions/academic information and accessible remediation for official PDFs.
- Resolve each source URL into a canonical page, redirect, archive, or approved `404/410` outcome.
- Obtain official original brand marks and high-resolution, rights-cleared imagery. The downloaded source header is a wide raster composite and is not a suitable responsive master logo.
- Re-crawl immediately before content freeze because the source contains active 2026-27 notices and may change.

## Limitations

- Only pages/files reachable from discovered public HTML links are represented; hidden/orphan sources may be absent.
- JavaScript-injected resources not present in fetched HTML may be absent.
- Response `200` confirms retrieval, not correctness, safety, or valid file content.
- No PDF semantic/accessibility analysis, OCR, malware scan, EXIF/privacy scan, duplicate-image analysis, or copyright verification was performed by the crawler.
- No analytics, search-console, backlink, server-log, CMS/database, or official office source was available.
- Program/person/institution facts in this audit are attributed to the source site and require accountable owner confirmation.

