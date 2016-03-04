//require('jsx-hook')({harmony: true});

const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./src/App.jsx');
const App2 = require('./src/App2.jsx');

const createProxy = require('./src/proxy/index');
const deepForceUpdate = require('react-deep-force-update');

const proxy = createProxy.default(App);
const Proxy = proxy.get();

var rootInstance = ReactDOM.render(React.createElement(Proxy), document.getElementById('root'));

setTimeout(() => {
    proxy.update(App2);
    deepForceUpdate(rootInstance);
}, 1000);
