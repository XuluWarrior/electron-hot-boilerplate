"use strict";

const React = require('react');

module.exports = class Component extends React.Component {
    render() {
        return <div>
            <h3>Sub component</h3>
            {this.props.text || 'no text'}
        </div>
    }
};
