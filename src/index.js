require('./electron-hot/jsxTransform').install();

const electronHot = require('./electron-hot');

require('./index.jsx');

electronHot.watchJsx(['src/**/*.jsx']);
electronHot.watchCss(['assets/**/*.css']);