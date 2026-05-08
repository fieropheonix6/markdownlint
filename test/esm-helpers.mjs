// @ts-check

import fs from "node:fs/promises";
import path from "node:path";

/* eslint-disable jsdoc/no-undefined-types */
/* eslint-disable jsdoc/reject-any-type */

/**
 * Imports a file as JSON.
 * Avoids "ExperimentalWarning: Importing JSON modules is an experimental feature and might change at any time".
 *
 * @param {ImportMeta} meta ESM import.meta object.
 * @param {string} file JSON file to import.
 * @returns {Promise<any>} JSON object.
 */
export const importWithTypeJson = async(meta, file) => (
  // @ts-ignore
  JSON.parse(await fs.readFile(path.resolve(meta.dirname, file)))
);
