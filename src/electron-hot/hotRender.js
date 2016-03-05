'use strict';

const watchGlob = require('watch-glob');

const deepForceUpdate = require('react-deep-force-update');

const register = require('./register');

module.exports = {
    watch
};

function watch(directories, options) {
    const opts = Object.assign({}, options, {callbackArg: 'absolute'});
    watchGlob(directories, opts, f => {
        console.log('Hot reload', f);
        const cachedProxy = global.proxies[f];
        if (cachedProxy) {
            delete require.cache[require.resolve(f)];
            var newCompo = require(f);
            cachedProxy.update(newCompo);
            deepForceUpdate(global.rootInstance);
        } else {
            console.warn(f + " is not in cache")
        }
    });
}