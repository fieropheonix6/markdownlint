// @ts-check

import path from "node:path";
import test from "node:test";
const { join } = path.posix;
import { lintTestRepo } from "./markdownlint-test-repos.mjs";

test.suite(import.meta.url.replace(/^.*?\/(?<name>[^/]*)$/u, "$<name>"), () => {

  test("https://github.com/mdn/content", (t) => {
    const rootDir = "./test-repos/mdn-content";
    const globPatterns = [ join(rootDir, "**/*.md") ];
    const configPath = join(rootDir, ".markdownlint-cli2.jsonc");
    return lintTestRepo(t, globPatterns, configPath, undefined, true);
  });

});
