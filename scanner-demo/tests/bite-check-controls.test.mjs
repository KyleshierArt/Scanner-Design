import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

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
