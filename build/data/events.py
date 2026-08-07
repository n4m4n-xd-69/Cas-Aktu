"""
Event records — docs/INFORMATION_ARCHITECTURE.md #3 "Event" content type
(title, start/end/timezone, venue/mode, organizer, registration, status).

Real content transcribed from research/cas-content-inventory.json,
workshops.html: four workshop tables (an unlabeled "June-July 2023" batch,
a "Phase 2" batch, an unlabeled batch immediately following it, and "Phase
1") totaling 42 entries. All are training workshops run by CAS faculty for
students — every one is dated 2022-23, so every record's status is Completed
or Postponed, never Open (this is exactly the archival content the homepage
and /updates/ pages already flag as distinct from the current 2026-27
notices — see build/data/notices.py).

Status mapping from the source's own registration-column text:
  "Registration Closed"                      -> Completed
  "postponed till further notice" (any case) -> Postponed
Timezone: Asia/Calcutta (PRD default) for every entry — the source gives
no other timezone.
"""

EVENTS = [
    # -- June-July 2023 batch --
    {"title": "Nanotechnology for Battery and Super Capacitor Applications", "mode": "Offline",
     "organizer": "Dr. Chandresh Kumar Rastogi, Dr. Gyanprakash Maurya", "dates": "2-3 June 2023", "status": "Completed"},
    {"title": "Robotics and Artificial Intelligence", "mode": "Offline",
     "organizer": "Dr. Jitendra Kumar", "dates": "5-6 June 2023", "status": "Completed"},
    {"title": "Nanotechnology for Modern Applications", "mode": "Offline",
     "organizer": "Dr. A.V. Ullas, Dr. Saurabh Mishra", "dates": "8-9 June 2023", "status": "Completed"},
    {"title": "Nanotechnology in Physics, Environment and Engineering", "mode": "Offline",
     "organizer": "Dr. Manjari Shukla, Dr. A.V. Ullas", "dates": "13-14 June 2023", "status": "Completed"},
    {"title": "Hands-on Workshop on PLC, Microcontroller and Sensors", "mode": "Offline",
     "organizer": "Dr. Anuj Kumar Sharma, Dr. Rabesh Kumar Singh", "dates": "16-17 June 2023", "status": "Completed"},
    {"title": "Artificial Intelligence and Machine Learning", "mode": "Offline",
     "organizer": "Dr. Jagrati Singh, Dr. Prateek Raj Gautam", "dates": "20-21 June 2023", "status": "Postponed"},
    {"title": "A Hands-on Workshop on Introduction to Additive Manufacturing / 3D Printing", "mode": "Offline",
     "organizer": "Dr. Dipesh Kumar Mishra, Dr. Rabesh Kumar Singh", "dates": "22-23 June 2023", "status": "Completed"},
    {"title": "Metal Failures Due to Corrosion", "mode": "Offline",
     "organizer": "Dr. Gopal Ji", "dates": "26-27 June 2023", "status": "Completed"},
    {"title": "Workshop on Drone Technology", "mode": "Offline",
     "organizer": "Dr. Anuj Kumar Sharma", "dates": "3-4 July 2023", "status": "Completed"},
    {"title": "Workshop on Industrial Automation", "mode": "Offline",
     "organizer": "Dr. Anuj Kumar Sharma, Dr. Rabesh Kumar Singh", "dates": "6-7 July 2023", "status": "Completed"},
    # -- "Phase 2" batch, 2022 --
    {"title": "Artificial Intelligence for Business Analytics", "mode": "Offline",
     "organizer": "Prof. M.K. Dutta", "dates": "21-25 November 2022", "status": "Completed"},
    {"title": "Artificial Intelligence for Pharmacy", "mode": "Offline",
     "organizer": "Prof. M.K. Dutta", "dates": "28 November-2 December 2022", "status": "Completed"},
    {"title": "Artificial Intelligence for Biotechnology & Healthcare", "mode": "Offline",
     "organizer": "Prof. M.K. Dutta", "dates": "5-9 December 2022", "status": "Completed"},
    {"title": "2 Days Hands-on Training on Drone Technology", "mode": "Offline",
     "organizer": "Dr. Anuj K. Sharma; system support Mr. Anurag Chaubey", "dates": "9-10 November 2022", "status": "Completed"},
    {"title": "Artificial Intelligence: Deep Learning and Machine Learning", "mode": "Online",
     "organizer": "Prof. M.K. Dutta", "dates": "10-12 October 2022", "status": "Completed"},
    {"title": "Augmented Reality Workshop", "mode": "Offline",
     "organizer": "Mr. Divyanshu Chauhan", "dates": "1-2 September 2022", "status": "Completed"},
    {"title": "2 Days Hands-on Training on Drone Technology", "mode": "Offline",
     "organizer": "Dr. Anuj K. Sharma; system support Mr. Anurag Chaubey", "dates": "29-30 July 2022", "status": "Completed"},
    # -- unlabeled batch immediately following "Phase 2", 2022 --
    {"title": "Augmented Reality Workshop and Demonstration", "mode": "Online",
     "organizer": "Mr. Divyanshu Chauhan, Mr. Gaurav Rai", "dates": "18-20 May 2022", "status": "Completed"},
    {"title": "Electrochemistry Tools for Corrosion Analysis", "mode": "Offline",
     "organizer": "Dr. Gopal Ji", "dates": "postponed till further notice", "status": "Postponed"},
    {"title": "Introduction to Blockchain Technologies", "mode": "Offline",
     "organizer": "Dr. Vrinda Yadav, Mr. Divyanshu Chauhan", "dates": "postponed till further notice", "status": "Postponed"},
    {"title": "A Brief Introduction and Hands-on 3D Printing", "mode": "Offline",
     "organizer": "Dr. Rabesh Kumar Singh, Dr. Dipesh Kumar Mishra", "dates": "16-17 June 2022", "status": "Completed"},
    {"title": "A Hands-on Training on Industrial Automation", "mode": "Offline",
     "organizer": "Dr. Anuj Kumar Sharma", "dates": "postponed till further notice", "status": "Postponed"},
    {"title": "Artificial Intelligence: Deep Learning and Machine Learning", "mode": "Online",
     "organizer": "Prof. M.K. Dutta", "dates": "23-25 June 2022", "status": "Completed"},
    {"title": "Laboratory Techniques for Nanomaterials Synthesis and Characterization", "mode": "Offline",
     "organizer": "Dr. Chandresh K. Rastogi, Dr. A.V. Ullas", "dates": "7-8 July 2022", "status": "Completed"},
    {"title": "Robotics: Motion Planning of Industrial Manipulators and Humanoid Robots", "mode": "Offline",
     "organizer": "Dr. Jitendra Kumar, Mr. Anurag Chaubey", "dates": "postponed till further notice", "status": "Postponed"},
    # -- "Phase 1" batch, 2022 --
    {"title": "Artificial Intelligence: Deep Learning and Machine Learning", "mode": "Online",
     "organizer": "Prof. M.K. Dutta", "dates": "21-25 March 2022", "status": "Completed"},
    {"title": "Industrial Automation and Smart Manufacturing", "mode": "Offline",
     "organizer": "Dr. Anuj Kumar Sharma, Mr. Gaurav Rai", "dates": "22-26 March 2022", "status": "Completed"},
    {"title": "Advanced Manufacturing Process", "mode": "Offline",
     "organizer": "Dr. Anuj Kumar Sharma, Mr. Gaurav Rai", "dates": "27-31 March 2022", "status": "Completed"},
    {"title": "Cyber Security: Art of Ethical Hacking", "mode": "Offline",
     "organizer": "Dr. Arun Kumar, Mr. Gaurav Rai", "dates": "28-30 March 2022", "status": "Completed"},
    {"title": "Electrochemical Catalysis for Energy Conversion and Storage Application", "mode": "Offline",
     "organizer": "Dr. Gyanprakash Maurya", "dates": "30-31 March 2022", "status": "Completed"},
    {"title": "Synthesis and Characterization of Nanomaterials: Theory and Experiments", "mode": "Offline",
     "organizer": "Dr. Chandresh K. Rastogi, Dr. A.V. Ullas", "dates": "1-2 April 2022", "status": "Completed"},
    {"title": "Android App Development", "mode": "Online",
     "organizer": "Dr. Anamika Jain, Mr. Divyanshu Chauhan", "dates": "1-5 April 2022", "status": "Completed"},
    {"title": "Nanomaterials for Energy Conversion and Storage Applications", "mode": "Online",
     "organizer": "Dr. Chandresh K. Rastogi, Dr. Gyanprakash Maurya", "dates": "4-8 April 2022", "status": "Completed"},
    {"title": "Corrosion and Corrosion Monitoring Techniques: An Academic and Industrial Problem", "mode": "Online",
     "organizer": "Dr. Gopal Ji", "dates": "4-13 April 2022", "status": "Completed"},
    {"title": "Internet of Things (IoT)", "mode": "Offline",
     "organizer": "Dr. Vrinda Yadav, Mr. Divyanshu Chauhan", "dates": "7-8 April 2022", "status": "Completed"},
    {"title": "Application of 3D Printers", "mode": "Offline",
     "organizer": "Dr. Rabesh Kumar Singh", "dates": "7-8 April 2022", "status": "Completed"},
    {"title": "Industrial Robotics: Motion Planning of Robotics Systems", "mode": "Offline",
     "organizer": "Dr. Jitendra Kumar", "dates": "11-12 April 2022", "status": "Completed"},
    {"title": "Combating Cyber Crime with Modern Technologies", "mode": "Online",
     "organizer": "Mr. Veer Vikram Singh, Mr. Anurag Chaubey", "dates": "11-13 April 2022", "status": "Completed"},
    {"title": "Nanotechnology in the Oil Industry", "mode": "Online",
     "organizer": "Dr. Saurabh Mishra", "dates": "18-22 April 2022", "status": "Completed"},
    {"title": "Corrosion Monitoring Techniques: Research and Academic Style", "mode": "Offline",
     "organizer": "Dr. Gopal Ji", "dates": "10-13 May 2022", "status": "Completed"},
    {"title": "ANSYS Software", "mode": "Offline",
     "organizer": "Dr. Anuj Kumar Sharma, Mr. Divyanshu Chauhan", "dates": "9-13 May 2022", "status": "Completed"},
    {"title": "Solar Thermal Technologies", "mode": "Online",
     "organizer": "Dr. Pushpendra Kumar Singh Rathore", "dates": "9-13 May 2022", "status": "Completed"},
]

TIMEZONE = "Asia/Calcutta"
VENUE_LABEL = {"Offline": "On campus, Centre for Advanced Studies", "Online": "Online"}
STATUS_BADGE = {"Completed": "badge--archived", "Postponed": "badge--closing", "Canceled": "badge--canceled"}
