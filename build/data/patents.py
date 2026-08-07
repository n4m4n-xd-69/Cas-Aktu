"""
Patent records — docs/INFORMATION_ARCHITECTURE.md #3 "Patent" content type
(title, inventors, jurisdiction, application/grant number, status, dates,
public reference).

Real content: research/cas-content-inventory.json, research1.html,
"Patents and Intellectual Properties" table — all 10 rows transcribed
(this table, unlike Publications, was short enough to migrate in full).
Jurisdiction is India (Indian Patent Office application numbers) for all —
not stated explicitly per-row in the source but implied by the application
number format; flagged as inferred, not copied verbatim from source text.
"""

PATENTS = [
    {
        "title": "A System and Method for Machine Learning Based Automatic Detection of Abnormality from Cardiac Sound",
        "application_number": "201911033584", "date": "21.08.2019", "status": "Applied and under examination",
        "inventors": "M.K. Dutta, Anjali Yadav, Abhishek Kaushal",
    },
    {
        "title": "Multi-Mode Real-time Object Detector and Obstacle Aware Assistive System for Visually Impaired Person (VIP)",
        "application_number": "201911047766", "date": "22.11.2019", "status": "Applied and under examination",
        "inventors": "M.K. Dutta, Rakesh Chandra Joshi, Saumya Yadav",
    },
    {
        "title": "Artificial Intelligence based System and Method for Multi-Class Classification of Heart Diseases",
        "application_number": "201911047767", "date": "22.11.2019", "status": "Applied and under examination",
        "inventors": "M.K. Dutta, Shivansh Dubey, Raghuvendra Pratap Tripathi, Anjali Yadav",
    },
    {
        "title": "Automatic Detection of Lungs Disease using Machine Learning from Respiratory Sound",
        "application_number": "202011009043", "date": "03.03.2020", "status": "Applied and under examination",
        "inventors": "Neeraj Baghel, M.K. Dutta",
    },
    {
        "title": "Artificial Intelligence based COVID-19 Screening Tool based on Analysis of X-ray Images",
        "application_number": "202011024438", "date": "10.06.2020", "status": "Applied and under examination",
        "inventors": "Rakesh Chandra Joshi, Saumya Yadav, M.K. Dutta, Vinay Kumar Pathak, M.L. Bhatt, Anit Parihar, Hardeep Singh Malhotra",
    },
    {
        "title": "System and Method for Sanitizing Currency Note(s)",
        "application_number": "202011035026", "date": "14.08.2020", "status": "Published, no. E-12/948/2020/DEL, under examination",
        "inventors": "Anuj Kumar Sharma, Mahip Singh",
    },
    {
        "title": "The Rapid Multipurpose Disinfector",
        "application_number": "202011037517", "date": "31.08.2020", "status": "Applied and under examination",
        "inventors": "Anuj Kumar Sharma, Mahip Singh",
    },
    {
        "title": "Oxygen Monitoring & Control, Multi-Functional Convertible Robot for Hospitals",
        "application_number": None, "date": None, "status": "Filed, awaiting application number",
        "inventors": "Mahip Singh, Anuj Kumar Sharma, Amit Rai Dixit",
    },
    {
        "title": "ITPI — Steel and Mining Waste Management: Intelligent Technology and Process Management for Steel Industry and Mining Waste",
        "application_number": "202011047142", "date": "29.10.2020", "status": "Applied and under examination",
        "inventors": "Navneet Kumar, Anuj Kumar Sharma, Brijesh Singh, Yatender Chaturvedi, Sanjeev Kumar Sharma, Rakesh Kumar Yadav",
    },
    {
        "title": "Oil Remediation Composite and Method for Synthesis Thereof",
        "application_number": "202211030925", "date": "30.05.2022", "status": "Applied and under examination",
        "inventors": "Dr. Saurabh Mishra, Ujjawal Singh, Dr. Anuj Kumar Sharma",
    },
]
