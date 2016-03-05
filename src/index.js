if (process.env.NODE_ENV === 'development') {
    require('electron-hot-loader').install();
    const electronHot = require('electron-hot-loader');
    electronHot.watchJsx(['src/**/*.jsx']);
    electronHot.watchCss(['assets/**/*.css']);
}

require('./index.jsx');