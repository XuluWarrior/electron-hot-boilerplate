require('./electron-hot/jsxTransform')();

const electronHot = require('./electron-hot');

require('./index.jsx');

electronHot.watchJsx(['src/**/*.jsx']);
electronHot.watchCss(['assets/**/*.css']);