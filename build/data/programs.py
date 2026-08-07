"""
Program records — real content quoted/paraphrased from
research/cas-content-inventory.json (Mtechcse.html, mtechnano.html,
mtechenergy.html, mtechmecha.html, mtechmanufacturing.html, Btech.html,
csephd.html). Each dict matches the "Program" content type fields in
docs/INFORMATION_ARCHITECTURE.md #3.

Fields left as None/empty are genuinely absent from the source — not
inferred or invented (Development Rules: never invent content).
"""

PROGRAMS = [
    {
        "slug": "mtech-cse",
        "level": "M.Tech",
        "title": "M.Tech. Computer Science and Engineering",
        "department": "Computer Science and Engineering",
        "seats": "18 seats per academic year",
        "approval": "AICTE approved",
        "specializations": ["Machine Learning", "Cyber Security", "ICT"],
        "vision": (
            "To become a centre of excellence of global standards in Artificial Intelligence, "
            "Machine Learning, and Cybersecurity through research and innovation for developing "
            "secure, intelligent technologies towards a smarter and safer digital future."
        ),
        "mission": [
            "Deliver advanced education and skill development in Artificial Intelligence, Machine Learning, and Cybersecurity.",
            "Conduct cutting-edge research addressing real-world challenges in intelligent and secure systems.",
            "Foster innovation and interdisciplinary collaboration for technological advancement.",
            "Develop ethical and industry-ready professionals equipped to lead in the digital era.",
            "Engage with industry, academia, and government to drive impactful solutions and policy in emerging technologies.",
        ],
        "labs": ["Cyber City Simulator Lab", "Google Code Lab", "General Purpose Computing Lab", "Linux/Open Source Lab", "Language Lab", "IoT Lab"],
        "coordinators": [],
        "eligibility": "GATE-qualified candidates apply online; non-GATE-qualified candidates are also eligible based on CUET PG / Institute-level exam merit (per legacy admissions notice).",
        "stipend_note": "Monthly stipend as per AICTE/MHRD/University rules for admitted GATE-qualified candidates (unverified — see PRODUCT_REQUIREMENTS.md §2).",
        "source_url": "https://cas.res.in/Mtechcse.html",
    },
    {
        "slug": "mtech-nanotechnology",
        "level": "M.Tech",
        "title": "M.Tech. Nanotechnology",
        "department": "Nanotechnology",
        "seats": "18 seats, with scholarship as per MHRD rules",
        "approval": None,
        "established": "2018",
        "specializations": ["Nanoelectronics", "MEMS/NEMS", "Nanomaterials and devices", "Photonics", "Nano-biotechnology", "Solar cells", "Computational nano-engineering"],
        "vision": (
            "To become a world-class centre for cutting-edge research and innovation in the field of "
            "nanotechnology, driving advancements in sectors like healthcare, energy, and materials "
            "science, while fostering interdisciplinary collaboration and training the next generation of scientists."
        ),
        "mission": [
            "Promote research and development in nanoscience and technology, focusing on areas of national importance and societal benefit.",
            "Conduct fundamental research for understanding and controlling matter at the nanoscale.",
            "Apply nanotechnology to solve problems in healthcare, energy, environment, and agriculture.",
            "Work with businesses and entrepreneurs to translate research into products and technologies.",
        ],
        "labs": ["Materials Chemistry and Synthesis Laboratory", "Micro- and Nano-Characterization Facility", "Nanofabrication Facility", "Device Testing Facility"],
        "coordinators": ["Dr. A.V. Ullas", "Dr. Chandresh Kumar Rastogi"],
        "eligibility": "GATE-qualified candidates apply online for admission.",
        "stipend_note": "Monthly stipend equivalent to AICTE/MHRD/University rules for admitted GATE-qualified candidates (unverified — see PRODUCT_REQUIREMENTS.md §2).",
        "source_url": "https://cas.res.in/mtechnano.html",
    },
    {
        "slug": "mtech-energy-science-technology",
        "level": "M.Tech",
        "title": "M.Tech. Energy Science and Technology",
        "department": "Energy Science and Technology",
        "seats": "18 seats intake",
        "approval": None,
        "established": "2019",
        "specializations": ["Energy conversion and storage", "Photovoltaics and solar energy"],
        "vision": (
            "To become a leading centre of innovation and excellence that nurtures student well-being, "
            "promotes adaptability, and drives impactful research for a sustainable and inclusive future."
        ),
        "mission": [
            "Promote interdisciplinary research and development to address the global shift from conventional to non-conventional energy sources.",
            "Develop and implement innovative, sustainable, and affordable energy solutions beneficial to society.",
            "Advance knowledge and innovation in energy conversion and storage through cutting-edge research.",
            "Foster collaborations with leading organizations and agencies in the energy sector.",
            "Contribute to a sustainable and inclusive future in line with the SDGs.",
        ],
        "labs": ["Energy Conversion and Storage Laboratory", "Photovoltaics and Solar Energy Laboratory"],
        "coordinators": ["Dr. Saurabh Mishra", "Dr. Vijay Singh"],
        "eligibility": "GATE-qualified candidates apply online for admission.",
        "stipend_note": "Monthly stipend equivalent to AICTE/MHRD/University rules for admitted GATE-qualified candidates (unverified — see PRODUCT_REQUIREMENTS.md §2).",
        "source_url": "https://cas.res.in/mtechenergy.html",
    },
    {
        "slug": "mtech-mechatronics",
        "level": "M.Tech",
        "title": "M.Tech. Mechatronics",
        "department": "Mechatronics",
        "seats": "18 seats per batch",
        "approval": "AICTE approved",
        "established": "2018-19 session",
        "specializations": ["Robotics", "Automation", "Smart systems"],
        "vision": (
            "To be a global leader in Mechatronics, driving innovation through interdisciplinary "
            "collaboration in robotics, automation, and smart systems to build a more efficient, "
            "sustainable, and connected world."
        ),
        "mission": [
            "Provide high-quality education and hands-on training in manufacturing technology and industrial automation.",
            "Develop skilled mechatronics professionals who can contribute to industry and research.",
            "Facilitate collaboration among engineering disciplines for interdisciplinary research and innovation.",
            "Translate research findings into practical applications, prototypes, and innovative solutions.",
        ],
        "labs": ["Design and Simulation Center", "Sensors, Drives and Control Lab", "3D Printing Lab", "Industrial Automation Lab", "Industrial Robotic Center", "Embedded System Lab"],
        "coordinators": ["Dr. Anuj Kumar Sharma (Course coordinator)"],
        "eligibility": "GATE-qualified candidates apply online for admission.",
        "stipend_note": "Monthly stipend equivalent to AICTE/MHRD/University rules for admitted GATE-qualified candidates (unverified — see PRODUCT_REQUIREMENTS.md §2).",
        "source_url": "https://cas.res.in/mtechmecha.html",
    },
    {
        "slug": "mtech-manufacturing-technology-automation",
        "level": "M.Tech",
        "title": "M.Tech. Manufacturing Technology & Automation",
        "department": "Manufacturing Technology & Automation",
        "seats": "18 seats per batch",
        "approval": None,
        "established": "2019-20 session",
        "specializations": ["Advanced manufacturing", "Robotics", "Smart systems"],
        "vision": (
            "To emerge as a leading centre of excellence in Manufacturing Technology and Automation by "
            "advancing innovation, promoting smart and sustainable manufacturing, and equipping students "
            "to meet the evolving needs of industry and society."
        ),
        "mission": [
            "Provide high-quality education and hands-on training in manufacturing technology and industrial automation.",
            "Foster innovation through interdisciplinary research in advanced manufacturing, robotics, and smart systems.",
            "Promote sustainable and intelligent manufacturing practices aligned with global industry standards.",
            "Develop industry-ready professionals with strong technical skills and ethical values.",
            "Collaborate with industry and research institutions for knowledge exchange and technology development.",
        ],
        "labs": ["Design and Simulation Center", "3D Printing Lab", "Industrial Automation Lab", "Advanced Machining Lab", "Industrial Robotic Center", "Tribology Lab"],
        "coordinators": ["Dr. Anuj Kumar Sharma (Course coordinator)", "Dr. Siddharth Yadav"],
        "eligibility": "GATE-qualified candidates apply online for admission.",
        "stipend_note": "Monthly stipend equivalent to AICTE/MHRD/University rules for admitted GATE-qualified candidates (unverified — see PRODUCT_REQUIREMENTS.md §2).",
        "source_url": "https://cas.res.in/mtechmanufacturing.html",
    },
    {
        "slug": "phd-cse",
        "level": "Ph.D.",
        "title": "Ph.D., Computer Science & Engineering",
        "department": "Computer Science & Engineering (Cyber Security / ICT / Artificial Intelligence)",
        "established": "2017",
        "specializations": ["Artificial Intelligence (Machine Learning and Deep Learning)", "Cyber Security", "ICT", "Data Science & Analytics", "Internet of Things (IoT)", "Computer Vision", "Cloud Computing"],
        "vision": None,
        "mission": None,
        "labs": ["Artificial Intelligence Lab", "Google Developers Code Lab", "Cyber City Simulator Lab", "Artificial Intelligence in Biomedical Lab", "Internet of Things (IoT) Lab"],
        "coordinators": [],
        "eligibility": "See Ph.D. admissions process.",
        "stipend_note": "Legacy source states Rs. 40,000 per month under the Deen Dayal Upadhyaya Quality Improvement Programme, subject to ordinance terms (unverified — see PRODUCT_REQUIREMENTS.md §2).",
        "source_url": "https://cas.res.in/csephd.html",
        "extra_note": "Legacy source claims more than 40 research papers published (IEEE, ACM, Springer, Elsevier) and equipped with an NVIDIA DGX-2 system; both unverified.",
    },
    {
        "slug": "phd-mechatronics",
        "level": "Ph.D.",
        "title": "Ph.D., Mechatronics",
        "department": "Mechatronics",
        "established": "2018-19 session",
        "specializations": ["Robotics", "PLC & SCADA", "AI-based systems", "Drones and aerial systems", "Additive manufacturing", "Automation"],
        "vision": None,
        "mission": None,
        "labs": ["Design and Simulation Centre", "Sensors, Drives and Control Lab", "3D Printing Lab", "Industrial Automation Lab", "Industrial Robotic Centre", "Tribology Lab"],
        "coordinators": [],
        "eligibility": "See Ph.D. admissions process.",
        "stipend_note": "Legacy source states Rs. 40,000 per month under the Deen Dayal Upadhyaya Quality Improvement Programme, subject to ordinance terms (unverified — see PRODUCT_REQUIREMENTS.md §2).",
        "source_url": "https://cas.res.in/csephd.html",
    },
    {
        "slug": "phd-nanotechnology",
        "level": "Ph.D.",
        "title": "Ph.D., Nanotechnology",
        "department": "Nanotechnology",
        "established": "2018",
        "specializations": ["Nanomaterial", "MEMS/NEMS devices", "Microfluidics", "Energy conversion and storage system", "Energy management", "Solar cells"],
        "vision": None,
        "mission": None,
        "labs": ["Material Chemistry and Synthesis Laboratory", "Micro and Nano Characterization Facility", "Photovoltaic and Solar Energy Laboratory", "Nanofabrication Facility", "Energy Conversion and Storage Facility"],
        "coordinators": [],
        "eligibility": "See Ph.D. admissions process.",
        "stipend_note": "Legacy source states Rs. 40,000 per month under the Deen Dayal Upadhyaya Quality Improvement Programme, subject to ordinance terms (unverified — see PRODUCT_REQUIREMENTS.md §2).",
        "source_url": "https://cas.res.in/csephd.html",
        "extra_note": "Department also lists a Micro and Nano Characterization facility described as an ISO Class 7 cleanroom (unverified).",
    },
    {
        "slug": "btech",
        "level": "B.Tech",
        "title": "B.Tech.",
        "department": "Multiple disciplines",
        "established": None,
        "specializations": [
            "Computer Science Engineering, and CSE (AI & ML)",
            "Electronics Engineering (VLSI Design and Technology)",
            "Mechanical and Mechatronics Engineering (Additive Manufacturing)",
        ],
        "vision": None,
        "mission": None,
        "labs": [],
        "coordinators": [],
        "eligibility": "Not stated in the migrated source beyond scheme/syllabus documents by discipline and year.",
        "stipend_note": "",
        "source_url": "https://cas.res.in/Btech.html",
        "extra_note": (
            "The legacy B.Tech page is a fee/document-download listing, not a program overview — no "
            "vision, mission, or seat-count text was found in the crawl for B.Tech specifically. "
            "This record intentionally leaves those fields blank rather than inventing them."
        ),
    },
]
