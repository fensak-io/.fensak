import {
  assert,
  assertFalse,
} from "https://deno.land/std@0.202.0/testing/asserts.ts";
import {
  compileRuleFn,
  IGitHubRepository,
  patchFromGitHubPullRequest,
  RuleFnSourceLang,
  RuleLogMode,
  runRule,
} from "npm:@fensak-io/reng@^1.2.1";
import { Octokit } from "npm:@octokit/rest@^20.0.0";

const __dirname = new URL(".", import.meta.url).pathname;
const ruleFn = compileRuleFn(
  await Deno.readTextFile(`${__dirname}/fensak_required_rule.ts`),
  RuleFnSourceLang.Typescript,
);
const octokit = new Octokit({
  auth: Deno.env.get("GITHUB_API_TOKEN"),
});
const fensakRepo: IGitHubRepository = {
  owner: "fensak-io",
  name: "fensak",
};
const opts = { logMode: RuleLogMode.Console };

Deno.test("Normal release PR should be approved", async () => {
  // View PR at
  // https://github.com/fensak-io/fensak/pull/125
  const patches = await patchFromGitHubPullRequest(octokit, fensakRepo, 125);
  const result = await runRule(
    ruleFn,
    patches.patchList,
    patches.metadata,
    opts,
  );
  assert(result.approve);
});

Deno.test("Normal PRs to main should be approved", async () => {
  // View PR at
  // https://github.com/fensak-io/fensak/pull/124
  const patches = await patchFromGitHubPullRequest(octokit, fensakRepo, 124);
  const result = await runRule(
    ruleFn,
    patches.patchList,
    patches.metadata,
    opts,
  );
  assert(result.approve);
});

Deno.test("PRs to release from a random branch should be rejected", async () => {
  // View PR at
  // https://github.com/fensak-io/fensak/pull/126
  const patches = await patchFromGitHubPullRequest(octokit, fensakRepo, 126);
  const result = await runRule(
    ruleFn,
    patches.patchList,
    patches.metadata,
    opts,
  );
  assertFalse(result.approve);
});
