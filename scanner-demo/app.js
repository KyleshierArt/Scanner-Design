(function () {
  "use strict";

  // ── Patient data ──

  const PATIENTS = [
    { id: 1, name: "John Miller", type: "Orthodontics", date: "2026-06-13", status: "scanning",
      scans: [
        { id: 101, label: "Upper Arch", stage: "Maxilla", date: "2026-06-13", time: "14:32" },
        { id: 102, label: "Lower Arch", stage: "Mandible", date: "2026-06-12", time: "10:15" },
      ] },
    { id: 2, name: "Sarah Chen", type: "Crown & Bridge", date: "2026-06-12", status: "completed",
      scans: [
        { id: 201, label: "Upper Arch", stage: "Maxilla", date: "2026-06-12", time: "09:20" },
        { id: 202, label: "Lower Arch", stage: "Mandible", date: "2026-06-12", time: "09:45" },
        { id: 203, label: "Bite Registration", stage: "Occlusion", date: "2026-06-12", time: "10:05" },
      ] },
    { id: 3, name: "Michael Brown", type: "Orthodontics", date: "2026-06-12", status: "pending",
      scans: [] },
    { id: 4, name: "Emily Davis", type: "Implant", date: "2026-06-11", status: "sent",
      scans: [
        { id: 401, label: "Upper Arch", stage: "Maxilla", date: "2026-06-11", time: "16:30" },
        { id: 402, label: "Lower Arch", stage: "Mandible", date: "2026-06-11", time: "16:55" },
        { id: 403, label: "Bite Registration", stage: "Occlusion", date: "2026-06-11", time: "17:10" },
      ] },
    { id: 5, name: "David Wilson", type: "Crown & Bridge", date: "2026-06-11", status: "completed",
      scans: [
        { id: 501, label: "Upper Arch", stage: "Maxilla", date: "2026-06-11", time: "11:00" },
        { id: 502, label: "Lower Arch", stage: "Mandible", date: "2026-06-11", time: "11:20" },
        { id: 503, label: "Bite Registration", stage: "Occlusion", date: "2026-06-11", time: "11:35" },
      ] },
    { id: 6, name: "Lisa Wang", type: "Denture", date: "2026-06-10", status: "pending",
      scans: [
        { id: 601, label: "Upper Arch", stage: "Maxilla", date: "2026-06-10", time: "08:45" },
      ] },
    { id: 7, name: "James Taylor", type: "Orthodontics", date: "2026-06-09", status: "sent",
      scans: [
        { id: 701, label: "Upper Arch", stage: "Maxilla", date: "2026-06-09", time: "15:10" },
        { id: 702, label: "Lower Arch", stage: "Mandible", date: "2026-06-09", time: "15:30" },
        { id: 703, label: "Bite Registration", stage: "Occlusion", date: "2026-06-09", time: "15:50" },
      ] },
    { id: 8, name: "Anna Kim", type: "Implant", date: "2026-06-08", status: "completed",
      scans: [
        { id: 801, label: "Upper Arch", stage: "Maxilla", date: "2026-06-08", time: "13:20" },
        { id: 802, label: "Lower Arch", stage: "Mandible", date: "2026-06-08", time: "13:40" },
        { id: 803, label: "Bite Registration", stage: "Occlusion", date: "2026-06-08", time: "14:00" },
      ] },
  ];

  const STATUS_LABELS = {
    scanning: "Scanning",
    completed: "Completed",
    pending: "Pending",
    sent: "Sent to Lab",
  };

  // ── Constants ──

  const ICON_ASSET_BASE = "../icon-design/";

  const TREATMENT_ICONS = {
    "Orthodontics": "braces.png",
    "Crown & Bridge": "crown.png",
    "Implant": "enamel.png",
    "Denture": "denture.png",
    "General": "filling.png",
  };

  const STAGE_ORDER = ["maxilla", "mandible", "occlusion", "complete"];

  const STAGE_LABELS = {
    maxilla: "Maxilla",
    mandible: "Mandible",
    occlusion: "Occlusion",
    complete: "Complete",
  };

  const DEVICE_LABELS = {
    disconnected: "Offline",
    ready: "Ready",
    scanning: "Scan",
    paused: "Pause",
    processing: "Proc",
    complete: "Done",
    error: "Error",
  };

  const DEVICE_NEXT = {
    disconnected: "ready",
    ready: "scanning",
    scanning: "ready",
    paused: "ready",
    processing: "complete",
    complete: "ready",
    error: "ready",
  };

  const GUIDANCE = {
    maxilla: {
      disconnected: "Connect the scanner to begin scanning the upper arch.",
      ready: "Scanner connected. Scan the upper arch from the molar.",
      scanning: "Scanning the upper arch… Move along the occlusal surface.",
      paused: "Scanning paused. Press the scanner button to resume.",
      processing: "Processing upper arch scan data…",
      complete: "Upper arch scan complete.",
      error: "Scanner error. Check the connection and try again.",
    },
    mandible: {
      disconnected: "Connect the scanner to begin scanning the lower arch.",
      ready: "Scanner connected. Scan the lower arch from the molar.",
      scanning: "Scanning the lower arch… Move along the occlusal surface.",
      paused: "Scanning paused. Press the scanner button to resume.",
      processing: "Processing lower arch scan data…",
      complete: "Lower arch scan complete.",
      error: "Scanner error. Check the connection and try again.",
    },
    occlusion: {
      disconnected: "Connect the scanner to capture the bite registration.",
      ready: "Scan the buccal surface with the patient in occlusion.",
      scanning: "Capturing bite registration…",
      paused: "Scanning paused. Press the scanner button to resume.",
      processing: "Processing bite registration…",
      complete: "Bite registration complete.",
      error: "Scanner error. Check the connection and try again.",
    },
    complete: {
      disconnected: "Connect the scanner to review scans.",
      ready: "All scans complete. Review and save the case.",
      scanning: "",
      paused: "",
      processing: "Finalizing case…",
      complete: "Case saved successfully.",
      error: "Scanner error.",
    },
  };

  const DIALOG_META = {
    delete: {
      title: "Delete Scan Data",
      body: "Unsaved scan data for the current stage will be permanently removed.",
      action: "Delete",
      variant: "danger",
      input: false,
    },
    complete: {
      title: "Complete Scan",
      body: "Mark this case as complete and save all scan data.",
      action: "Complete",
      variant: "primary",
      input: false,
    },
    saveCase: {
      title: "Save Case",
      body: "Save the current case with all scan data.",
      action: "Save",
      variant: "primary",
      input: false,
    },
    editCaseName: {
      title: "Edit Case Name",
      body: "Enter a new name for this case.",
      action: "Save",
      variant: "primary",
      input: true,
    },
    scannerNotConnected: {
      title: "Scanner Not Connected",
      body: "The scanner is not connected. Please check the USB cable and try again.",
      action: "OK",
      variant: "primary",
      input: false,
    },
  };

  // Tool definitions by stage
  const TOOLS = [
    { id: "crop", icon: "../icon-design/scalpel.png", label: "Crop" },
    { id: "undercut", icon: "../icon-design/toothache_arrows.png", label: "Undercut" },
    { id: "bitecheck", icon: "../icon-design/bite-check.png", label: "Bite Check" },
    { id: "implant", icon: "../icon-design/dental-implant.png", label: "Implant" },
    { id: "screenshot", icon: "../icon-design/photo-camera.png", label: "Screenshot" },
    { id: "lock", icon: "../icon-design/lock.png", label: "Lock" },
    { id: "delete", icon: "../icon-design/trash.png", label: "Delete" },
  ];

  // ── State ──

  const state = {
    currentView: "patientList",
    searchQuery: "",
    selectedPatientId: null,
    selectedPatient: null,
    stage: "maxilla",
    stageData: { maxilla: "active", mandible: "pending", occlusion: "pending", complete: "disabled" },
    deviceStatus: "disconnected",
    caseName: "New Case",
    scanProgress: { frames: 0, elapsed: 0 },
    dialog: null,
    biteType: "centric",
    selectedTool: null,
    cameraEnlarged: false,
  };

  let scanInterval = null;

  function treatmentIconFor(type) {
    return ICON_ASSET_BASE + (TREATMENT_ICONS[type] || "filling.png");
  }

  // ── DOM refs ──

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const el = {
    viewPatientList: () => $("#view-patient-list"),
    viewScan: () => $("#view-scan"),
    patientCardList: () => $("#patient-card-list"),
    patientCount: () => $("#patient-count"),
    patientDetailEmpty: () => $("#patient-detail-empty"),
    patientDetailContent: () => $("#patient-detail-content"),
    detailPatientName: () => $("#detail-patient-name"),
    detailPatientMeta: () => $("#detail-patient-meta"),
    scanGallery: () => $("#scan-gallery"),
    scannerBadge: () => $("#scanner-badge"),
    scannerBadgeLabel: () => $("#scanner-badge-label"),
    btnAddPatient: () => $("#btn-add-patient"),
    searchInput: () => $("#patient-search-input"),
    btnNewCase: () => $("#btn-new-case"),
    btnBack: () => $("#btn-back"),
    caseNameDisplay: () => $("#case-name-display"),
    stagePills: () => $$(".stage-bar__pill"),
    railTools: () => $("#rail-tools"),
    btnDevice: () => $("#btn-device"),
    guidance: () => $("#guidance"),
    scanProgress: () => $("#scan-progress"),
    progressFrames: () => $("#progress-frames"),
    progressTime: () => $("#progress-time"),
    btnStart: () => $("#btn-start"),
    btnReset: () => $("#btn-reset"),
    btnDelete: () => $("#btn-delete"),
    btnComplete: () => $("#btn-complete"),
    btnSend: () => $("#btn-send"),
    biteSelector: () => $("#bite-selector"),
    cameraPreview: () => $("#camera-preview"),
    dialogOverlay: () => $("#dialog-overlay"),
    dialogTitle: () => $("#dialog-title"),
    dialogBody: () => $("#dialog-body"),
    dialogInput: () => $("#dialog-input"),
    dialogConfirm: () => $("#dialog-confirm"),
  };

  // ── Actions ──

  function switchView(view) {
    state.currentView = view;
    const listEl = el.viewPatientList();
    const scanEl = el.viewScan();
    if (view === "patientList") {
      listEl.classList.add("view--active");
      scanEl.classList.remove("view--active");
      renderPatientList();
      renderPatientDetail();
    } else {
      listEl.classList.remove("view--active");
      scanEl.classList.add("view--active");
    }
  }

  function openPatient(patient) {
    state.selectedPatient = patient;
    state.selectedPatientId = patient ? patient.id : null;
    state.caseName = patient ? patient.name : "New Case";
    state.stage = "maxilla";
    state.stageData = { maxilla: "active", mandible: "pending", occlusion: "pending", complete: "disabled" };
    state.deviceStatus = "disconnected";
    state.selectedTool = null;
    state.scanProgress = { frames: 0, elapsed: 0 };
    stopTimer();
    switchView("scan");
    render();
  }

  function backToList() {
    stopTimer();
    switchView("patientList");
  }

  function isScanning() {
    return state.deviceStatus === "scanning";
  }

  function setStage(stage) {
    if (state.stage === stage) return;
    if (state.stageData[state.stage] === "active") {
      state.stageData[state.stage] = "pending";
    }
    state.stageData[stage] = "active";
    state.stage = stage;
    state.selectedTool = null;
    render();
  }

  function setDeviceStatus(status) {
    state.deviceStatus = status;
    render();
  }

  function cycleDeviceStatus() {
    const next = DEVICE_NEXT[state.deviceStatus];
    if (next) setDeviceStatus(next);
  }

  function startScan() {
    if (state.deviceStatus !== "ready" && state.deviceStatus !== "paused") return;
    if (state.deviceStatus === "ready") {
      state.scanProgress = { frames: 0, elapsed: 0 };
    }
    state.deviceStatus = "scanning";
    render();
    startTimer();
  }

  function pauseScan() {
    if (state.deviceStatus !== "scanning") return;
    state.deviceStatus = "paused";
    stopTimer();
    render();
  }

  function resetScan() {
    state.stageData[state.stage] = "active";
    state.deviceStatus = "ready";
    state.scanProgress = { frames: 0, elapsed: 0 };
    stopTimer();
    render();
  }

  function completeStage() {
    state.stageData[state.stage] = "scanned";
    const idx = STAGE_ORDER.indexOf(state.stage);
    if (idx < STAGE_ORDER.length - 1) {
      const next = STAGE_ORDER[idx + 1];
      if (state.stageData[next] === "disabled" || state.stageData[next] === "pending") {
        state.stageData[next] = "pending";
      }
      state.stage = next;
      state.scanProgress = { frames: 0, elapsed: 0 };
      state.deviceStatus = "ready";
    } else {
      state.deviceStatus = "complete";
    }
    stopTimer();
    state.selectedTool = null;
    render();
  }

  function openDialog(type) {
    state.dialog = type;
    render();
  }

  function closeDialog() {
    state.dialog = null;
    render();
  }

  function setBiteType(bite) {
    state.biteType = bite;
    render();
  }

  function setCaseName(name) {
    state.caseName = name;
    render();
  }

  // ── Mock timer ──

  function startTimer() {
    stopTimer();
    scanInterval = setInterval(function () {
      state.scanProgress.frames += Math.floor(Math.random() * 3) + 1;
      state.scanProgress.elapsed += 1;
      renderProgress();
    }, 1000);
  }

  function stopTimer() {
    if (scanInterval) {
      clearInterval(scanInterval);
      scanInterval = null;
    }
  }

  // ── Render functions ──

  function selectPatient(id) {
    state.selectedPatientId = id;
    renderPatientList();
    renderPatientDetail();
  }

  function openEditPatient(id) {
    var patient = PATIENTS.find(function (p) { return p.id === id; });
    if (!patient) return;
    var overlay = document.getElementById("edit-patient-overlay");
    document.getElementById("epf-id").value = "P-" + String(patient.id).padStart(4, "0");
    document.getElementById("epf-name").value = patient.name;
    document.getElementById("epf-dob").value = patient.dob || "";
    document.getElementById("epf-gender").value = patient.gender || "";
    document.getElementById("epf-remarks").value = patient.remarks || "";
    overlay.dataset.patientId = id;
    overlay.hidden = false;
    setTimeout(function () { document.getElementById("epf-name").focus(); }, 50);
  }

  function confirmDeletePatient(id) {
    var patient = PATIENTS.find(function (p) { return p.id === id; });
    if (!patient) return;
    var overlay = document.getElementById("delete-patient-overlay");
    document.getElementById("dp-name").textContent = patient.name;
    overlay.dataset.patientId = id;
    overlay.hidden = false;
  }

  var openMenuPatientId = null;

  function closePatientMenu() {
    openMenuPatientId = null;
    renderPatientList();
  }

  function renderPatientList() {
    const container = el.patientCardList();
    if (!container) return;
    const q = state.searchQuery.toLowerCase();
    const filtered = PATIENTS.filter(function (p) {
      return p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        STATUS_LABELS[p.status].toLowerCase().includes(q);
    });

    el.patientCount().textContent = filtered.length;

    container.innerHTML = filtered.map(function (p) {
      const selected = state.selectedPatientId === p.id;
      const menuOpen = openMenuPatientId === p.id;
      return '<div class="patient-card' + (selected ? ' patient-card--selected' : '') + '" data-patient-id="' + p.id + '">' +
        '<img class="patient-card__icon" src="' + treatmentIconFor(p.type) + '" alt="" loading="lazy">' +
        '<div class="patient-card__body">' +
        '<div class="patient-card__name">' + p.name + '</div>' +
        '<div class="patient-card__meta">' +
        '<span class="patient-card__type">' + p.type + '</span>' +
        '<span class="patient-card__dot"></span>' +
        '<span class="patient-card__status patient-card__status--' + p.status + '">' + STATUS_LABELS[p.status] + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="patient-card__overflow">' +
        '<button class="patient-card__overflow-btn" data-action="menu" data-patient-id="' + p.id + '" title="More"><svg class="icon icon--sm"><use href="#icon-more-v"/></svg></button>' +
        (menuOpen ? '<div class="patient-card__menu">' +
        '<button class="patient-card__menu-item" data-action="edit" data-patient-id="' + p.id + '"><svg class="icon icon--sm"><use href="#icon-pencil"/></svg>Edit</button>' +
        '<button class="patient-card__menu-item patient-card__menu-item--delete" data-action="delete" data-patient-id="' + p.id + '"><svg class="icon icon--sm"><use href="#icon-trash"/></svg>Delete</button>' +
        '</div>' : '') +
        '</div>' +
        '</div>';
    }).join("");

    container.querySelectorAll(".patient-card").forEach(function (card) {
      card.addEventListener("click", function (e) {
        var actionBtn = e.target.closest("[data-action]");
        if (actionBtn) {
          e.stopPropagation();
          var action = actionBtn.dataset.action;
          var id = parseInt(actionBtn.dataset.patientId);
          if (action === "menu") {
            openMenuPatientId = openMenuPatientId === id ? null : id;
            renderPatientList();
          } else if (action === "edit") {
            closePatientMenu();
            openEditPatient(id);
          } else if (action === "delete") {
            closePatientMenu();
            confirmDeletePatient(id);
          }
          return;
        }
        var id = parseInt(card.dataset.patientId);
        selectPatient(id);
      });
    });
  }

  function renderPatientDetail() {
    const emptyEl = el.patientDetailEmpty();
    const contentEl = el.patientDetailContent();

    if (!state.selectedPatientId) {
      emptyEl.hidden = false;
      contentEl.hidden = true;
      return;
    }

    const patient = PATIENTS.find(function (p) { return p.id === state.selectedPatientId; });
    if (!patient) {
      emptyEl.hidden = false;
      contentEl.hidden = true;
      return;
    }

    emptyEl.hidden = true;
    contentEl.hidden = false;

    el.detailPatientName().textContent = patient.name;
    el.detailPatientMeta().textContent = patient.type + "  ·  " + patient.date;

    // Scanner badge
    renderScannerBadge();

    // Scan gallery
    const gallery = el.scanGallery();
    gallery.innerHTML = patient.scans.map(function (s) {
      return '<div class="scan-card" data-scan-id="' + s.id + '">' +
        '<div class="scan-card__preview">' +
        '<img class="scan-card__preview-icon" src="' + treatmentIconFor(patient.type) + '" alt="" loading="lazy">' +
        '<span class="scan-card__stage-tag">' + s.stage + '</span>' +
        '</div>' +
        '<div class="scan-card__info">' +
        '<div class="scan-card__label">' + s.label + '</div>' +
        '<div class="scan-card__date">' + s.date + '  ' + s.time + '</div>' +
        '</div>' +
        '</div>';
    }).join("");

    if (patient.scans.length === 0) {
      gallery.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--color-text-subtle);font:var(--fs-caption);padding:48px 0;">No scan records yet</div>';
    }
  }

  function renderScannerBadge() {
    const badge = el.scannerBadge();
    const label = el.scannerBadgeLabel();
    if (!badge || !label) return;

    const status = state.deviceStatus;
    badge.className = "scanner-badge scanner-badge--" + status;
    label.textContent = DEVICE_LABELS[status];
  }

  function render() {
    renderTopBar();
    renderStageNav();
    renderLeftRail();
    renderDeviceStatus();
    renderCanvas();
    renderControls();
    renderProgress();
    renderDialog();
  }

  function renderTopBar() {
    const display = el.caseNameDisplay();
    if (display) {
      display.textContent = state.caseName + " — " + STAGE_LABELS[state.stage];
    }
  }

  function renderStageNav() {
    el.stagePills().forEach(function (pill) {
      const key = pill.dataset.stage;
      const stageState = state.stageData[key];
      const isActive = stageState === "active";
      const isScanned = stageState === "scanned";

      // Reset classes
      pill.className = "stage-bar__pill";
      if (isActive) pill.classList.add("stage-bar__pill--active");
      else if (isScanned) pill.classList.add("stage-bar__pill--scanned");

      pill.setAttribute("aria-current", isActive ? "step" : "");

      // Update icon: scanned → check-circle, active → filled variant, else → default
      const svg = pill.querySelector("svg use");
      if (svg) {
        if (isScanned) {
          svg.setAttribute("href", "#icon-check-circle");
        } else if (isActive) {
          svg.setAttribute("href", "#icon-" + key + "-filled");
        } else {
          svg.setAttribute("href", "#icon-" + key);
        }
      }
    });
  }

  function renderLeftRail() {
    const container = el.railTools();
    container.innerHTML = "";

    TOOLS.forEach(function (tool, i) {
      // Divider before delete (last tool)
      if (i === TOOLS.length - 1) {
        const div = document.createElement("span");
        div.className = "tool-palette__divider";
        container.appendChild(div);
      }

      const btn = document.createElement("button");
      btn.className = "tool-palette__tool-btn";
      if (state.selectedTool === tool.id) {
        btn.classList.add("tool-palette__tool-btn--selected");
      }
      btn.title = tool.label;
      btn.setAttribute("aria-label", tool.label);
      btn.setAttribute("aria-pressed", state.selectedTool === tool.id);
      btn.innerHTML = '<img class="tool-palette__icon" src="' + tool.icon + '" alt="' + tool.label + '">';
      btn.addEventListener("click", function () {
        state.selectedTool = state.selectedTool === tool.id ? null : tool.id;
        renderLeftRail();
      });
      container.appendChild(btn);
    });
  }

  function renderDeviceStatus() {
    const btn = el.btnDevice();
    if (!btn) return;
    const status = state.deviceStatus;

    // Remove all status classes
    btn.className = "device-status device-status--" + status;

    const icon = btn.querySelector("svg use");
    if (icon) {
      icon.setAttribute("href", status === "disconnected" || status === "error" ? "#icon-unlink" : "#icon-link");
    }

    const label = btn.querySelector(".device-status__label");
    if (label) label.textContent = DEVICE_LABELS[status];
  }

  function renderCanvas() {
    const guidanceEl = el.guidance();
    if (!guidanceEl) return;

    const status = isScanning() ? "scanning" : state.deviceStatus;
    const text = GUIDANCE[state.stage]?.[status] || "";

    if (text) {
      guidanceEl.textContent = text;
      guidanceEl.hidden = false;
    } else {
      guidanceEl.hidden = true;
    }
  }

  function renderControls() {
    const scanning = isScanning();
    const canScan = state.deviceStatus === "ready" || state.deviceStatus === "paused";
    const hasScanData = state.deviceStatus === "paused" || state.deviceStatus === "ready" ||
      state.stageData[state.stage] === "scanned" || state.stageData[state.stage] === "warning";
    const showBite = state.stage === "occlusion";
    const showSend = state.stage === "complete";

    // Start/Pause button
    const btnStart = el.btnStart();
    btnStart.disabled = !canScan && !scanning;
    btnStart.className = "scan-controls__primary" + (scanning ? " scan-controls__primary--scanning" : "");
    const startIcon = btnStart.querySelector("svg use");
    startIcon.setAttribute("href", scanning ? "#icon-pause" : "#icon-play");
    btnStart.lastChild.textContent = scanning ? "Pause" : "Start Scan";

    // Reset
    el.btnReset().disabled = !scanning;

    // Delete
    el.btnDelete().disabled = !hasScanData || scanning;

    // Complete vs Send
    const btnComplete = el.btnComplete();
    const btnSend = el.btnSend();
    if (showSend) {
      btnComplete.hidden = true;
      btnSend.hidden = false;
    } else {
      btnComplete.hidden = false;
      btnSend.hidden = true;
      btnComplete.disabled = !hasScanData || scanning;
    }

    // Bite selector
    const biteSelector = el.biteSelector();
    biteSelector.hidden = !showBite;
    biteSelector.querySelectorAll(".scan-controls__bite-btn").forEach(function (b) {
      b.className = "scan-controls__bite-btn";
      if (b.dataset.bite === state.biteType) {
        b.classList.add("scan-controls__bite-btn--active");
      }
      b.disabled = scanning;
    });
  }

  function renderProgress() {
    const progressEl = el.scanProgress();
    if (!progressEl) return;

    if (isScanning()) {
      progressEl.hidden = false;
      renderProgressValues();
    } else {
      progressEl.hidden = true;
    }
  }

  function renderProgressValues() {
    const frames = el.progressFrames();
    const time = el.progressTime();
    if (frames) frames.textContent = state.scanProgress.frames;
    if (time) {
      const mins = Math.floor(state.scanProgress.elapsed / 60);
      const secs = state.scanProgress.elapsed % 60;
      time.textContent = String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
    }
  }

  function renderDialog() {
    const overlay = el.dialogOverlay();
    if (!state.dialog) {
      overlay.hidden = true;
      return;
    }

    const meta = DIALOG_META[state.dialog];
    if (!meta) {
      overlay.hidden = true;
      return;
    }

    overlay.hidden = false;
    el.dialogTitle().textContent = meta.title;
    el.dialogBody().textContent = meta.body;

    // Input field
    const input = el.dialogInput();
    if (meta.input) {
      input.hidden = false;
      input.placeholder = meta.inputPlaceholder || "";
      input.value = state.dialog === "addPatient" ? "" : state.caseName;
      setTimeout(function () { input.focus(); }, 50);
    } else {
      input.hidden = true;
    }

    // Confirm button
    const confirm = el.dialogConfirm();
    confirm.textContent = meta.action;
    confirm.className = "dialog__btn-primary" + (meta.variant === "danger" ? " dialog__btn-primary--danger" : "");

    // Focus trap
    setTimeout(function () {
      if (!meta.input) confirm.focus();
    }, 50);
  }

  // ── Event bindings ──

  document.addEventListener("DOMContentLoaded", function () {
    // Patient list events
    el.searchInput().addEventListener("input", function () {
      state.searchQuery = this.value;
      renderPatientList();
    });

    el.btnNewCase().addEventListener("click", function () {
      openPatient(null);
    });

    el.btnBack().addEventListener("click", backToList);

    // Stage nav
    el.stagePills().forEach(function (pill) {
      pill.addEventListener("click", function () {
        setStage(pill.dataset.stage);
      });
    });

    // Device status cycle
    el.btnDevice().addEventListener("click", cycleDeviceStatus);

    // Scanner badge cycle (patient list view)
    el.scannerBadge().addEventListener("click", function () {
      cycleDeviceStatus();
      renderScannerBadge();
    });

    // Scan controls
    el.btnStart().addEventListener("click", function () {
      if (isScanning()) pauseScan();
      else startScan();
    });

    el.btnReset().addEventListener("click", resetScan);

    el.btnDelete().addEventListener("click", function () {
      openDialog("delete");
    });

    el.btnComplete().addEventListener("click", function () {
      openDialog("complete");
    });

    el.btnSend().addEventListener("click", function () {
      openDialog("saveCase");
    });

    // Bite buttons
    el.biteSelector().querySelectorAll(".scan-controls__bite-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setBiteType(btn.dataset.bite);
      });
    });

    // Add patient button
    el.btnAddPatient().addEventListener("click", function () {
      var nextId = PATIENTS.length ? Math.max.apply(null, PATIENTS.map(function (p) { return p.id; })) + 1 : 1;
      document.getElementById("pf-id").value = "P-" + String(nextId).padStart(4, "0");
      document.getElementById("pf-name").value = "";
      document.getElementById("pf-dob").value = "";
      document.getElementById("pf-gender").value = "";
      document.getElementById("pf-remarks").value = "";
      document.getElementById("add-patient-overlay").hidden = false;
      setTimeout(function () { document.getElementById("pf-name").focus(); }, 50);
    });

    document.getElementById("ap-cancel").addEventListener("click", function () {
      document.getElementById("add-patient-overlay").hidden = true;
    });

    document.getElementById("add-patient-overlay").addEventListener("click", function (e) {
      if (e.target === this) this.hidden = true;
    });

    document.getElementById("ap-confirm").addEventListener("click", function () {
      var name = document.getElementById("pf-name").value.trim();
      if (!name) {
        document.getElementById("pf-name").focus();
        return;
      }
      var newId = PATIENTS.length ? Math.max.apply(null, PATIENTS.map(function (p) { return p.id; })) + 1 : 1;
      var today = new Date();
      var dateStr = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
      var dob = document.getElementById("pf-dob").value || "";
      var gender = document.getElementById("pf-gender").value || "";
      var remarks = document.getElementById("pf-remarks").value.trim();
      PATIENTS.push({ id: newId, name: name, type: "General", date: dateStr, status: "pending", scans: [], dob: dob, gender: gender, remarks: remarks });
      state.selectedPatientId = newId;
      document.getElementById("add-patient-overlay").hidden = true;
      renderPatientList();
      renderPatientDetail();
    });

    // TopBar
    $("#btn-edit-case").addEventListener("click", function () {
      openDialog("editCaseName");
    });

    $("#btn-save").addEventListener("click", function () {
      openDialog("saveCase");
    });

    // Camera preview
    $("#btn-camera-size").addEventListener("click", function () {
      state.cameraEnlarged = !state.cameraEnlarged;
      const cam = el.cameraPreview();
      if (state.cameraEnlarged) {
        cam.classList.add("camera--large");
      } else {
        cam.classList.remove("camera--large");
      }
      const icon = this.querySelector("svg use");
      icon.setAttribute("href", state.cameraEnlarged ? "#icon-minimize" : "#icon-maximize");
    });

    // Dialog
    el.dialogOverlay().addEventListener("click", function (e) {
      if (e.target === this) closeDialog();
    });

    el.dialogConfirm().addEventListener("click", function () {
      const meta = DIALOG_META[state.dialog];
      if (meta && meta.input) {
        setCaseName(el.dialogInput().value);
      }
      if (state.dialog === "complete") completeStage();
      else if (state.dialog === "delete") resetScan();
      closeDialog();
    });

    $("#dialog-cancel").addEventListener("click", closeDialog);

    // Edit patient dialog
    document.getElementById("ep-cancel").addEventListener("click", function () {
      document.getElementById("edit-patient-overlay").hidden = true;
    });

    document.getElementById("edit-patient-overlay").addEventListener("click", function (e) {
      if (e.target === this) this.hidden = true;
    });

    document.getElementById("ep-confirm").addEventListener("click", function () {
      var overlay = document.getElementById("edit-patient-overlay");
      var id = parseInt(overlay.dataset.patientId);
      var name = document.getElementById("epf-name").value.trim();
      if (!name) {
        document.getElementById("epf-name").focus();
        return;
      }
      var patient = PATIENTS.find(function (p) { return p.id === id; });
      if (patient) {
        patient.name = name;
        patient.dob = document.getElementById("epf-dob").value || "";
        patient.gender = document.getElementById("epf-gender").value || "";
        patient.remarks = document.getElementById("epf-remarks").value.trim();
      }
      overlay.hidden = true;
      renderPatientList();
      renderPatientDetail();
    });

    // Delete patient dialog
    document.getElementById("dp-cancel").addEventListener("click", function () {
      document.getElementById("delete-patient-overlay").hidden = true;
    });

    document.getElementById("delete-patient-overlay").addEventListener("click", function (e) {
      if (e.target === this) this.hidden = true;
    });

    document.getElementById("dp-confirm").addEventListener("click", function () {
      var overlay = document.getElementById("delete-patient-overlay");
      var id = parseInt(overlay.dataset.patientId);
      var idx = PATIENTS.findIndex(function (p) { return p.id === id; });
      if (idx !== -1) PATIENTS.splice(idx, 1);
      if (state.selectedPatientId === id) {
        state.selectedPatientId = null;
      }
      overlay.hidden = true;
      renderPatientList();
      renderPatientDetail();
    });

    // Close patient menu when clicking outside
    document.addEventListener("click", function (e) {
      if (openMenuPatientId !== null && !e.target.closest(".patient-card__overflow")) {
        closePatientMenu();
      }
    });

    // Escape key for dialogs
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (state.dialog) closeDialog();
        var apOverlay = document.getElementById("add-patient-overlay");
        if (apOverlay && !apOverlay.hidden) apOverlay.hidden = true;
        var epOverlay = document.getElementById("edit-patient-overlay");
        if (epOverlay && !epOverlay.hidden) epOverlay.hidden = true;
        var dpOverlay = document.getElementById("delete-patient-overlay");
        if (dpOverlay && !dpOverlay.hidden) dpOverlay.hidden = true;
        if (openMenuPatientId !== null) closePatientMenu();
      }
    });

    // Input change in dialog
    el.dialogInput().addEventListener("input", function () {
      state.caseName = this.value;
    });

    // Initial render
    switchView("patientList");
  });
})();
