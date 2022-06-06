const git = require('simple-git');

const getGitDiff = () => {
  return new Promise((resolve, reject) => {
    git().diffSummary((err, diffSummary) => {
      if (err) {
        reject(err);
      }

      resolve(diffSummary);
    });
  });
};

const gitDiff = async () => {
  const diff = await getGitDiff();
  if (!diff) {
    throw new Error('Git diff undefined');
  }
  // Check for diff inside dist
  if (diff.changed !== 0) {
    const filesChanged = diff.files.map(f => f.file).join(', ');
    console.error(`Files changed: ${filesChanged}`);
    throw new Error(`Git diff test failed, files changed: ${diff.changed}`);
  }
}

gitDiff();
