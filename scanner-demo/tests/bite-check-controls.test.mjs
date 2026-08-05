import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../app.js", import.meta.url), "utf8");

function buttonMarkup(id) {
  const match = html.match(new RegExp(`<button[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/button>`));
  assert.ok(match, `Expected #${id} to exist`);
  return match[0];
}

test("closed and open bite choices are separate icon-only buttons", () => {
  assert.doesNotMatch(html, /bite-check-controls__group/);
  assert.doesNotMatch(html, /bite-check-controls__pill-label/);

  for (const id of ["btn-bite-closed", "btn-bite-open"]) {
    const button = buttonMarkup(id);
    assert.match(button, /class="bite-check-controls__btn"/);
    assert.match(button, /<img\b/);
    assert.doesNotMatch(button, /<span\b/);
    assert.match(button, /aria-label="[^"]+"/);
  }
});

test("new scans require a type and save that type on their gallery card", () => {
  for (const type of ["Prosthodontics", "Implant", "Orthodontics", "Model"]) {
    assert.match(app, new RegExp(`"${type}"`));
  }

  assert.match(app, /function openScanTypePicker\(\)/);
  assert.match(app, /data-action="select-scan-type"/);
  assert.match(app, /data-action="go-scan"/);
  assert.match(app, /if \(!state\.selectedScanType\) return;/);
  assert.match(app, /orderType: state\.selectedScanType/);
});

test("switching patients exits the scan type picker so the new gallery is shown", () => {
  assert.match(
    app,
    /function selectPatient\(id\) \{[\s\S]*?state\.isScanTypePickerOpen = false;[\s\S]*?state\.selectedScanType = null;[\s\S]*?state\.selectedPatientId = id;/
  );
});

test("gallery export opens a configurable export dialog", () => {
  for (const id of [
    "export-overlay",
    "export-path",
    "export-folder-name",
    "export-format-stl",
    "export-format-ply",
    "export-format-obj",
    "export-confirm",
    "export-cancel",
  ]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }

  assert.match(html, /id="export-format-stl" type="checkbox" checked/);
  assert.match(html, /id="export-browse"[^>]*><svg class="icon icon--sm" aria-hidden="true"><use href="#icon-more-h"\/><\/svg><\/button>/);
  assert.match(app, /function formatExportFolderName\(date\)/);
  assert.match(app, /openExportDialog\(id\);/);
  assert.match(app, /function closeExportDialog\(\)/);
});

test("stopped scans use the error dialog treatment", () => {
  assert.match(
    app,
    /scanLimitStopped: \{[\s\S]*?title: "Error",[\s\S]*?variant: "error",/
  );
  assert.match(app, /meta\.variant === "warning" \|\| meta\.variant === "error"/);
});
