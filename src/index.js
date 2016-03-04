//require('node-jsx').install({harmony: true})
require('jsx-hook')({harmony: true});

const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./src/App.jsx');

ReactDOM.render(React.createElement(App), document.getElementById('root'));
