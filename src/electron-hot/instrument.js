"use strict";

const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
var t = require('./nodeTypes');


module.exports = function instrument(source) {
    var ast = esprima.parse(source);

    var requireDeclarationsByName = {};
    estraverse.traverse(ast, {
        enter: function (node) {
            if (t.isRequireDeclaration(node)) {
                requireDeclarationsByName[node.declarations[0].id.name] = node.declarations[0].init.arguments[0].value
            }
        }
    });

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

                const componentArg = node.arguments[0];
                const requireDeclaration = requireDeclarationsByName[componentArg.name];
                if (!requireDeclaration) {
                    console.warn("Could not find a require declaration for the component " + componentArg.name);
                    return node;
                }

                // change COMPONENT_ARG
                retNode.arguments[0].arguments[0] = componentArg;
                // RESOLVE_ARG
                retNode.arguments[0].arguments[1] = esprima.parse("require.resolve('" + requireDeclaration + "')").body[0].expression;

                //Prevent further traversal and ComponentWrapper wrapping
                this.skip();
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