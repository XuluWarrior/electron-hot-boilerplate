'use strict';

const watchGlob = require('watch-glob');

const deepForceUpdate = require('react-deep-force-update');

const React = require('react');
const ReactDOM = require('react-dom');

const register = require('./register');

module.exports = {
    render,
    watch
};

let rootInstance;

function render(rootComponent, rootEl) {
    const proxy = register(rootComponent, '/Users/geowarin/dev/node-harmony/retro-js/src/ui/App.jsx');
    rootInstance = ReactDOM.render(React.createElement(proxy), rootEl);
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