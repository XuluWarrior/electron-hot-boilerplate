const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./ui/containers/App.jsx');
const watchGlob = require('watch-glob');

const Provider = require('react-redux').Provider;
const createStore = require('redux').createStore;

const counter = require('./reducer/counter');

const store = createStore(counter);

watchGlob(['src/reducer/**/*.js'], {callbackArg: 'absolute'}, f => {
    console.log('Hot reload reducer', f);
    delete require.cache[require.resolve(f)];
    const nextReducer = require(f);
    store.replaceReducer(nextReducer);
});

ReactDOM.render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));