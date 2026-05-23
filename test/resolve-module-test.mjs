// @ts-check

import path from "node:path";
import test from "node:test";
import { resolveModule, resolveModuleCustomResolve } from "../lib/resolve-module.cjs";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

test.suite(import.meta.url.replace(/^.*?\/(?<name>[^/]*)$/u, "$<name>"), () => {

  test("built-in module", (t) => {
    t.plan(1);
    t.assert.deepEqual(
      resolveModule("node:fs"),
      require.resolve("node:fs")
    );
  });

  test("locally-installed module", (t) => {
    t.plan(1);
    t.assert.deepEqual(
      resolveModule("micromark"),
      require.resolve("micromark")
    );
  });

  test("absolute path to module", (t) => {
    t.plan(1);
    const absolute =
      path.resolve(
        import.meta.dirname,
        "./rules/node_modules/markdownlint-rule-sample-commonjs"
      );
    t.assert.deepEqual(
      resolveModule(absolute),
      require.resolve(absolute)
    );
  });

  test("relative (to import.meta.dirname) path to module", (t) => {
    t.plan(1);
    t.assert.deepEqual(
      resolveModule(
        "./rules/node_modules/markdownlint-rule-sample-module",
        // import.meta.dirname is needed because require.resolve is relative to this
        // file while resolveModule is relative to resolve-module.cjs
        [ import.meta.dirname ]
      ),
      require.resolve(
        "./rules/node_modules/markdownlint-rule-sample-module"
      )
    );
  });

  test("module in alternate node_modules", (t) => {
    t.plan(3);
    t.assert.throws(
      () => require.resolve("markdownlint-rule-sample-commonjs"),
      { "code": "MODULE_NOT_FOUND" }
    );
    t.assert.throws(
      () => resolveModule("markdownlint-rule-sample-commonjs"),
      { "code": "MODULE_NOT_FOUND" }
    );
    t.assert.deepEqual(
      resolveModule(
        "markdownlint-rule-sample-commonjs",
        [ path.join(import.meta.dirname, "rules") ]
      ),
      require.resolve(
        "markdownlint-rule-sample-commonjs",
        { "paths": [ path.join(import.meta.dirname, "rules") ] }
      )
    );
  });

  test("module local, relative, and in alternate node_modules (same paths)", (t) => {
    t.plan(3);
    const paths = [
      import.meta.dirname,
      path.join(import.meta.dirname, "rules")
    ];
    t.assert.deepEqual(
      resolveModule(
        "micromark",
        paths
      ),
      require.resolve(
        "micromark",
        { paths }
      )
    );
    t.assert.deepEqual(
      resolveModule(
        "./rules/node_modules/markdownlint-rule-sample-commonjs",
        paths
      ),
      require.resolve(
        "./rules/node_modules/markdownlint-rule-sample-commonjs",
        { paths }
      )
    );
    t.assert.deepEqual(
      resolveModule(
        "markdownlint-rule-sample-commonjs",
        paths
      ),
      require.resolve(
        "markdownlint-rule-sample-commonjs",
        { paths }
      )
    );
  });

  test("custom resolve implementation", (t) => {
    t.plan(1);
    const expected =
      require.resolve("./rules/node_modules/markdownlint-rule-sample-module");
    const customResolve = (/** @type {string} */ id, /** @type {import("../lib/resolve-module.cjs").RequireResolveOptions} */ options) => require.resolve(id, options);
    customResolve.paths = (/** @type {string} */ request) => require.resolve.paths(request);
    t.assert.deepEqual(
      resolveModuleCustomResolve(
        customResolve,
        "./rules/node_modules/markdownlint-rule-sample-module",
        [ import.meta.dirname ]
      ),
      expected
    );
  });

  test("custom resolve implementation, missing paths", (t) => {
    t.plan(1);
    const expected =
      require.resolve("./rules/node_modules/markdownlint-rule-sample-commonjs");
    const customResolve = (/** @type {string} */ id, /** @type {import("../lib/resolve-module.cjs").RequireResolveOptions} */ options) => require.resolve(id, options);
    t.assert.deepEqual(
      resolveModuleCustomResolve(
        // @ts-ignore
        customResolve,
        "./rules/node_modules/markdownlint-rule-sample-commonjs",
        [ import.meta.dirname ]
      ),
      expected
    );
  });

});
