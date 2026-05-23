// @ts-check

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import test from "node:test";
import { globby } from "globby";
import { lint as lintPromise } from "markdownlint/promise";

const projectFiles = [
  "*.md",
  "doc/*.md",
  "helpers/*.md",
  "micromark/*.md",
  "schema/*.md"
];
const files = await globby(projectFiles);

test.suite(import.meta.url.replace(/^.*?\/(?<name>[^/]*)$/u, "$<name>"), () => {

  test("projectFiles", (t) => {
    t.plan(2);
    t.assert.equal(files.length, 62);
    const options = {
      files,
      "config": require("../.markdownlint.json")
    };
    return lintPromise(options).then((actual) => {
      /** @type {Object.<string, string[]>} */
      const expected = {};
      for (const file of files) {
        expected[file] = [];
      }
      t.assert.deepEqual(actual, expected, "Issue(s) with project files.");
    });
  });

  test("projectFilesExtendedAscii", (t) => {
    t.plan(2);
    const ignoreFiles = new Set([
      "doc/Rules.md",
      "doc/md010.md",
      "doc/md026.md",
      "doc/md036.md"
    ]);
    const filteredFiles = files.filter((file) => !ignoreFiles.has(file));
    t.assert.equal(filteredFiles.length, 58);
    const options = {
      "files": filteredFiles,
      "config": require("../.markdownlint.json"),
      "customRules": [ require("markdownlint-rule-extended-ascii") ]
    };
    return lintPromise(options).then((actual) => {
      /** @type {Object.<string, string[]>} */
      const expected = {};
      for (const file of filteredFiles) {
        expected[file] = [];
      }
      t.assert.deepEqual(actual, expected, "Issue(s) with project files.");
    });
  });

});
