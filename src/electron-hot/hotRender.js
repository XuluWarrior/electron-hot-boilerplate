const watchGlob = require('watch-glob');

const createProxy = require('../proxy/index');
const deepForceUpdate = require('react-deep-force-update');

const React = require('react');
const ReactDOM = require('react-dom');

module.exports = function hotRender(rootComponent, rootEl) {
    const proxy = createProxy.default(rootComponent);
    const Proxy = proxy.get();

    var rootInstance = ReactDOM.render(React.createElement(Proxy), rootEl);

    watchGlob(['src/**/*.jsx'], {callbackArg: 'absolute'}, f => {
        console.log(f);
        delete require.cache[require.resolve(f)];
        var newCompo = require(f);
        proxy.update(newCompo);
        deepForceUpdate(rootInstance);
    });
};