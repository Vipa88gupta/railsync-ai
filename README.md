# 🚆 RailSync AI

> **Automatic Block Planning & Multi-Department Coordination System for Indian Railways**  
> *Decision-Support System for Chief Section Controllers (Kanpur Division)*

👉 **[🌐 View Live Dashboard Demo](https://vipa88gupta.github.io/railsync-ai/)**

---

## 📌 Overview

RailSync AI solves the critical efficiency bottleneck in Indian Railways infrastructure maintenance:
- **The Problem**: Engineering (TMS), Signals & Telecom (SMMS), and Traction Electrical (TDMS) teams currently request separate track maintenance blocks across different days, causing excessive train detentions and inefficient track utilization.
- **The Solution**: RailSync AI ingests defect data from all three systems, scores urgency, clusters nearby compatible jobs, and uses **Google OR-Tools (CP-SAT)** to schedule combined maintenance into a single quiet night window (e.g., `01:30 AM – 04:00 AM`) with **zero passenger train delays**.

---

## 🌟 Key Features

1. **Prominent Centered Operations Header**: Integrated status tracking for `TMS`, `SMMS`, `TDMS`, `COA`, and `BDMS`.
2. **Prioritized Defect Queue**: Multi-factor urgency scoring based on Defect Severity, Age of Defect, Track Safety Risk, and Traffic Impact.
3. **Corridor Timetable Stream (COA Feed)**: 2-column live stream comparing scheduled trains with available free timetable gaps.
4. **Compatible Work Grouping**: Consolidates Track Weld Repair, Overhead Wire Tightening, and Switch Motor Maintenance into one quiet slot.
5. **Controller Decision Desk**:
   - **✓ Accept & Export to BDMS**: Issues official sanction permit `#BDMS-NCR-2026-084` directly into BDMS.
   - **✕ Reject & Re-optimize**: OR-Tools constraint solver re-evaluates timetable constraints and proposes a revised feasible slot (`02:30 AM – 05:00 AM`).
6. **Live Telemetry What-If Simulation**: Test hypothetical 45-minute train delays on Vande Bharat and observe real-time slot rescheduling.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Tailwind CSS
- **Backend / Integration**: Python (FastAPI), PostgreSQL
- **Optimization Engine**: Google OR-Tools (CP-SAT Constraint Solver)
- **Deployment**: Zero-dependency local web server

---

## 🚀 How to Run Locally

### Option 1: Direct File
Double-click `index.html` or `run.bat` to launch directly in any web browser.

### Option 2: Python Web Server
```bash
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 👥 Contributors & Team

- **Anushka Gupta** ([@vipa88gupta](https://github.com/vipa88gupta))

