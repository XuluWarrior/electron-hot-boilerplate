require('jsx-hook')({harmony: true});

const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./src/App.jsx');

const watch = require('watch');

const createProxy = require('./src/proxy/index');
const deepForceUpdate = require('react-deep-force-update');

const proxy = createProxy.default(App);
const Proxy = proxy.get();

var rootInstance = ReactDOM.render(React.createElement(Proxy), document.getElementById('root'));


watch.createMonitor('./src', function (monitor) {
    monitor.on("changed", function (f, curr, prev) {
        console.log(f);
        delete require.cache[require.resolve('./' + f)];
        var newCompo = require('./' + f);
        proxy.update(newCompo);
        deepForceUpdate(rootInstance);
    });
});