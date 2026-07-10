// @ts-check

/* eslint-disable no-console */

import { resolveModule } from "../lib/resolve-module.cjs";

const micromark = resolveModule("micromark");
if (micromark.endsWith("index.js")) {
  console.log("OK");
} else {
  console.error("FAIL");
  process.exitCode = 1;
}
