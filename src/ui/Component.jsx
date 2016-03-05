"use strict";

const React = require('react');

module.exports = class Component extends React.Component {
  render() {
    //return <h3>Sub components</h3>
    return React.createElement("h3", null, "Sub components")
  }
};
