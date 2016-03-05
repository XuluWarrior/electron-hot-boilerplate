require('./electron-hot/jsxTransform')();

const App = require('./ui/App.jsx');
const electronHot = require('./electron-hot');

electronHot.hotRender.render(App, document.getElementById('root'));
electronHot.hotRender.watch(['src/**/*.jsx']);
electronHot.hotCss(['assets/**/*.css']);