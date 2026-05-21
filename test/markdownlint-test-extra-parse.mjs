// @ts-check

import test from "node:test";
import { globby } from "globby";
import { lint } from "markdownlint/promise";

test.suite(import.meta.url.replace(/^.*?\/(?<name>[^/]*)$/u, "$<name>"), () => {

  // Parses all Markdown files in all package dependencies
  test("parseAllFiles", async() => {
    const files = await globby("**/*.{md,markdown}");
    await lint({ files });
  });

});
