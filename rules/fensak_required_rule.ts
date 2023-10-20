/**
 * A Fensak rule for the repositories that use release branch strategy. This rule requires that the source branch of the
 * release branch is set to main. This ensures that only the main branch can merge into the release branch.
 */

// fensak remove-start
import type { IChangeSetMetadata, IPatch } from "npm:@fensak-io/reng@^1.2.1";
// fensak remove-end

// deno-lint-ignore no-unused-vars
function main(_inp: IPatch[], metadata: IChangeSetMetadata): boolean {
  if (metadata.targetBranch === "release" && metadata.sourceBranch !== "main") {
    console.log(
      "Rejecting since merging non-main branch into the release branch.",
    );
    return false;
  }

  // Allow all other PRs.
  return true;
}
