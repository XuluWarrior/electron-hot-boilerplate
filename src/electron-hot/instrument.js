"use strict";

const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
var t = require('./nodeTypes');


module.exports = function instrument(source) {
    var ast = esprima.parse(source);

    estraverse.replace(ast, {
        enter: function (node, parent) {

            if (t.isCreateElementCall(node)) {

                var wrapperTemplate = esprima.parse(
                    [
                        'React.createElement(' +
                        '   register(COMPONENT_ARG, RESOLVE_ARG))'
                    ].join('')
                );

                var retNode = wrapperTemplate.body[0].expression;

                // change COMPONENT_ARG
                retNode.arguments[0].arguments[0] = node.arguments[0];
                retNode.arguments[0].arguments[1] = esprima.parse("require.resolve('./Component.jsx')").body[0].expression;

                //Prevent further traversal and ComponentWrapper wrapping
                this.skip();
                console.log(retNode);
                return retNode;
            }
        }

        //leave: function (node, parent) {
        //
        //    if (node.type === 'Program') {
        //
        //        var beforeChunk = esprima.parse(
        //            'var ComponentWrapper__DDL = require("!jsx-loader!component-flow-loader/runtime_components/component_wrapper.js");'
        //        );
        //
        //        node.body.unshift(beforeChunk);
        //        return node;
        //    }
        //}
    });

    return escodegen.generate(ast);
};