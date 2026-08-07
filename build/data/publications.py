"""
Publication records — docs/INFORMATION_ARCHITECTURE.md #3 "Publication"
content type (title, authors, year, venue, type, DOI/URL, verification).

Real content: research/cas-content-inventory.json, home page record,
"Recent Publications and Patents" section — 16 citations. This is the
site's own curated "recent/featured" subset, not the full output list.

The full "Publications by Faculty Members/Students" section on research1.html
runs to ~4,200 words and "Conference Proceedings/Book Chapters" to ~7,000
words more — likely several hundred additional citations. Transcribing all
of them by hand risked both accuracy (no structured delimiters to parse
against, same class of problem as the faculty external-link pairing) and
was a poor use of effort relative to value for a migration-draft pass; this
featured set is flagged as partial in the section intro, not silently
presented as complete. See Remaining Work.
"""

PUBLICATIONS = [
    {
        "authors": "Ritesh Maurya, Vinay Kumar Pathak, Radim Burget, Malay Kishore Dutta",
        "title": "Automated Detection of Bioimages using Novel Deep Feature Fusion Algorithm and An Effective High-Dimensional Feature Selection Approach",
        "venue": "Computers in Biology and Medicine", "volume": "Volume 137", "year": "2021",
        "doi": "10.1016/j.compbiomed.2021.104862", "publisher": "Elsevier", "impact_factor": "4.589",
    },
    {
        "authors": "Neeraj Baghel, Vivek Nangia, M.K. Dutta",
        "title": "ALSD-Net: Automatic Lung Sounds Diagnosis Network from Pulmonary Signals",
        "venue": "Neural Computing and Applications", "volume": None, "year": "2021",
        "doi": "10.1007/s00521-021-06302-1", "publisher": "Springer Nature", "impact_factor": "5.606",
    },
    {
        "authors": "Rakesh Chandra Joshi, Rashmi Mishra, Punnet Gandhi, Vinay Kumar Pathak, Radim Burget, Malay Kishore Dutta",
        "title": "Ensemble-based Machine Learning Approach for Prediction of Glioma and Multi-grade Classification",
        "venue": "Computers in Biology and Medicine", "volume": "Volume 137", "year": "2021",
        "doi": "10.1016/j.compbiomed.2021.104829", "publisher": "Elsevier", "impact_factor": "4.589",
    },
    {
        "authors": "Monika Arora, Parthasarathi Mangipudi, Malay Kishore Dutta",
        "title": "A Low-Cost Imaging Framework for Freshness Evaluation from Multifocal Fish Tissues",
        "venue": "Journal of Food Engineering", "volume": None, "year": "2021",
        "doi": "10.1016/j.jfoodeng.2021.110777", "publisher": "Elsevier", "impact_factor": "5.345",
    },
    {
        "authors": "Rakesh Joshi, Divyanshu Singh, Vaibhav Tiwari, M.K. Dutta",
        "title": "An Efficient Deep Neural Network based Abnormality Detection and Multi-Class Breast Tumor Classification",
        "venue": "Multimedia Tools & Applications", "volume": None, "year": "2021",
        "doi": "10.1007/s11042-021-11240-0", "publisher": "Springer Nature", "impact_factor": "2.757",
    },
    {
        "authors": "Ramkrishna Sahoo, Tae Hoon Lee, Duy Tho Pham, Thi Hoai Thuong Luu, Young Hee Lee",
        "title": "Fast-Charging High-Energy Battery-Supercapacitor Hybrid: Anodic Reduced Graphene Oxide-Vanadium(IV) Oxide Sheet-on-Sheet Heterostructure",
        "venue": "ACS Nano", "volume": "13(9), 10776-10786", "year": "2019",
        "doi": None, "publisher": "American Chemical Society", "impact_factor": "15.881",
    },
    {
        "authors": "Abhilasha Singh, Malay Kishore Dutta",
        "title": "A Robust Zero-Watermarking Scheme for Tele-Ophthalmological Applications",
        "venue": "Computer and Information Sciences", "volume": "32(8), 895-908", "year": "2020",
        "doi": None, "publisher": "Elsevier", "impact_factor": "13.473",
    },
    {
        "authors": "Shweta Pal, Gopal Ji, Hassane Lgaz, Ill-Min Chung, Rajiv Prakash",
        "title": "Lemon Seeds as Green Coating Material for Mitigation of Mild Steel Corrosion in Acid Media: Molecular Dynamics Simulations, Quantum Chemical Calculations and Electrochemical Studies",
        "venue": "Journal of Molecular Liquids", "volume": "Volume 316, 113797", "year": "2020",
        "doi": "10.1016/j.molliq.2020.113797", "publisher": "Elsevier", "impact_factor": "6.165",
    },
    {
        "authors": "Monika Arora, M. Parthasarathi, Malay Kishore Dutta",
        "title": "Deep Learning Neural Networks for Acrylamide Identification in Potato Chips using Transfer Learning Approach",
        "venue": "Journal of Ambient Intelligence and Humanized Computing", "volume": None, "year": "2020",
        "doi": None, "publisher": "Springer Nature", "impact_factor": "7.104",
    },
    {
        "authors": "A.V. Ullas, P. Jaiswal",
        "title": "Halloysite Nanotubes Reinforced Epoxy Glass Microballoons Syntactic Foams",
        "venue": "Composites Communications", "volume": None, "year": "2020",
        "doi": "10.1016/j.coco.2020.100407", "publisher": "Elsevier", "impact_factor": "6.617",
    },
    {
        "authors": "Vaibhav Singh, Anuj Kumar Sharma, Ranjeet Kumar Sahu, Jitendra Kumar Katiyar",
        "title": "Novel Application of Graphite-Talc Hybrid Nanoparticle Enriched Cutting Fluid in Turning Operation",
        "venue": "Journal of Manufacturing Processes", "volume": "Volume 62, 378-387", "year": "2021",
        "doi": "10.1016/j.jmapro.2020.12.017", "publisher": "Elsevier", "impact_factor": "5.01",
    },
    {
        "authors": "Neeraj Baghel, Malay Kishore Dutta, Radim Burget",
        "title": "Automatic Diagnosis of Multiple Cardiac Diseases from PCG Signals using Convolutional Neural Network",
        "venue": "Computer Methods and Programs in Biomedicine", "volume": "Volume 197", "year": "2020",
        "doi": "10.1016/j.cmpb.2020.105750", "publisher": "Elsevier", "impact_factor": "5.428",
    },
    {
        "authors": "Anjali Yadav, Anushikha Singh, Malay Kishore Dutta, Carlos M. Travieso",
        "title": "Machine Learning Based Classification of Cardiac Diseases from PCG Recorded Heart Sounds",
        "venue": "Neural Computing and Applications", "volume": None, "year": "2020",
        "doi": "10.1007/s00521-019-04547-5", "publisher": "Springer", "impact_factor": "5.606",
    },
    {
        "authors": "Ashish Issac, Malay Kishore Dutta, Carlos M. Travieso",
        "title": "Automatic Computer Vision based Detection and Quantitative Analysis of Indicative Parameters for Grading of Diabetic Retinopathy",
        "venue": "Neural Computing and Applications", "volume": "32(20), 15687-15697", "year": "2020",
        "doi": "10.1007/s00521-018-3443-z", "publisher": "Springer Nature", "impact_factor": "5.606",
    },
    {
        "authors": "José Luis Vásquez, Antonio G. Ravelo-García, Jesús B. Alonso, Malay Kishore Dutta, Carlos M. Travieso",
        "title": "Writer Identification Approach by Holistic Graphometric Features using Offline Handwriting Words",
        "venue": "Neural Computing and Applications", "volume": "32(20), 15733-15746", "year": "2020",
        "doi": "10.1007/s00521-018-3461-x", "publisher": "Springer", "impact_factor": "5.606",
    },
    {
        "authors": "Carlos M. Travieso, Antonio G. Ravelo-García, Jesús B. Alonso, José M. Canino-Rodríguez, Malay Kishore Dutta",
        "title": "Improving the Performance of the Lip Identification through the Use of Shape Correction",
        "venue": "Applied Intelligence", "volume": None, "year": "2018",
        "doi": "10.1007/s10489-018-1352-6", "publisher": "Springer", "impact_factor": "5.086",
    },
]
