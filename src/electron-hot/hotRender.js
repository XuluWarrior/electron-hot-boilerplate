'use strict';

const watchGlob = require('watch-glob');

const createProxy = require('react-proxy/modules/index');
const deepForceUpdate = require('react-deep-force-update');

const React = require('react');
const ReactDOM = require('react-dom');

module.exports = {
    render,
    watch
};

let rootInstance;

function render(rootComponent, rootEl) {
    const proxy = createProxy.default(rootComponent);
    const Proxy = proxy.get();
    global.proxies = {
        '/Users/geowarin/dev/node-harmony/retro-js/src/ui/App.jsx': proxy
    };

    rootInstance = ReactDOM.render(React.createElement(Proxy), rootEl);
}

function watch(directories, options) {
    const opts = Object.assign({}, options, {callbackArg: 'absolute'});
    watchGlob(directories, opts, f => {
        console.log('Hot reload', f);
        const cachedProxy = global.proxies[f];
        if (cachedProxy) {
            delete require.cache[require.resolve(f)];
            var newCompo = require(f);
            cachedProxy.update(newCompo);
            deepForceUpdate(rootInstance);
        }
    });
}