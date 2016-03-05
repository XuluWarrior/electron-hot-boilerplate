"use strict";

const React = require('react');
const Component = require('./Component.jsx');

module.exports = class App extends React.Component {
    render() {
        return React.createElement("div", null,
            React.createElement("h1", null, "Hey lol"),
            React.createElement(Component, null)
        )
    }

    //return <div>
    //  <h1>Hey hop</h1>
    //  <Component />
    //</div>
};
