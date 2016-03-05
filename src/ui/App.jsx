"use strict";

const React = require('react');
const Component = require('./Component.jsx');
const register = require('../electron-hot/register');

module.exports = class App extends React.Component {
    render() {
        return React.createElement("div", null,
            React.createElement("h1", null, "Hey "),
            React.createElement(register(Component, require.resolve('./Component.jsx')), null)
        )
    }

    //return <div>
    //  <h1>Hey hop</h1>
    //  <Component />
    //</div>
};
