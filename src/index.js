require('./electron-hot/jsxTransform')();

const electronHot = require('./electron-hot');

require('./index.jsx');

electronHot.hotRender.watch(['src/**/*.jsx']);
electronHot.hotCss(['assets/**/*.css']);