import * as core from '@actions/core';
import * as github from '@actions/github';
import { Actions } from './actions';
import { GitHub } from './github';
import { inputs } from './inputs';
import { Tag } from './lib/tag';
import { determineNextVersion, displayVersion } from './lib/utils';

async function run() {
  const token = core.getInput('token');
  const octokit = github.getOctokit(token);

  await octokit.rest.git.createRef({
    ...github.context.repo,
    ref: 'refs/tags/funky',
    sha: '05bea57ca7352f3deeb9d3af2d94c8bd9916be18'
  });

  displayVersion();
  const actions: Actions<any> = new GitHub(inputs.token);

  // get latest tag from branch
  const prevTag = await actions.getPrevTag();

  // get commits from branch
  const commits = await actions.getCommits(prevTag);

  // determine next version
  const nextVersion = determineNextVersion(
    prevTag?.version,
    commits,
    inputs.phase
  );
  const nextTag = nextVersion && new Tag(nextVersion);

  if (nextTag) {
    // create release branch if major version is bumped
    if (prevTag?.version && prevTag?.version.major < nextTag.version.major) {
      const prevTagCommitSha = await actions.getTagCommitSha(prevTag);
      await actions.branches.create(
        `refs/heads/${prevTag.version.major}.x`,
        prevTagCommitSha
      );
    }

    // create tag and draft release
    await actions.tags.create(nextTag.fqRef, commits[0].sha);
    const releaseId = await actions.releases.draft(prevTag, nextTag, commits);

    core.saveState('releaseId', releaseId);
    core.saveState('prevVersion', prevTag?.version.toString());
    core.saveState('nextVersion', nextTag.version.toString());

    core.setOutput('tag', nextTag.toString());
    core.setOutput('majorTag', nextTag.toMajorString());
    core.setOutput('version', nextTag.version.toString());
    core.setOutput('majorVersion', nextTag.version.major.toString());
    core.setOutput('created', true);
    core.setOutput('pre-release', nextTag.version.preRelease?.toString());
  } else {
    core.setOutput('created', false);
    core.setOutput('pre-release', undefined);
  }
}

run();
