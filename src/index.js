//require('jsx-hook')({harmony: false});

const App = require('./ui/App.jsx');
const hotRender = require('./electron-hot/hotRender');
const hotCss = require('./electron-hot/hotCss');

hotRender(App, document.getElementById('root'));
hotCss();