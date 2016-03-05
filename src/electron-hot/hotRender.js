const watchGlob = require('watch-glob');

const createProxy = require('../proxy/index');
const deepForceUpdate = require('react-deep-force-update');

const React = require('react');
const ReactDOM = require('react-dom');

module.exports = function hotRender(rootComponent, rootEl) {
    const proxy = createProxy.default(rootComponent);
    const Proxy = proxy.get();
    global.proxies = {
        '/Users/geowarin/dev/node-harmony/retro-js/src/ui/App.jsx': proxy
    };

    var rootInstance = ReactDOM.render(React.createElement(Proxy), rootEl);

    watchGlob(['src/**/*.jsx'], {callbackArg: 'absolute'}, f => {
        console.log('Hot reload', f);
        const cachedProxy = global.proxies[f];
        if (cachedProxy) {
            delete require.cache[require.resolve(f)];
            var newCompo = require(f);
            cachedProxy.update(newCompo);
            deepForceUpdate(rootInstance);
        }
    });
};