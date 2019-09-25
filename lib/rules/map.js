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

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      'CallExpression[callee.object.name="_"][callee.property.name="map"]' (node) {
        const error = { messageId: 'useNativeMapMethod', node }
        if (node.arguments.length === 2 && node.arguments[0].type === 'ArrayExpression') {
          error.fix = function (fixer) {
            const arrayCode = sourceCode.getText(node.arguments[0])
            const callbackCode = sourceCode.getText(node.arguments[1])

            return fixer
              .replaceText(node, `${arrayCode}.map(${callbackCode})`)

          }
        }
        context.report(error)
      }
    }
  }
}
