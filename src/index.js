if (process.env.NODE_ENV === 'development') {
    require('./electron-hot/jsxTransform').install();
    const electronHot = require('./electron-hot');
    electronHot.watchJsx(['src/**/*.jsx']);
    electronHot.watchCss(['assets/**/*.css']);
}

require('./index.jsx');