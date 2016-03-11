const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./ui/containers/App.jsx');

const Provider = require('react-redux').Provider;
const createStore = require('redux').createStore;

const counter = require('./reducer/counter');

const store = createStore(counter);

ReactDOM.render(<Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));