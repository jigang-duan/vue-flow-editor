const ghpages = require('gh-pages');

ghpages.publish('dist', (err) => {
  console.error(err)
});
