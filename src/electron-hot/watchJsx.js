'use strict';

const watchGlob = require('watch-glob');
const deepForceUpdate = require('react-deep-force-update');

module.exports = function watchJsx(directories, options) {
    const opts = Object.assign({}, options, {callbackArg: 'absolute'});
    watchGlob(directories, opts, f => {
        const cachedProxy = global.proxies[f];
        if (cachedProxy) {
            console.log('Hot reload', f);
            delete require.cache[require.resolve(f)];
            var newCompo = require(f);
            cachedProxy.update(newCompo);
            deepForceUpdate(global.rootInstance);
        }
    });
};