// @ts-check

import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { lint } from "markdownlint/sync";

test.suite(import.meta.url.replace(/^.*?\/(?<name>[^/]*)$/u, "$<name>"), () => {

  // Simulates typing each test file to validate handling of partial input
  const files = fs
    .readdirSync("./test")
    .filter((file) => /\.md$/.test(file));
  for (const file of files) {
    /** @type {Object.<string, string>} */
    const strings = {};
    let content = fs.readFileSync(path.join("./test", file), "utf8");
    while (content) {
      strings[content.length.toString()] = content;
      content = content.slice(0, -1);
    }
    test(`type ${file}`, () => {
      lint({ strings });
    });
  }

});
