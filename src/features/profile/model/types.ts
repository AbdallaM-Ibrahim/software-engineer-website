/**
 * The profile feature's domain vocabulary.
 *
 * payload-types.ts is generated and 1200 lines wide. Re-exporting the slice a
 * feature actually owns means the generated file has one importer per feature
 * instead of eighteen scattered through the tree, and a feature's UI names its
 * own types rather than reaching into the CMS's.
 */
export type { Profile } from "@/payload-types";
