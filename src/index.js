require('jsx-hook')({harmony: true});

const App = require('./App.jsx');
const hotRender = require('./electron-hot/hotRender');
const hotCss = require('./electron-hot/hotCss');

hotRender(App, document.getElementById('root'));
hotCss();