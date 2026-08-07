"""
Equipment records — docs/INFORMATION_ARCHITECTURE.md #3 "Equipment" content
type (name, facility, capability, specification, availability/contact).

Real content: research/cas-content-inventory.json, equip.html, "Major
Equipments" numbered table (49 rows). Descriptions are trimmed to one
real, load-bearing fact per item rather than the full paragraph (some run
400+ words) — CONTENT_MIGRATION_LAUNCH.md Phase C: "oversized pages ...
difficult to scan" applies here as much as it did to the research page.

Two real data-quality defects found in the source while transcribing (not
introduced by this migration, disclosed rather than silently reproduced):
  - Row 42 is a byte-for-byte duplicate of row 27 ("Automatic Micro Hardness
    Testing System") — kept as one record, not two.
  - Row 46 ("PLC SCADA-Part-A") has a description that is verbatim identical
    to row 31's Drone Systems Lab text — clearly a copy-paste error on the
    legacy site, not a real description of PLC/SCADA equipment. Recorded
    with no description rather than either inventing one or reproducing the
    wrong text as if it were accurate.
"""

EQUIPMENT = [
    {"name": "Nvidia DGX-2 Server (two petaFlops system)", "summary": "AI Lab GPU server — NVIDIA DGX-2, described in the source as the world's first 2-petaflops system, packing 16 GPUs."},
    {"name": "BET Measurement System", "summary": "Determines the surface area of materials."},
    {"name": "Industrial Robotic Center", "summary": "KUKA India-built center with three robotic cells: material handling, MIG welding, and bare robotic."},
    {"name": "Industrial Automation Lab", "summary": "Flexible Manufacturing System: AS/RS storage, CNC lathe/milling/grinding, 4- and 6-axis robots, AGV, assembly station."},
    {"name": "3D Printing Lab", "summary": "Additive manufacturing; two printers using fused material deposition and filament-based polymer deposition."},
    {"name": "Design and Simulation Center", "summary": "18 high-end workstations running SolidWorks, ANSYS, and MATLAB; integrated with the 3D Printing Lab."},
    {"name": "Sensor Drives & Control Lab", "summary": "Teaches sensor/controller/drive fundamentals and microcontroller programming in C++, Python, and MATLAB."},
    {"name": "Pin on Disc Tribometer", "summary": "Ducom Pin/Ball on Disk Tribometer for tribological characterization of materials, coatings, and lubricants."},
    {"name": "Human Non-invasive Blood Pressure (NIBP) Monitor", "summary": "Finger arterial pressure, systolic/diastolic, and heart-rate monitoring with Volume Clamp Technology."},
    {"name": "Equi-vital Physiological Monitoring System", "summary": "Wearable belt recording ECG, 3-axis acceleration, respiration, skin temperature, SpO2, and GSR."},
    {"name": "Markerless Motion Capture System (2-D Gait Analysis) with Force Plate", "summary": "16x2 ft platform measuring gait parameters — velocity, cadence, step length, centre of pressure."},
    {"name": "EMOTIV EPOC+ 14-Channel Mobile EEG", "summary": "Wireless EEG and 9-axis motion data over Bluetooth for brain-computer interface research."},
    {"name": "Auditory Brainstem Response (ABR) Audiometry System", "summary": "Neurologic test of auditory brainstem function via evoked potentials from click/tone stimuli."},
    {"name": "Delsys Wireless EMG System", "summary": "Wireless sensors recording electrical muscle activity for exercise physiology and rehabilitation research."},
    {"name": "FLIR E5 Thermal Imaging Camera", "summary": "10,800-pixel (120x90) infrared resolution, focus-free thermal imaging camera."},
    {"name": "SENSEnuts", "summary": "IoT prototyping stack — microcontroller with 802.15.4 transceiver plus environmental and meteorological sensors."},
    {"name": "Material Chemistry & Synthesis Laboratory", "summary": "Fume hood, spot extractors, magnetic stirrers, ultrasonic processor, vacuum furnace for nanomaterial synthesis."},
    {"name": "Field Emission Scanning Electron Microscope (FE-SEM) with EDAX Module", "summary": "Views shape, size, texture, and elemental composition of materials at micro/nano scale."},
    {"name": "Electrochemical Workstation", "summary": "Electrochemical energy storage, heavy-metal ion detection, and catalysis research."},
    {"name": "Impedance Analyser", "summary": "Electrical impedance characterization for fuel cells, photovoltaic cells, and batteries."},
    {"name": "Voyager Cyber City Simulator", "summary": "Automated modeling and monitoring of cyber-security threats across a simulated smart-city environment."},
    {"name": "Solar Simulator", "summary": "Simulates natural sunlight in lab conditions for testing solar cells and modules."},
    {"name": "HP Z238 Microtower Workstations, Google Developers Code Lab", "summary": "Collaboration with Google Asia Pacific Pvt. Ltd.; replicates a Google-style coding environment for students."},
    {"name": "Augmented Reality Lab", "summary": "HP Z2 G5 workstation and HPE ProLiant ML350 Gen10 server running AR Vuforia Studio, CREO Illustrate, and ThingWorx."},
    {"name": "Microwave Reactor (Anton Paar Monowave 450)", "summary": "High-performance monomode microwave reactor for synthesis up to 300°C and 30 bar."},
    {"name": "Drop Shape Analyzer — DSA100", "summary": "Measures contact angle and surface free energy for wetting/adhesion analysis on solid surfaces."},
    {"name": "Automatic Micro Hardness Testing System", "summary": "Vickers hardness testing via controlled diamond indentation."},
    {"name": "Atomic Force Microscopy NX10", "summary": "Park NX10 AFM for nanoscale materials research, including True Non-Contact mode."},
    {"name": "FTIR Spectrophotometer Alpha-II", "summary": "Identifies compounds (plastics, blends, coatings, resins, adhesives) via infrared spectroscopy."},
    {"name": "UV-Vis Spectrophotometer 3092", "summary": "Qualitative and quantitative molecular analysis via UV-visible absorbance spectroscopy."},
    {"name": "Drone Systems Lab", "summary": "Three drone systems (professional-grade, mini, and multispectral-sensor) for aerial imaging research."},
    {"name": "Thermogravimetric Analyser (TGA)", "summary": "Monitors sample mass versus temperature/time up to 1600°C for material characterization."},
    {"name": "Spray Pyrolysis Unit", "summary": "PC-automated thin-film deposition system, used especially for solar cell development."},
    {"name": "Nano Fiber Electrospinning", "summary": "Produces nano/micro fibers (50nm-5 microns) from polymers, carbon nanotubes, and other materials."},
    {"name": "Four-Probe Workstation", "summary": "Measures sheet resistance and resistivity of conducting and semiconducting materials."},
    {"name": "Dip Coating Unit", "summary": "Programmable substrate dip-coating with heating-chamber temperature control up to 75°C."},
    {"name": "Spin Coater", "summary": "Tabletop spin-coating system with programmable spin duration, speed, and acceleration."},
    {"name": "Lee's Disc Thermal Conductivity Apparatus", "summary": "Measures thermal conductivity in poor conductors via a brass-disc heat-flow setup."},
    {"name": "Hall Effect Measurement", "summary": "Holmarc's apparatus measuring Hall voltage as a function of current, magnetic flux, and temperature using doped germanium samples."},
    {"name": "Stereo Zoom Microscope", "summary": "Stereo imaging with 0.63x-6.3x zoom (3.15x-378x effective magnification)."},
    {"name": "Quantum Efficiency System", "summary": "Measures spectral response and quantum efficiency of solar cells across 400-1200nm."},
    {"name": "Micro EDM Machine", "summary": "Fabricates 3D micro-scale structures for MEMS and biomedical-implant applications."},
    {"name": "Optical Microscope", "summary": "Metallurgical microscope for microstructure, grain boundary, and porosity analysis."},
    {"name": "Die Electric-Discharge Machining (with MQL System)", "summary": "Non-traditional machining via repeated electrical discharges, for hard-to-machine components."},
    {"name": "PLC SCADA — Part A", "summary": None},  # source description is a verbatim copy of Drone Systems Lab's text — a real content bug, not reproduced here (see module docstring)
    {"name": "Language Lab with Headphones and i7 Systems", "summary": "Dell Optiplex i7 systems with headphones and audio-visual software for language learning."},
    {"name": "Linux / Open Source Lab", "summary": "22 Dell Optiplex i7 systems running Ubuntu Linux and Kali Linux."},
    {"name": "General Purpose Computing Lab", "summary": "32 Dell Optiplex systems on Windows 10 with development tooling (Java SDK, GNS3, Android SDK, Visual Studio, and others)."},
]
