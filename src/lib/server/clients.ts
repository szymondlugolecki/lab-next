import { Octokit } from "@octokit/core";
import { createOrUpdateTextFile } from "@octokit/plugin-create-or-update-text-file";
const ExtendedOcktokit = Octokit.plugin(createOrUpdateTextFile);

const octokit = new ExtendedOcktokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

export { octokit };
