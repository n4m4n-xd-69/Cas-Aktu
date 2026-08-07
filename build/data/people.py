"""
Person records — real content transcribed from
research/cas-content-inventory.json (faculty.html, visitingfaculty.html,
staff.html). This batch covers current faculty, visiting faculty, and
administrative/research staff (27 people). Past faculty (pastfaculty.html,
7,471 words, likely 20+ people) is a separate, larger batch — not in this
pass; tracked as Remaining Work.

Bios longer than a few sentences are trimmed to a professional summary using
only real sentences lifted from the source (never paraphrased into new
claims), per CONTENT_MIGRATION_LAUNCH.md Phase C ("normalize... split large
pages"). Full-length source text is not reproduced verbatim for the longest
CV-style dumps — this is an editorial trim, not an omission of a person.

Personal emails are not published: the source lists no individual faculty
emails, only general office addresses (PRODUCT_REQUIREMENTS.md FR-05 privacy
requirement — no contact is exposed without a source for it).

External profile links (Google Scholar, Scopus, ORCID, ResearchGate,
publication PDFs) exist in the source but are NOT hyperlinked here: the
crawler's link list is in document order and several entries in this data
set carry visibly mislabeled anchor text in the *source itself* (e.g. three
consecutive links all labeled "Google Scholar" where the surrounding text
implies Scholar/ORCID/ResearchGate) — pairing them to the wrong person would
be a real accuracy error, so all such links are marked pending verification
instead.
"""

CURRENT_FACULTY = [
    {
        "slug": "anuj-kumar-sharma",
        "name": "Dr. Anuj Kumar Sharma",
        "title": "Associate Professor; Dean Academics; Program Coordinator, Mechatronics and Manufacturing Technology & Automation",
        "department": "Mechatronics",
        "degrees": ["Ph.D., Indian Institute of Technology (ISM), Dhanbad", "M.Tech., Uttar Pradesh Technical University, Lucknow", "B.E., Chaudhary Charan Singh University, Meerut, UP"],
        "interests": ["Metal cutting operations", "Electrical discharge machining", "Machining tribology", "MQL machining", "Nano-cutting fluids", "Soft robotics", "Bio-inspired robotics"],
        "bio": (
            "Dr. Anuj Kumar Sharma completed his B.E. in 2003, M.Tech in 2008, and Ph.D. in the field "
            "of machining with nano-cutting fluids in 2017. He is Associate Professor in the Mechatronics "
            "program, Dean Academics of the institute, and Program Coordinator of the Mechatronics and "
            "Manufacturing Technology & Automation programs. He has more than 75 SCIE and Scopus-indexed "
            "research papers published or presented in international journals and conferences of repute."
        ),
        "source_url": "https://cas.res.in/faculty.html",
    },
    {
        "slug": "saurabh-mishra",
        "name": "Dr. Saurabh Mishra",
        "title": "Assistant Professor",
        "department": "Energy Science and Technology",
        "degrees": ["Ph.D., Department of Petroleum Engineering, IIT (ISM), Dhanbad", "M.Tech., Petroleum Engineering, IIT (ISM), Dhanbad", "B.Tech., Mechanical Engineering, Uttar Pradesh Technical University, Lucknow"],
        "interests": ["Sand control methods at oil fields", "Enhanced oil recovery", "Application of nanotechnology in the oil industry"],
        "bio": (
            "Dr. Saurabh Mishra completed his doctorate at IIT (ISM) Dhanbad, researching chemical systems "
            "for consolidating sand formation to improve oil production. He previously worked as Assistant "
            "Professor and Academic Coordinator (Department of Petroleum Engineering) at Chandigarh "
            "University, Gharuan, Mohali, Punjab."
        ),
        "source_url": "https://cas.res.in/faculty.html",
    },
    {
        "slug": "av-ullas",
        "name": "Dr. A.V. Ullas",
        "title": "Assistant Professor",
        "department": "Nanotechnology",
        "degrees": ["Ph.D. (Applied Chemistry), Delhi Technological University, Delhi"],
        "interests": ["Polymeric nanofibres by electrospinning", "Polymer nanocomposites", "Syntactic foams"],
        "bio": (
            "Dr. A.V. Ullas is Assistant Professor in the Department of Nanoscience and Technology at CAS "
            "AKTU. He previously worked for two years as Assistant Professor in the Department of Plastics "
            "Engineering at CIPET: IPT Lucknow, and has published 7 research articles in journals of repute."
        ),
        "source_url": "https://cas.res.in/faculty.html",
    },
    {
        "slug": "siddharth-yadav",
        "name": "Dr. Siddharth Yadav",
        "title": "Assistant Professor",
        "department": "Manufacturing Technology & Automation",
        "degrees": ["Ph.D. (Mechanical Engineering), IIT (BHU), Varanasi", "M.Tech., Manufacturing Engineering, NIAMT (formerly NIFFT), Ranchi", "B.Tech. (Industrial and Production Engineering), IERT, AKTU"],
        "interests": ["Al-Si alloy", "Mechanical vibration (vibratory casting)", "Microstructure", "Physical and mechanical properties", "Fractography"],
        "bio": (
            "Dr. Siddharth Yadav earned his Ph.D. in Mechanical Engineering from IIT (BHU) Varanasi in 2023. "
            "He worked more than nine years in academic and industrial organizations, including Mahindra & "
            "Mahindra (Bolero Plant), Elkem South Asia, Amtek India, PTC Industries, BBD University Lucknow, "
            "and IET Lucknow, before joining CAS."
        ),
        "source_url": "https://cas.res.in/faculty.html",
    },
    {
        "slug": "vijay-singh",
        "name": "Dr. Vijay Singh",
        "title": "Assistant Professor",
        "department": "Energy Science and Technology",
        "degrees": ["Ph.D. (Chemical Engineering), IIT Guwahati, Assam", "M.Tech., IIT Guwahati, Assam (Petroleum Refinery Engineering)", "B.Tech. (Chemical Engineering), BIET Jhansi, Uttar Pradesh"],
        "interests": ["Ceramic membrane fabrication and its application", "Clean coal recovery", "Fruit juice clarification and storage"],
        "bio": (
            "Dr. Vijay Singh previously worked as Assistant Professor in the Department of Chemical "
            "Engineering, Institute of Engineering & Technology Lucknow, from August 2018 to December 2023, "
            "before joining CAS."
        ),
        "source_url": "https://cas.res.in/faculty.html",
    },
    {
        "slug": "vibhu-kumar-tripathi",
        "name": "Dr. Vibhu Kumar Tripathi",
        "title": "Assistant Professor",
        "department": None,
        "degrees": ["Ph.D. (Electrical Engineering), IIT Kanpur", "M.Tech., Control & Instrumentation, MNNIT Allahabad", "B.Tech. (Electrical and Electronics Engineering), AKTU"],
        "interests": ["Aerial robotics and control", "Fault-tolerant control", "Intelligent control", "Nonlinear observer design for quadrotor UAVs"],
        "bio": (
            "Dr. Vibhu Kumar Tripathi has published 4 research articles in SCI journals and 3 book "
            "chapters, followed by 9 international conferences. His work has appeared in IEEE Systems "
            "Journal, IET Control Theory & Applications, and IEEE Transactions on Neural Networks and "
            "Learning Systems, among others."
        ),
        "source_url": "https://cas.res.in/faculty.html",
    },
    {
        "slug": "naresh-chandra-maurya",
        "name": "Dr. Naresh Chandra Maurya",
        "title": "Assistant Professor",
        "department": None,
        "degrees": ["Ph.D., Experimental Condensed Matter Physics, IISER Bhopal (2024)", "M.Sc., Physics, Banaras Hindu University, Varanasi (2018)", "B.Sc., Physics, MJPRU Bareilly (2016)"],
        "interests": ["Synthesis and optical characterization of nanomaterials", "Photoluminescence spectroscopy", "Ultrafast carrier dynamics (transient absorption spectroscopy)", "Nonlinear optical phenomena", "Optoelectronic device applications"],
        "bio": (
            "Dr. Naresh Chandra Maurya previously served as Assistant Professor at MANIT Bhopal (2024-25). "
            "He has published 8 research articles in SCI-indexed international journals and 3 conference "
            "papers, and holds fellowships including CSIR-NET JRF (AIR 206) and an INSPIRE Fellowship (DST)."
        ),
        "source_url": "https://cas.res.in/faculty.html",
    },
    {
        "slug": "parul-singh",
        "name": "Dr. Parul Singh",
        "title": "Assistant Professor",
        "department": "English",
        "degrees": ["Ph.D., English Literature, University of Lucknow (2005)", "M.A., English, CSJM University, Kanpur (2002)", "B.A. (Honors), English, CSJM University, Kanpur (2000)"],
        "interests": ["Diaspora literature and identity representation", "Professional communication pedagogy", "Cross-cultural communication", "Impact of digital media on language teaching and learning"],
        "bio": (
            "Dr. Parul Singh previously served as Subject Matter Expert in Professional Communication at "
            "the Faculty of Engineering and Technology, University of Lucknow (2023-25), and as Assistant "
            "Professor there (2017-19), where she established a Language Lab. She is a Subject Matter "
            "Expert on the TCS-iON panel."
        ),
        "source_url": "https://cas.res.in/faculty.html",
    },
    {
        "slug": "prachi-gupta",
        "name": "Dr. Prachi Gupta",
        "title": "Assistant Professor",
        "department": "Mathematics",
        "degrees": ["Ph.D. (Mathematics), University of Delhi", "M.Phil. (Mathematics), University of Delhi", "M.Sc., Mathematics, University of Delhi", "B.Sc. (Honors), Mathematics, University of Delhi"],
        "interests": ["Finite fields", "Differential uniformity", "Nonlinearity", "Permutations"],
        "bio": (
            "Dr. Prachi Gupta was previously a Postdoctoral Fellow in the Department of Computer Science "
            "at Ashoka University and a Guest Assistant Professor at Dr. Bhim Rao Ambedkar College and "
            "Daulat Ram College, University of Delhi. She qualified CSIR-UGC NET (JRF) with AIR 12 and "
            "holds a National Board for Higher Mathematics Ph.D. Scholarship."
        ),
        "source_url": "https://cas.res.in/faculty.html",
    },
    {
        "slug": "narendra-pal",
        "name": "Dr. Narendra Pal",
        "title": "Assistant Professor",
        "department": "Electronics & VLSI Engineering",
        "degrees": ["Ph.D., Optical Sensors, NIT Patna", "M.Tech., Communication Systems & Signal Processing, JIIT Noida", "B.Tech., Electronics and Telecommunication Engineering, IET MJP Rohilkhand University, Bareilly"],
        "interests": ["Optical communication", "Wireless and mobile communication", "Fiber optic sensors", "Photonic devices", "Plasmonics", "2D nanomaterials and metamaterials in sensing"],
        "bio": (
            "Dr. Narendra Pal has published 15 research articles in SCI journals and 7 book chapters, "
            "followed by 15 international conferences, in journals including Plasmonics, IEEE Sensors "
            "Journal, and Optical & Quantum Electronics."
        ),
        "source_url": "https://cas.res.in/faculty.html",
    },
    {
        "slug": "hrishikesh-kumar-singh",
        "name": "Mr. Hrishikesh Kumar Singh",
        "title": "Assistant Professor",
        "department": "Civil / Environmental Engineering",
        "degrees": ["Ph.D. (pursuing), Environmental Engineering, AKTU", "M.Tech., Environmental Engineering, Madan Mohan Malviya University of Technology, Gorakhpur", "B.Tech., Civil Engineering, AKTU"],
        "interests": ["Surface water and groundwater quality assessment", "Air quality and pollution control", "Solid and plastic waste management", "Machine learning in environmental engineering"],
        "bio": (
            "Mr. Hrishikesh Kumar Singh has more than six years of academic and research experience, "
            "including at IET Lucknow, REC Kannauj, and HBTU Kanpur. He has authored 6 peer-reviewed "
            "publications in SCIE/Scopus-indexed journals and 2 international book chapters."
        ),
        "source_url": "https://cas.res.in/faculty.html",
    },
    {
        "slug": "chandramani-upadhyay",
        "name": "Dr. Chandramani Upadhyay",
        "title": "Assistant Professor",
        "department": "Mechanical Engineering",
        "degrees": ["Ph.D., Production Engineering, NIT Rourkela, Odisha", "M.Tech., Production Engineering, NIT Rourkela, Odisha", "B.Tech., Mechanical Engineering, AKTU"],
        "interests": ["Machining of aero-engine alloys", "Characterisation", "Coatings for cutting tools", "Electrical discharge machining", "Metal cutting operations"],
        "bio": (
            "Dr. Chandramani Upadhyay's doctoral research on machining Ni-based superalloys was carried "
            "out partly at IIT Bhilai. He has published 12 research articles in SCI-indexed journals and "
            "5 in Scopus-indexed international journals, including in Journal of Manufacturing Processes "
            "and Tribology International."
        ),
        "source_url": "https://cas.res.in/faculty.html",
    },
    {
        "slug": "rohit-prakash",
        "name": "Dr. Rohit Prakash",
        "title": "Assistant Professor",
        "department": "Chemistry",
        "degrees": ["Ph.D. (Chemistry), University of Lucknow", "M.Sc. (Chemistry), University of Lucknow", "B.Sc. (Chemistry, Botany), Christian Degree College, University of Lucknow"],
        "interests": ["Synthesis and isolation of natural products, characterization and biological screening", "Computational chemistry (DFT studies, in-silico analysis)", "X-ray crystallography"],
        "bio": (
            "Dr. Rohit Prakash has more than 9 years of post-Ph.D. teaching experience, including at IET "
            "Lucknow and Shri Ramswaroop Memorial University (SRMU). He has published 16 research articles "
            "indexed in SCI/Scopus and 1 book chapter on forensic chemistry, and received the E-Learning "
            "Excellence Award 2020 from IQAC, SRMU."
        ),
        "source_url": "https://cas.res.in/faculty.html",
    },
]

VISITING_FACULTY = [
    {
        "slug": "kb-naik",
        "name": "Dr. K.B. Naik",
        "title": "Professor (Visiting)",
        "department": "Electrical Engineering",
        "degrees": ["Ph.D., Electrical Engineering, Kanpur University (1984)", "M.Tech., Power System, Nagpur University (1972)", "B.Sc. (Electrical Engineering), Kanpur University (1969)"],
        "interests": ["Power systems", "Research methodology"],
        "bio": (
            "Dr. K.B. Naik has held posts including Director at Kamla Nehru Institute of Technology, "
            "Sultanpur (2000-06), Director at Raj Kumar Goel Institute of Technology, Ghaziabad (2007-08), "
            "and at College of Engineering Science and Technology, Lucknow (2008-11). He is a Fellow of "
            "the Institution of Engineers (India) and a Fellow of the Institution of Electronics and "
            "Telecommunication Engineers (India)."
        ),
        "source_url": "https://cas.res.in/visitingfaculty.html",
    },
    {
        "slug": "vijay-tiwari",
        "name": "Dr. Vijay Tiwari",
        "title": "Visiting Faculty",
        "department": None,
        "degrees": ["Ph.D., SVS University", "Master of Engineering, Indian Institute of Science, Bengaluru", "B.Tech., Military College of Engineering"],
        "interests": ["Computer networks", "Cyber security", "Wireless and satellite networks"],
        "bio": (
            "Dr. Vijay Tiwari is a 1991-batch defence officer and alumnus of the Indian Military Academy, "
            "Dehradun. He was visiting faculty at the University of South Sudan, Malakal, and has served "
            "as Chief Operations Officer in a United Nations Mission Sector HQ during peacekeeping operations."
        ),
        "source_url": "https://cas.res.in/visitingfaculty.html",
    },
    {
        "slug": "kv-arya",
        "name": "Dr. K.V. Arya",
        "title": "Adjunct Faculty",
        "department": "Computer Science and Engineering",
        "degrees": ["Ph.D., Computer Science and Engineering, IIT Kanpur", "M.E. (Integrated), Electrical Engineering, Indian Institute of Science, Bangalore (1991)"],
        "interests": ["Image processing", "Biometrics (face/iris recognition)", "Wireless ad hoc networks", "Information security"],
        "bio": (
            "Dr. K.V. Arya has more than 24 years of teaching experience, has guided 8 Ph.D. and 76 M.Tech. "
            "dissertations, and has published more than 150 journal and conference papers. He is Senior "
            "Member of IEEE, Fellow of IETE, and a life member of ISTE."
        ),
        "source_url": "https://cas.res.in/visitingfaculty.html",
    },
    {
        "slug": "vrijendra-singh",
        "name": "Dr. Vrijendra Singh",
        "title": "Assistant Professor (Visiting)",
        "department": None,
        "degrees": ["Ph.D. (Computer Science), Dayalbagh Educational Institute, Agra", "M.Sc. (Computer Science), Dayalbagh Educational Institute, Agra (2002)"],
        "interests": ["Data mining", "Machine learning", "Blind source separation", "Digital signal and image processing", "Information security & forensics"],
        "bio": (
            "Dr. Vrijendra Singh is an Associate Professor at IIIT Allahabad, with more than 13 years of "
            "research experience, including as Senior Project Associate at the Department of EE, IIT Kanpur."
        ),
        "source_url": "https://cas.res.in/visitingfaculty.html",
    },
    {
        "slug": "manish-kumar",
        "name": "Dr. Manish Kumar",
        "title": "Visiting Faculty",
        "department": None,
        "degrees": ["Ph.D., Indian Institute of Information Technology, Allahabad", "M.Tech. (Computer Science), Birla Institute of Technology, Mesra (2002)"],
        "interests": ["Data management in wireless sensor networks", "Big data analytics", "Data mining"],
        "bio": (
            "Dr. Manish Kumar is an Associate Professor at IIIT Allahabad with more than 15 years of "
            "teaching experience, and initiated the Data Analytics Lab there."
        ),
        "source_url": "https://cas.res.in/visitingfaculty.html",
    },
]

STAFF = [
    {
        "slug": "veer-vikram-singh",
        "name": "Mr. Veer Vikram Singh",
        "title": "Research Engineer",
        "department": None,
        "degrees": ["M.Sc. IT, SMU", "B.Sc. (Computer Science), Lucknow University", "Cisco Certified Network Associate"],
        "interests": ["Networking", "System administration", "System security"],
        "bio": "Manages networking, servers, and security configuration at CAS, with prior experience configuring the network for the UP State Data Centre's UPE-district project.",
        "source_url": "https://cas.res.in/staff.html",
    },
    {
        "slug": "diyanshu-chauhan",
        "name": "Mr. Diyanshu Chauhan",
        "title": "Research Engineer",
        "department": None,
        "degrees": ["Masters, Guru Gobind Singh Indraprastha University, New Delhi (Computer Application)"],
        "interests": ["Web application development", "Database systems", "AI", "Software testing"],
        "bio": "More than 4 years of industrial experience in software design, testing, and maintenance, including work on bioinformatics databases and ERP software modules.",
        "source_url": "https://cas.res.in/staff.html",
    },
    {
        "slug": "gaurav-rai",
        "name": "Mr. Gaurav Rai",
        "title": "Research Engineer",
        "department": None,
        "degrees": ["M.Tech., Amity University", "PG Diploma, CDAC ACTS, Pune"],
        "interests": ["Embedded systems", "Real-time operating systems", "FPGA and ASIC design", "IoT"],
        "bio": "More than 4 years of industry experience across automobile, networking, and small-scale industry sectors.",
        "source_url": "https://cas.res.in/staff.html",
    },
    {
        "slug": "shubhi-pandey",
        "name": "Ms. Shubhi Pandey",
        "title": "Computer Programmer, Grade 1",
        "department": None,
        "degrees": ["B.Tech., Information Technology, AKTU, Lucknow"],
        "interests": ["Software engineering", "Big data", "Object-oriented programming"],
        "bio": "More than 8 years of industrial experience in software engineering; contributed to the UP government URISE project and AKTU ERP modules including PhD, UIIC, and AMS.",
        "source_url": "https://cas.res.in/staff.html",
    },
    {
        "slug": "sadka-kouser",
        "name": "Ms. Sadka Kouser",
        "title": "Computer Programmer, Grade 1",
        "department": None,
        "degrees": ["MCA, Integral University"],
        "interests": ["Big data", "Data science", "Open-source technologies"],
        "bio": "8 years of industrial experience; a core programmer of AKTU ERP, with expertise in domain analysis, examination and payment modules, and result processing.",
        "source_url": "https://cas.res.in/staff.html",
    },
    {
        "slug": "ram-kumar-pathak",
        "name": "Dr. Ram Kumar Pathak",
        "title": "Assistant Librarian, CAS; Digital Library In-Charge, AKTU Central Digital Library",
        "department": "Library",
        "degrees": ["Ph.D., Assam University (Central University), Silchar", "BLIS, MLIS, PGDLAN, UGC-NET", "M.Sc. (Physics, solid state electronics)", "B.Sc. (Physics Honors)"],
        "interests": ["E-learning", "Digital library management", "Knowledge management", "Digital library automation and policy"],
        "bio": (
            "Dr. Ram Kumar Pathak has served as Digital Library In-Charge and Assistant Librarian at CAS "
            "AKTU since April 2018. He previously served as Chief Librarian at Vidya Knowledge Park, "
            "Meerut (2006-18), and Librarian at Pioneer Institute of Academics, Meerut (2000-05)."
        ),
        "source_url": "https://cas.res.in/staff.html",
    },
    {
        "slug": "anurag-chaubey",
        "name": "Mr. Anurag Chaubey",
        "title": "Junior Research Engineer",
        "department": "Mechatronics",
        "degrees": ["M.Tech., Electrical Engineering", "B.Tech. (Electrical Engineering), Maharana Pratap Engineering College, Kanpur (AKTU)"],
        "interests": ["PLC", "SCADA", "3D printing", "Industrial automation", "Electrical drives"],
        "bio": "Handles the 3D Printing Lab, Industrial Automation Lab, Tribology Lab, and Kuka Robotics Centre under the Mechatronics Department; more than 4 years of experience in industrial automation.",
        "source_url": "https://cas.res.in/staff.html",
    },
    {
        "slug": "monika-singh",
        "name": "Ms. Monika Singh",
        "title": "Junior Research Engineer",
        "department": None,
        "degrees": ["B.Tech. (Honors), United College of Engineering and Research (AKTU)"],
        "interests": ["MEMS and NEMS devices", "Micro/nano device design", "Micro-nano scale fabrication and characterization"],
        "bio": "More than 4 years of research experience, including as project assistant at the Centre for Nano Science and Engineering, IISc Bangalore, on an ISRO gas sensors project.",
        "source_url": "https://cas.res.in/staff.html",
    },
    {
        "slug": "mukesh-kumar-mourya",
        "name": "Mr. Mukesh Kumar Mourya",
        "title": "PS to Director",
        "department": None,
        "degrees": ["B.Sc., Dr. RML Avadh University, Faizabad, Uttar Pradesh"],
        "interests": ["Administration"],
        "bio": "Previously served as a stenographer on an ICSSR project at the Giri Institute of Development Studies, Lucknow, and as private stenographer to the Legal Advisor to the Governor of Uttar Pradesh.",
        "source_url": "https://cas.res.in/staff.html",
    },
]
