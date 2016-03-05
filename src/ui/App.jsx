"use strict";

const React = require('react');
const Component = require('./Component.jsx');
const register = require('../electron-hot/register');

module.exports = class App extends React.Component {
    render() {
        return <div>
          <h1>Hey!</h1>
          <Component text='Hello' />
        </div>
    }


};
