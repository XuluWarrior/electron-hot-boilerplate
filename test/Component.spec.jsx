"use strict";

const expect = require('expect');
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const React = require('react');


enzyme.configure({ adapter: new Adapter() });

const Component = require('../src/ui/Component.jsx');

let props = {text: 'My Text'};

describe('component', () => {

    it('should render text', () => {
        const component = enzyme.shallow(<Component {...props} />);
        expect(component.text()).toMatch('My Text');
    });
});
