const conventionalRecommendedBump = require(`conventional-recommended-bump`);

conventionalRecommendedBump({
  preset: `angular`
}, (error, recommendation) => {
  if (error) {
    throw error;
  }
  console.log(`Bumping package version [${recommendation.releaseType}]`);
  const npm = require('npm');
  npm.load(function (e, n) {
    n.commands.version([recommendation.releaseType], function (error) {
      if (error) {
        throw error;
      }
      console.log('Package version bumped');
    });
  });
});
