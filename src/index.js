require('jsx-hook')({harmony: true});

const App = require('./App.jsx');
const hotRender = require('./electron-hot/hotRender');

const watchGlob = require('watch-glob');

hotRender(App, document.getElementById('root'));

watchGlob(['assets/**/*.css'], {callbackArg: 'absolute'}, f => {
    console.log(f);
    var links = document.getElementsByTagName('link');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];

        if (link.href.indexOf('css') > -1) {
            link.href = link.href + '?id=' + new Date().getMilliseconds();
        }
    }
});