/**
 * RailSync AI - Section Controller Operations Dashboard Engine
 * Clean, high-contrast, Accept/Reject workflow, Train Delay simulation
 */

let activeRequests = [
  {
    id: "REQ-01",
    dept: "Track (Civil)",
    system: "TMS",
    title: "Rail Joint Crack Repair",
    location: "Aligarh (Km 142/4, Track 1)",
    urgency: "HIGH",
    urgencyClass: "urg-high",
    score: 94,
    scoreColor: "#b91c1c",
    duration: "2.0 hrs",
    slot: "01:30 &ndash; 03:30 AM",
    status: "Scheduled in Block",
    statusClass: "st-scheduled"
  },
  {
    id: "REQ-02",
    dept: "Electrical (TRD)",
    system: "TDMS",
    title: "Overhead 25kV Wire Tightening",
    location: "Aligarh (Km 143/1, Track 1)",
    urgency: "MEDIUM",
    urgencyClass: "urg-medium",
    score: 78,
    scoreColor: "#b45309",
    duration: "1.5 hrs",
    slot: "01:30 &ndash; 03:00 AM",
    status: "Scheduled in Block",
    statusClass: "st-scheduled"
  },
  {
    id: "REQ-03",
    dept: "Signals (S&T)",
    system: "SMMS",
    title: "Point Motor 102B Overhaul",
    location: "Aligarh Yard (Track 1)",
    urgency: "MEDIUM",
    urgencyClass: "urg-medium",
    score: 65,
    scoreColor: "#b45309",
    duration: "1.5 hrs",
    slot: "02:00 &ndash; 03:30 AM",
    status: "Scheduled in Block",
    statusClass: "st-scheduled"
  },
  {
    id: "REQ-04",
    dept: "Track (Civil)",
    system: "TMS",
    title: "Sleeper Fastening & Packing",
    location: "Km 188/2 (Loop Line 2)",
    urgency: "LOW",
    urgencyClass: "urg-low",
    score: 50,
    scoreColor: "#475569",
    duration: "1.0 hr",
    slot: "Tomorrow 02:00 AM",
    status: "Day 2 Scheduled",
    statusClass: "st-planned"
  }
];

let controllerDecision = 'PENDING'; // 'PENDING' | 'ACCEPTED' | 'REJECTED'
let isTrainDelayed = false;

document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
});

function renderDashboard() {
  renderRequestsTable();
  renderCorridorSection();
  renderControllerDecision();
}

// 1. Render Active Requests Table
function renderRequestsTable() {
  const tbody = document.getElementById('requestsTableBody');
  if (!tbody) return;

  tbody.innerHTML = activeRequests.map(r => `
    <tr>
      <td style="font-weight:800; color:#0f172a;">${r.id}</td>
      <td>
        <span class="badge-dept dept-${r.system.toLowerCase()}">${r.system}</span>
        <span style="font-weight:600; color:#334155; margin-left:4px;">${r.dept}</span>
      </td>
      <td>
        <div style="font-weight:700; color:#0f172a;">${r.title}</div>
        <div style="font-size:11.5px; color:#64748b;">📍 ${r.location}</div>
      </td>
      <td>
        <span class="badge-urgency ${r.urgencyClass}">${r.urgency}</span>
      </td>
      <td>
        <strong style="color:${r.scoreColor}; font-size:13.5px;">${r.score} / 100</strong>
      </td>
      <td style="color:#334155; font-weight:700;">${r.duration}</td>
      <td style="color:#1e293b; font-weight:700;">
        ${isTrainDelayed && r.status.includes('Block') ? '02:15 &ndash; 04:15 AM' : r.slot}
      </td>
      <td>
        <span class="status-badge ${controllerDecision === 'ACCEPTED' && r.status.includes('Block') ? 'st-approved' : r.statusClass}">
          ${controllerDecision === 'ACCEPTED' && r.status.includes('Block') ? '✓ Sanctioned in BDMS' : r.status}
        </span>
      </td>
    </tr>
  `).join('');
}

// 2. Render Corridor Section (Crystal Clear 2-Column Stream + Timeline)
function renderCorridorSection() {
  const gridContainer = document.getElementById('corridorGridBody');
  const blockEl = document.getElementById('trackBlockBar');
  const alertBox = document.getElementById('delayAlertNote');

  let freeWindowText = isTrainDelayed ? "02:15 AM &ndash; 04:45 AM" : "01:30 AM &ndash; 04:00 AM";
  let blockSlotText = isTrainDelayed ? "02:15 AM &ndash; 04:45 AM (Delayed Slot)" : "01:30 AM &ndash; 04:00 AM (150 Mins)";
  let leftPos = isTrainDelayed ? "35%" : "20%";

  if (controllerDecision === 'REJECTED') {
    freeWindowText = "02:30 AM &ndash; 05:00 AM";
    blockSlotText = "02:30 AM &ndash; 05:00 AM (Re-optimized Slot)";
    leftPos = "40%";
  }

  if (gridContainer) {
    gridContainer.innerHTML = `
      <div class="corridor-grid">

        <!-- LEFT COLUMN: LIVE TRAIN TIMETABLE STREAM -->
        <div class="corridor-subcard">
          <div class="subcard-head">
            <span>🚆 Live Train Timetable Stream (COA Feed)</span>
            <span style="font-size:11px; background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:4px; font-weight:700;">Track 1 Down Line</span>
          </div>

          <div class="train-item-row">
            <div>
              <strong style="color:#334155;">🚆 Night Freight Coal Rake</strong>
              <div style="font-size:11px; color:#64748b;">Goods Train &bull; Speed: 65 km/h</div>
            </div>
            <div style="text-align:right;">
              <span style="font-weight:700; color:#475569;">00:15 &ndash; 01:10 AM</span><br>
              <span style="font-size:10.5px; color:#16a34a; font-weight:700;">Passed Track 1</span>
            </div>
          </div>

          <!-- HIGHLIGHTED FREE GAP -->
          <div class="train-gap-highlight">
            <div>
              <strong style="font-size:13px; color:#15803d;">🟢 FREE TIMETABLE GAP (No Trains)</strong>
              <div style="font-size:11px; color:#166534; margin-top:2px;">
                ${isTrainDelayed ? 'Shifted +45m because Vande Bharat is delayed' : '2.5-Hour Quiet Window available for maintenance'}
              </div>
            </div>
            <div style="text-align:right;">
              <span style="font-size:13px; font-weight:800; color:#15803d;">${freeWindowText}</span><br>
              <span style="font-size:10px; font-weight:700; background:#dcfce7; color:#166534; padding:2px 6px; border-radius:4px;">Safe Window</span>
            </div>
          </div>

          <div class="train-item-row">
            <div>
              <strong style="color:#0369a1;">⚡ Vande Bharat Express (22436)</strong>
              <div style="font-size:11px; color:#64748b;">Superfast Passenger Express &bull; Speed: 130 km/h</div>
            </div>
            <div style="text-align:right;">
              <span style="font-weight:700; color:${isTrainDelayed ? '#b91c1c' : '#0369a1'};">${isTrainDelayed ? '07:15 AM (+45m Late)' : '06:30 AM'}</span><br>
              <span style="font-size:10.5px; color:${isTrainDelayed ? '#b91c1c' : '#0284c7'}; font-weight:700;">${isTrainDelayed ? 'Delayed in COA' : 'On Time'}</span>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: 3 MAINTENANCE TASKS COMBINED IN FREE GAP -->
        <div class="corridor-subcard">
          <div class="subcard-head">
            <span>🛠️ 3 Maintenance Tasks Combined in Free Gap</span>
            <span style="font-size:11px; background:#fef3c7; color:#92400e; padding:2px 8px; border-radius:4px; font-weight:700;">0 Train Delays</span>
          </div>

          <div class="work-item-row">
            <div>
              <span class="badge-dept dept-tms">TMS</span>
              <strong style="margin-left:4px; color:#0f172a;">Rail Joint Crack Repair</strong>
              <div style="font-size:11px; color:#64748b;">Civil Track Team &bull; Km 142/4</div>
            </div>
            <span style="font-weight:700; color:#1e40af;">${isTrainDelayed ? '02:15 &ndash; 04:15 AM' : '01:30 &ndash; 03:30 AM'}</span>
          </div>

          <div class="work-item-row">
            <div>
              <span class="badge-dept dept-tdms">TDMS</span>
              <strong style="margin-left:4px; color:#0f172a;">25kV OHE Wire Tightening</strong>
              <div style="font-size:11px; color:#64748b;">Electrical TRD Team &bull; Km 143/1</div>
            </div>
            <span style="font-weight:700; color:#7e22ce;">${isTrainDelayed ? '02:15 &ndash; 03:45 AM' : '01:30 &ndash; 03:00 AM'}</span>
          </div>

          <div class="work-item-row">
            <div>
              <span class="badge-dept dept-smms">SMMS</span>
              <strong style="margin-left:4px; color:#0f172a;">Point Motor 102B Service</strong>
              <div style="font-size:11px; color:#64748b;">Signals & Telecom Team &bull; Aligarh Yard</div>
            </div>
            <span style="font-weight:700; color:#b45309;">${isTrainDelayed ? '02:45 &ndash; 04:15 AM' : '02:00 &ndash; 03:30 AM'}</span>
          </div>

          <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:6px; padding:8px 10px; font-size:11.5px; color:#166534; font-weight:600; margin-top:6px;">
            ✓ All 3 department works completed in ONE quiet window without stopping any train!
          </div>
        </div>

      </div>
    `;
  }

  if (blockEl) {
    blockEl.style.left = leftPos;
    blockEl.style.width = "30%";
    blockEl.innerHTML = `
      <span>🛠️ TRACK 1 MAINTENANCE BLOCK (${freeWindowText})</span>
      <span style="font-size: 10px; font-weight: 700;">Civil + TRD + S&T</span>
    `;
  }

  if (alertBox) {
    if (isTrainDelayed) {
      alertBox.style.display = 'block';
      alertBox.innerHTML = `
        <strong>Live Timetable Telemetry Alert:</strong> Train 22436 (Vande Bharat Express) is running <strong>45 minutes late</strong>.<br>
        RailSync automatically shifted the maintenance window from <strong>01:30 AM</strong> to <strong>02:15 AM</strong> so the train passes safely without stopping!
      `;
    } else {
      alertBox.style.display = 'none';
    }
  }
}

// 3. Render Controller Decision Desk (Accept / Reject)
function renderControllerDecision() {
  const container = document.getElementById('controllerDeskBody');
  if (!container) return;

  let currentSlot = "01:30 AM – 04:00 AM (150 Mins)";
  if (controllerDecision === 'REJECTED') {
    currentSlot = "02:30 AM – 05:00 AM (Re-optimized Slot)";
  } else if (isTrainDelayed) {
    currentSlot = "02:15 AM – 04:45 AM (Shifted Slot)";
  }

  if (controllerDecision === 'PENDING') {
    container.innerHTML = `
      <div class="parameters-grid">
        <div>
          <div class="p-label">Track Section:</div>
          <div class="p-value">Ghaziabad &ndash; Aligarh (Track 1)</div>
        </div>
        <div>
          <div class="p-label">Scheduled Block Slot:</div>
          <div class="p-value" style="color:#92400e;">${currentSlot}</div>
        </div>
        <div>
          <div class="p-label">Departments Included:</div>
          <div class="p-value">Track (Civil) + Signals + Electrical</div>
        </div>
        <div>
          <div class="p-label">Train Traffic Impact:</div>
          <div class="p-value" style="color:#16a34a;">0 Min Passenger Delay (Safe)</div>
        </div>
      </div>

      <div class="buttons-row">
        <button class="btn-accept" onclick="acceptBlock()">
          <span>✓</span> Accept & Export to BDMS
        </button>
        <button class="btn-reject" onclick="rejectBlock()">
          <span>✕</span> Reject & Re-optimize
        </button>
      </div>
    `;
  } else if (controllerDecision === 'ACCEPTED') {
    const timeNow = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span class="status-badge st-approved" style="font-size:12px; font-weight:800;">
          ✓ SANCTION ORDER APPROVED & EXPORTED TO BDMS
        </span>
        <button class="btn-simulate" onclick="resetDecision()">🔄 Reset</button>
      </div>

      <div class="permit-slip">
        =================== INDIAN RAILWAYS BDMS SANCTION PERMIT ===================<br>
        PERMIT NUMBER : BDMS-NCR-2026-084 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; TIME: ${timeNow}<br>
        SANCTIONED BY : CHIEF SECTION CONTROLLER (KANPUR DIVISION)<br>
        TRACK SECTION : GHAZIABAD - ALIGARH (TRACK 1 DOWN LINE, KM 140-145)<br>
        APPROVED SLOT : ${currentSlot}<br>
        WORK INCLUDED : TRACK REPAIR + 25kV OHE WIRE TIGHTENING + POINT MOTOR 102B<br>
        STATUS        : LOCKED IN BDMS & COA &bull; PERMIT TRANSMITTED TO STATIONS
      </div>
    `;
  } else if (controllerDecision === 'REJECTED') {
    container.innerHTML = `
      <div class="reject-slip">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div>
            <strong style="font-size:14px; color:#991c1c;">✕ Initial Slot Rejected by Controller</strong>
            <p style="font-size:12px; color:#b91c1c; margin-top:2px;">
              OR-Tools re-evaluated timetable constraints and generated a revised safe slot.
            </p>
          </div>
          <button class="btn-simulate" onclick="resetDecision()">🔄 Reset</button>
        </div>

        <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:6px; padding:12px; margin-bottom:14px;">
          <div style="font-size:11px; font-weight:700; color:#475569; text-transform:uppercase;">Newly Proposed Revised Slot:</div>
          <div style="font-size:16px; font-weight:800; color:#15803d; margin-top:2px;">
            02:30 AM &ndash; 05:00 AM (150 Mins)
          </div>
          <div style="font-size:12px; color:#64748b; margin-top:2px;">
            Avoids early morning freight rake &bull; All 3 maintenance teams accommodated &bull; Zero passenger train conflict.
          </div>
        </div>

        <div class="buttons-row">
          <button class="btn-accept" onclick="acceptBlock()">
            <span>✓</span> Accept Revised Slot & Export to BDMS
          </button>
          <button class="btn-reject" onclick="alert('Controller can adjust timings manually.')">
            <span>✏️</span> Adjust Constraints Manually
          </button>
        </div>
      </div>
    `;
  }
}

function acceptBlock() {
  controllerDecision = 'ACCEPTED';
  renderDashboard();
}

function rejectBlock() {
  controllerDecision = 'REJECTED';
  renderDashboard();
}

function resetDecision() {
  controllerDecision = 'PENDING';
  isTrainDelayed = false;
  renderDashboard();
}

function toggleTrainDelay() {
  isTrainDelayed = !isTrainDelayed;
  const btn = document.getElementById('btnSimulateDelay');

  if (isTrainDelayed) {
    btn.innerHTML = '<span>🔄</span> Reset Vande Bharat to On-Time';
  } else {
    btn.innerHTML = '<span>⏱️</span> Simulate 45m Delay on Vande Bharat';
  }

  renderDashboard();
}
