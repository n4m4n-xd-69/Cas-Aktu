"""
Project records — docs/INFORMATION_ARCHITECTURE.md #3 "Project" content type
(title, sponsor, investigators, period, status, summary, outcomes, approved
funding display).

Real content: research/cas-content-inventory.json, research1.html, "Funded
Research Projects by Faculty Members" table — all 9 rows transcribed in
full (this table was short enough to migrate completely, unlike
Publications). Funding amounts are quoted as stated in the source (₹ Lakh)
and are unverified per PRODUCT_REQUIREMENTS.md §2, same as every other
figure carried over from the legacy site.
"""

PROJECTS = [
    {
        "title": "Design and Development of Artificial Intelligence based Screening Tool for Automatic Diagnosis of Osteoporosis in Women",
        "sponsor": "Biomedical Device and Technology Development (BDTD), Department of Science and Technology (DST), Government of India",
        "investigators": "Prof. M.K. Dutta (Principal Investigator); collaborator King George Medical University (KGMU), Lucknow",
        "amount": "₹74 Lakh", "duration": "3 years", "status": "Sanctioned, fund release under process",
    },
    {
        "title": "Intelligent Stethoscope: A Low-Cost Device based on Body Auscultation for Early Medical Diagnosis of Heart, Lung and Prenatal Health",
        "sponsor": "TDT Division, Biomedical Device and Technology Development (BDTD), Department of Science and Technology, Government of India",
        "investigators": "Prof. M.K. Dutta (PI)",
        "amount": "₹34.45 Lakh", "duration": "2 years", "status": "In progress",
    },
    {
        "title": "Assistive Device to Impart Perceptual Ability to Visually-Impaired using Intelligent Scene Captioning",
        "sponsor": "SEED Division, Technology Interventions for Disabled and Elderly Programme, Department of Science and Technology, Government of India",
        "investigators": "Prof. M.K. Dutta (PI)",
        "amount": "₹39.25 Lakh", "duration": "3 years", "status": "In progress",
    },
    {
        "title": "Development of Thermal Sensors for Measuring the Tool Tip Temperature and its Online Monitoring",
        "sponsor": "AKTU, under the Visvesvaraya Research Promotion Scheme (VRPS)",
        "investigators": "Dr. Anuj Kumar Sharma (PI), Dr. Rabesh Kumar Singh (Co-PI)",
        "amount": "₹5.0 Lakh", "duration": "2 years", "status": "In progress",
    },
    {
        "title": "Design and Fabrication of Human-Hand-Inspired Soft Robotic Hand for Differently-Abled Persons",
        "sponsor": "Collaborative Research and Innovation Program (CRIP) under AKTU Lucknow and TEQIP-III, MHRD, Government of India",
        "investigators": "Dr. Anuj Kumar Sharma (PI), Dr. Rabesh Kumar Singh (Co-PI)",
        "amount": "₹3.0 Lakh", "duration": "1 year", "status": "In progress",
    },
    {
        "title": "Computational Fluid Dynamics (CFD) Analysis for Designing Ore Transportation through Pipelines",
        "sponsor": "Collaborative Research and Innovation Program (CRIP) under AKTU Lucknow and TEQIP-III, MHRD, Government of India",
        "investigators": "Dr. Anuj Kumar Sharma (Co-PI)",
        "amount": "₹3.0 Lakh", "duration": "1 year", "status": "In progress",
    },
    {
        "title": "Development of Novel Method for Synthesizing Metal Oxide/Carbon Nanocomposites for Energy Storage and Related Applications",
        "sponsor": "Collaborative Research and Innovation Program (CRIP) under AKTU Lucknow and TEQIP-III, MHRD, Government of India",
        "investigators": "Dr. Piyush Jaiswal (PI)",
        "amount": "₹3.0 Lakh", "duration": "1 year", "status": "In progress",
    },
    {
        "title": "Near Net Shape Generation of Nano-Composite Parts via Stir Casting and 3D Printing Approach",
        "sponsor": "Collaborative Research and Innovation Program (CRIP) under AKTU Lucknow and TEQIP-III, MHRD, Government of India",
        "investigators": "Dr. Rabesh Kumar Singh (Co-PI)",
        "amount": "₹3.0 Lakh", "duration": "1 year", "status": "In progress",
    },
    {
        "title": "Development of Sustainable Hybrid Nano-Lubricant with Improved Tribological Properties for Green Machining",
        "sponsor": "SERB, Department of Science and Technology, Government of India",
        "investigators": "Dr. Anuj Kumar Sharma (PI), Prof. J. Ramkumar, IIT Kanpur (Co-PI)",
        "amount": "₹18.30 Lakh", "duration": "3 years", "status": "In progress",
    },
]
