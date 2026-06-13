(function () {
  "use strict";

  // ── Constants ──

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
  const TOOLS = {
    maxilla: [
      { id: "smartscan", icon: "#icon-wand", label: "Smart Scan" },
      { id: "crop", icon: "#icon-crop", label: "Crop" },
      { id: "screenshot", icon: "#icon-camera", label: "Screenshot" },
    ],
    mandible: [
      { id: "smartscan", icon: "#icon-wand", label: "Smart Scan" },
      { id: "tissue", icon: "#icon-leaf", label: "Tissue Filter" },
      { id: "crop", icon: "#icon-crop", label: "Crop" },
      { id: "screenshot", icon: "#icon-camera", label: "Screenshot" },
    ],
    occlusion: [
      { id: "screenshot", icon: "#icon-camera", label: "Screenshot" },
    ],
    complete: [
      { id: "quality", icon: "#icon-shield", label: "Quality Check" },
      { id: "screenshot", icon: "#icon-camera", label: "Screenshot" },
      { id: "undercut", icon: "#icon-undercut", label: "Undercut" },
    ],
  };

  // ── State ──

  const state = {
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

  // ── DOM refs ──

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const el = {
    caseNameDisplay: () => $("#case-name-display"),
    stagePills: () => $$(".stagenav__pill"),
    railTools: () => $("#rail-tools"),
    railPanel: () => $("#rail-panel"),
    railPanelContent: () => $("#rail-panel-content"),
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
      pill.className = "stagenav__pill";
      if (isActive) pill.classList.add("stagenav__pill--active");
      else if (isScanned) pill.classList.add("stagenav__pill--scanned");

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
    const tools = TOOLS[state.stage] || [];
    const container = el.railTools();
    container.innerHTML = "";

    tools.forEach(function (tool, i) {
      // Add divider before second half
      if (i > 0 && i === Math.ceil(tools.length / 2)) {
        const div = document.createElement("span");
        div.className = "leftrail__divider";
        container.appendChild(div);
      }

      const btn = document.createElement("button");
      btn.className = "leftrail__tool-btn";
      if (state.selectedTool === tool.id) {
        btn.classList.add("leftrail__tool-btn--selected");
      }
      btn.title = tool.label;
      btn.setAttribute("aria-label", tool.label);
      btn.setAttribute("aria-pressed", state.selectedTool === tool.id);
      btn.innerHTML = '<svg class="icon icon--md"><use href="' + tool.icon + '"/></svg>';
      btn.addEventListener("click", function () {
        state.selectedTool = state.selectedTool === tool.id ? null : tool.id;
        renderLeftRail();
        renderPanel();
      });
      container.appendChild(btn);
    });

    renderPanel();
  }

  function renderPanel() {
    const panel = el.railPanel();
    const content = el.railPanelContent();

    if (!state.selectedTool) {
      panel.hidden = true;
      return;
    }

    panel.hidden = false;
    content.innerHTML = getPanelHTML(state.selectedTool);
  }

  function getPanelHTML(panelId) {
    switch (panelId) {
      case "smartscan":
        return '<div class="panel__title">Smart Scan</div>' +
          '<p class="panel__desc">AI-guided scanning with automatic coverage detection.</p>' +
          '<label class="panel__label">Mode<select class="panel__select"><option>Auto Detect</option><option>Upper Arch Only</option><option>Lower Arch Only</option></select></label>' +
          '<div class="panel__actions"><button class="panel__btn">Start Smart Scan</button></div>';
      case "tissue":
        return '<div class="panel__title">Tissue Filter</div>' +
          '<p class="panel__desc">Automatically remove soft tissue from scan data.</p>' +
          '<label class="panel__label">Sensitivity<input type="range" min="1" max="10" value="5" class="panel__slider"></label>' +
          '<div class="panel__actions"><button class="panel__btn">Enable</button><button class="panel__btn-secondary">Disable</button></div>';
      case "crop":
        return '<div class="panel__title">Crop</div>' +
          '<label class="panel__label">Radius<input type="range" min="1" max="20" value="5" class="panel__slider"></label>' +
          '<div class="panel__actions"><button class="panel__btn">Apply</button><button class="panel__btn-secondary">Cancel</button></div>';
      case "screenshot":
        return '<div class="panel__title">Screenshot</div>' +
          '<label class="panel__label">Format<select class="panel__select"><option>PNG</option><option>JPEG</option></select></label>' +
          '<div class="panel__actions"><button class="panel__btn">Capture</button></div>';
      case "quality":
        return '<div class="panel__title">Quality Check</div>' +
          '<p class="panel__desc">Verify scan coverage and data quality.</p>' +
          '<div class="quality-items">' +
          '<div class="quality-item"><span>Upper Arch</span><span class="quality-ok">Complete</span></div>' +
          '<div class="quality-item"><span>Lower Arch</span><span class="quality-ok">Complete</span></div>' +
          '<div class="quality-item"><span>Bite Registration</span><span class="quality-ok">Complete</span></div>' +
          '</div>';
      case "undercut":
        return '<div class="panel__title">Undercut Check</div>' +
          '<label class="panel__label">Sensitivity<input type="range" min="1" max="10" value="5" class="panel__slider"></label>' +
          '<div class="panel__actions"><button class="panel__btn">Show</button><button class="panel__btn-secondary">Hide</button></div>';
      default:
        return "";
    }
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
      input.value = state.caseName;
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
    // Stage nav
    el.stagePills().forEach(function (pill) {
      pill.addEventListener("click", function () {
        setStage(pill.dataset.stage);
      });
    });

    // Device status cycle
    el.btnDevice().addEventListener("click", cycleDeviceStatus);

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

    // Escape key for dialog
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && state.dialog) {
        closeDialog();
      }
    });

    // Input change in dialog
    el.dialogInput().addEventListener("input", function () {
      state.caseName = this.value;
    });

    // Initial render
    render();
  });
})();