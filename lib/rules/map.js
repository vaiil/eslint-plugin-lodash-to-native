/**
 * @fileoverview _.map to Array.map
 * @author Aleksey Orlov
 */
'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: '_.map to Array.map',
      category: 'Fill me in',
      recommended: false
    },
    messages: {
      useNativeMapMethod: 'Use native Array.map method'
    },
    fixable: 'code',  // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create: function (context) {
    const sourceCode = context.getSourceCode()
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    function fixToArrayMethod (node, fixer) {
      const arrayCode = sourceCode.getText(node.arguments[0])
      const callbackCode = sourceCode.getText(node.arguments[1])
      return fixer.replaceText(node, `${arrayCode}.map(${callbackCode})`)
    }

    function doesExpressionCheckArray (expression, variable) {
      if (
        expression.type === 'CallExpression'
        && expression.callee.object.name === 'Array'
        && expression.callee.property.name === 'isArray'
        && expression.arguments.length === 1
        && expression.arguments[0].type === 'Identifier'
        && expression.arguments[0].name === variable.name
      ) {
        return true
      }
      //TODO check instance of
      return false
    }

    /**
     * Looking for array checks
     * @param variable
     * @return {(null|boolean)}
     */
    function checkIsArray (variable) {
      let node = variable
      while (node.parent) {
        if (node.parent.type === 'ConditionalExpression') {
          if (doesExpressionCheckArray(node.parent.test, variable)) {
            return node === node.parent.consequent
          }
        }
        node = node.parent
      }
      return null
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      'CallExpression[callee.object.name="_"][callee.property.name="map"]' (node) {
        const error = { messageId: 'useNativeMapMethod', node }

        // Fix only if two arguments
        if (node.arguments.length === 2) {
          switch (node.arguments[0].type) {
            case 'ArrayExpression':
              error.fix = fixToArrayMethod.bind(this, node)
              break
            case 'Identifier':
              const isArray = checkIsArray(node.arguments[0])
              if (isArray === false) {
                return
              } else if (isArray === true) {
                error.fix = fixToArrayMethod.bind(this, node)
              }

              break
          }
        }

        context.report(error)
      }
    }
  }
}
